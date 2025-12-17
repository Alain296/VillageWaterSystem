"""
API Views for Village Water System
"""
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta, date
from decimal import Decimal
import csv
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet



from .models import User, Household, TariffRate, WaterUsage, Bill, Payment, SMSNotification, Notification
from .serializers import (
    UserSerializer, HouseholdSerializer, TariffRateSerializer,
    WaterUsageSerializer, BillSerializer, PaymentSerializer,
    DashboardStatsSerializer, RevenueChartSerializer,
    BillStatusChartSerializer, TopConsumerSerializer,
    SMSNotificationSerializer, NotificationSerializer
)
from .sms_service import SMSService
from .notification_service import NotificationService
from .permissions import IsAdminUser, IsManagerOrAdmin, IsHouseholdOwner
from .sms_service import sms_service


# ============================================
# Authentication Views
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Auto-create Household record if user role is Household
        if user.role == 'Household':
            try:
                # Extract household data from request
                household_data = {
                    'household_name': request.data.get('household_name', user.full_name),
                    'head_of_household': request.data.get('head_of_household', user.full_name),
                    'national_id': request.data.get('national_id', ''),
                    'address': request.data.get('address', ''),
                    'sector': request.data.get('sector', ''),
                    'cell': request.data.get('cell', ''),
                    'village': request.data.get('village', ''),
                    'phone_number': request.data.get('phone_number', user.phone_number),
                    'email': user.email,
                    'number_of_members': request.data.get('number_of_members', 1),
                    'meter_number': request.data.get('meter_number', ''),
                    'connection_date': request.data.get('connection_date', date.today()),
                    'status': 'Active',
                    'registered_by': user,
                    'user': user
                }
                
                # Create Household record
                household = Household.objects.create(**household_data)
                
            except Exception as e:
                # If household creation fails, delete the user and return error
                user.delete()
                return Response({
                    'error': f'Failed to create household record: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Please provide both username and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    if user.status != 'Active':
        return Response({
            'error': 'Account is inactive'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Update last login
    user.last_login = timezone.now()
    user.save()
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Login successful',
        'user': UserSerializer(user).data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    """Get current user details"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ============================================
# User ViewSet
# ============================================

class UserViewSet(viewsets.ModelViewSet):
    """User CRUD operations (Admin only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        """Filter users based on role"""
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        status_filter = self.request.query_params.get('status', None)
        
        if role:
            queryset = queryset.filter(role=role)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_date')
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """Allow users to change their own password"""
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response({
                'error': 'Both old_password and new_password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify old password
        if not user.check_password(old_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password length
        if len(new_password) < 8:
            return Response({
                'error': 'New password must be at least 8 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


# ============================================
# Household ViewSet
# ============================================

class HouseholdViewSet(viewsets.ModelViewSet):
    """Household CRUD operations"""
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter households based on user role"""
        user = self.request.user
        queryset = Household.objects.all()
        
        # Household users can only see their own household
        if user.role == 'Household':
            queryset = queryset.filter(user=user)
        
        # Apply filters
        status_filter = self.request.query_params.get('status', None)
        search = self.request.query_params.get('search', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if search:
            queryset = queryset.filter(
                Q(household_code__icontains=search) |
                Q(household_name__icontains=search) |
                Q(head_of_household__icontains=search) |
                Q(national_id__icontains=search)
            )
        
        return queryset.order_by('-registration_date')
    
    def perform_create(self, serializer):
        """Set registered_by to current user"""
        serializer.save(registered_by=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_csv(self, request):
        """Export households to CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="households_{datetime.now().strftime("%Y%m%d")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Household Code', 'Name', 'Head of Household', 'National ID', 'Phone', 'Status', 'Registration Date'])
        
        households = self.filter_queryset(self.get_queryset())
        for household in households:
            writer.writerow([
                household.household_code,
                household.household_name,
                household.head_of_household,
                household.national_id,
                household.phone_number,
                household.status,
                household.registration_date
            ])
            
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_pdf(self, request):
        """Export households to PDF"""
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="households_{datetime.now().strftime("%Y%m%d")}.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        
        styles = getSampleStyleSheet()
        elements.append(Paragraph("Registered Households Report", styles['Title']))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Paragraph(" ", styles['Normal']))  # Spacer
        
        data = [['Code', 'Name', 'Head', 'Phone', 'Status']]
        
        households = self.filter_queryset(self.get_queryset())
        for household in households:
            data.append([
                household.household_code,
                household.household_name,
                household.head_of_household,
                household.phone_number,
                household.status
            ])
            
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        return response


# ============================================
# Tariff Rate ViewSet
# ============================================

class TariffRateViewSet(viewsets.ModelViewSet):
    """Tariff Rate CRUD operations"""
    queryset = TariffRate.objects.all()
    serializer_class = TariffRateSerializer
    
    def get_permissions(self):
        """Allow all authenticated users to view, but only managers/admins to modify"""
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsManagerOrAdmin()]
    
    def get_queryset(self):
        """Get tariff rates"""
        queryset = TariffRate.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('-created_date')
    
    def perform_create(self, serializer):
        """Set set_by to current user and notify households"""
        tariff = serializer.save(set_by=self.request.user)
        try:
            NotificationService.notify_tariff_change(tariff, action='created')
        except Exception as e:
            print(f"Failed to send tariff notification: {e}")

    def perform_update(self, serializer):
        """Update tariff and notify households"""
        tariff = serializer.save()
        try:
            NotificationService.notify_tariff_change(tariff, action='updated')
        except Exception as e:
            print(f"Failed to send tariff notification: {e}")

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_csv(self, request):
        """Export tariff rates to CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="tariff_rates_{datetime.now().strftime("%Y%m%d")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Rate Name', 'Rate Per Liter (RWF)', 'Effective From', 'Effective To', 'Is Active', 'Set By'])
        
        tariffs = self.filter_queryset(self.get_queryset())
        for tariff in tariffs:
            writer.writerow([
                tariff.rate_name,
                tariff.rate_per_liter,
                tariff.effective_from,
                tariff.effective_to if tariff.effective_to else 'N/A',
                'Yes' if tariff.is_active else 'No',
                tariff.set_by.username if tariff.set_by else 'System'
            ])
            
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_pdf(self, request):
        """Export tariff rates to PDF"""
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="tariff_rates_{datetime.now().strftime("%Y%m%d")}.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        
        styles = getSampleStyleSheet()
        elements.append(Paragraph("Tariff Rates Report", styles['Title']))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Paragraph(" ", styles['Normal']))
        
        data = [['Rate Name', 'Rate/Liter', 'From', 'To', 'Active']]
        
        tariffs = self.filter_queryset(self.get_queryset())
        for tariff in tariffs:
            data.append([
                tariff.rate_name,
                str(tariff.rate_per_liter),
                str(tariff.effective_from),
                str(tariff.effective_to) if tariff.effective_to else 'N/A',
                'Yes' if tariff.is_active else 'No'
            ])
            
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        return response



# ============================================
# Water Usage ViewSet
# ============================================

class WaterUsageViewSet(viewsets.ModelViewSet):
    """Water Usage CRUD operations"""
    queryset = WaterUsage.objects.all()
    serializer_class = WaterUsageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter water usage based on user role"""
        user = self.request.user
        queryset = WaterUsage.objects.all()
        
        # Household users can only see their own usage
        if user.role == 'Household':
            try:
                household = user.household
                queryset = queryset.filter(household=household)
            except:
                queryset = queryset.none()
        
        # Apply filters
        household_id = self.request.query_params.get('household_id', None)
        reading_month = self.request.query_params.get('reading_month', None)
        status_filter = self.request.query_params.get('status', None)
        
        if household_id:
            queryset = queryset.filter(household_id=household_id)
        if reading_month:
            queryset = queryset.filter(reading_month=reading_month)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-reading_date')
    
    def perform_create(self, serializer):
        """Set recorded_by to current user and validate household"""
        user = self.request.user
        if user.role == 'Household':
            try:
                # Force the household to be the user's household
                # Verify that the user actually has a household linked
                if not hasattr(user, 'household'):
                    from rest_framework.exceptions import PermissionDenied
                    raise PermissionDenied("You must have a linked household profile.")
                serializer.save(recorded_by=user, household=user.household)
            except Exception as e:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied(f"Error recording usage: {str(e)}")
        else:
            serializer.save(recorded_by=user)

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_csv(self, request):
        """Export water usage to CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="water_usage_{datetime.now().strftime("%Y%m%d")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Household Code', 'Household Name', 'Reading Month', 'Previous Reading', 'Current Reading', 'Liters Used', 'Reading Date', 'Status'])
        
        usage_records = self.filter_queryset(self.get_queryset())
        for usage in usage_records:
            writer.writerow([
                usage.household.household_code,
                usage.household.household_name,
                usage.reading_month,
                usage.previous_reading,
                usage.current_reading,
                usage.liters_used,
                usage.reading_date,
                usage.status
            ])
            
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_pdf(self, request):
        """Export water usage to PDF"""
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="water_usage_{datetime.now().strftime("%Y%m%d")}.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        
        styles = getSampleStyleSheet()
        elements.append(Paragraph("Water Usage Report", styles['Title']))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Paragraph(" ", styles['Normal']))
        
        data = [['Household', 'Month', 'Prev', 'Current', 'Liters', 'Status']]
        
        usage_records = self.filter_queryset(self.get_queryset())
        for usage in usage_records:
            data.append([
                usage.household.household_code,
                usage.reading_month,
                str(usage.previous_reading),
                str(usage.current_reading),
                str(usage.liters_used),
                usage.status
            ])
            
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        return response



# ============================================
# Bill ViewSet
# ============================================

class BillViewSet(viewsets.ModelViewSet):
    """Bill CRUD operations"""
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter bills based on user role"""
        user = self.request.user
        queryset = Bill.objects.all()
        
        # Household users can only see their own bills
        if user.role == 'Household':
            try:
                household = user.household
                queryset = queryset.filter(household=household)
            except:
                queryset = queryset.none()
        
        # Apply filters
        household_id = self.request.query_params.get('household_id', None)
        status_filter = self.request.query_params.get('status', None)
        billing_period = self.request.query_params.get('billing_period', None)
        
        if household_id:
            queryset = queryset.filter(household_id=household_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if billing_period:
            queryset = queryset.filter(billing_period=billing_period)
        
        return queryset.order_by('-bill_date')
    
    def perform_create(self, serializer):
        """Set generated_by to current user and validate household"""
        user = self.request.user
        if user.role == 'Household':
            try:
                # Force the household to be the user's household
                if not hasattr(user, 'household'):
                    from rest_framework.exceptions import PermissionDenied
                    raise PermissionDenied("You must have a linked household profile.")
                
                # Check if bill for this period already exists? 
                # The serializer usually handles unique constraints, but perform_create logic is safer here.
                serializer.save(generated_by=user, household=user.household)
            except Exception as e:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied(f"Error generating bill: {str(e)}")
        else:
            serializer.save(generated_by=user)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def generate_bills(self, request):
        """Generate bills for all households or specific household"""
        # Restrict Household users to only generating their own bill
        if request.user.role == 'Household':
            if not hasattr(request.user, 'household'):
                return Response({'error': 'No household profile found'}, status=status.HTTP_403_FORBIDDEN)
            
            requested_id = request.data.get('household_id')
            # If they requested a specific ID, it MUST match theirs. 
            # If they didn't request one, we default to theirs.
            if requested_id and str(requested_id) != str(request.user.household.household_id):
                 return Response({'error': 'You can only generate bills for your own household'}, status=status.HTTP_403_FORBIDDEN)
            
            # Force household_id to be theirs
            request.data['household_id'] = request.user.household.household_id
            household_id = request.user.household.household_id
        else:
            # Managers/Admins can do whatever
            if request.user.role not in ['Admin', 'Manager']:
                 return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            household_id = request.data.get('household_id')

        billing_period = request.data.get('billing_period')  # Format: YYYY-MM
        
        if not billing_period:
            return Response({
                'error': 'Billing period is required (format: YYYY-MM)'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get active tariff rate
        tariff = TariffRate.objects.filter(is_active=True).first()
        if not tariff:
            return Response({
                'error': 'No active tariff rate found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get households
        if household_id:
            households = Household.objects.filter(household_id=household_id, status='Active')
        else:
            households = Household.objects.filter(status='Active')
        
        bills_created = []
        errors = []
        
        for household in households:
            try:
                # Check if bill already exists
                existing_bill = Bill.objects.filter(
                    household=household,
                    billing_period=billing_period
                ).first()
                
                if existing_bill:
                    errors.append(f"Bill already exists for {household.household_code}")
                    continue
                
                # Get water usage for this period
                usage = WaterUsage.objects.filter(
                    household=household,
                    reading_month=billing_period
                ).first()
                
                if not usage:
                    errors.append(f"No usage record found for {household.household_code}")
                    continue
                
                # Calculate bill
                liters_consumed = usage.liters_used
                rate_applied = tariff.rate_per_liter
                subtotal = liters_consumed * rate_applied
                
                # Create bill
                bill = Bill.objects.create(
                    household=household,
                    usage=usage,
                    tariff=tariff,
                    liters_consumed=liters_consumed,
                    rate_applied=rate_applied,
                    subtotal=subtotal,
                    total_amount=subtotal,
                    bill_date=date.today(),
                    due_date=date.today() + timedelta(days=30),
                    billing_period=billing_period,
                    generated_by=request.user
                )
                
                # Update usage status
                usage.status = 'Billed'
                usage.save()
                
                # Send SMS and In-App notification
                try:
                    sms_service.send_bill_notification(bill)
                    NotificationService.notify_new_bill(bill)
                except Exception as e:
                    print(f"Failed to send notifications: {e}")
                
                bills_created.append(BillSerializer(bill).data)
                
            except Exception as e:
                errors.append(f"Error for {household.household_code}: {str(e)}")
        
        return Response({
            'message': f'{len(bills_created)} bills generated successfully',
            'bills': bills_created,
            'errors': errors
        }, status=status.HTTP_201_CREATED if bills_created else status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_csv(self, request):
        """Export bills to CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="bills_{datetime.now().strftime("%Y%m%d")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Bill Number', 'Household Code', 'Household Name', 'Billing Period', 'Liters Consumed', 'Rate Applied', 'Total Amount', 'Status', 'Due Date'])
        
        bills = self.filter_queryset(self.get_queryset())
        for bill in bills:
            writer.writerow([
                bill.bill_number,
                bill.household.household_code,
                bill.household.household_name,
                bill.billing_period,
                bill.liters_consumed,
                bill.rate_applied,
                bill.total_amount,
                bill.status,
                bill.due_date
            ])
            
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_pdf(self, request):
        """Export bills to PDF"""
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="bills_{datetime.now().strftime("%Y%m%d")}.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        
        styles = getSampleStyleSheet()
        elements.append(Paragraph("Bills Report", styles['Title']))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Paragraph(" ", styles['Normal']))
        
        data = [['Bill No', 'Household', 'Period', 'Liters', 'Amount', 'Status']]
        
        bills = self.filter_queryset(self.get_queryset())
        for bill in bills:
            data.append([
                bill.bill_number,
                bill.household.household_code,
                bill.billing_period,
                str(bill.liters_consumed),
                str(bill.total_amount),
                bill.status
            ])
            
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        return response



# ============================================
# Payment ViewSet
# ============================================

class PaymentViewSet(viewsets.ModelViewSet):
    """Payment CRUD operations"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter payments based on user role"""
        user = self.request.user
        queryset = Payment.objects.all()
        
        # Household users can only see their own payments
        if user.role == 'Household':
            try:
                household = user.household
                queryset = queryset.filter(bill__household=household)
            except:
                queryset = queryset.none()
        
        # Apply filters
        bill_id = self.request.query_params.get('bill_id', None)
        payment_method = self.request.query_params.get('payment_method', None)
        payment_status = self.request.query_params.get('payment_status', None)
        
        if bill_id:
            queryset = queryset.filter(bill_id=bill_id)
        if payment_method:
            queryset = queryset.filter(payment_method=payment_method)
        if payment_status:
            queryset = queryset.filter(payment_status=payment_status)
        
        return queryset.order_by('-payment_date', '-payment_time')
    
    def perform_create(self, serializer):
        """Handle payment creation for both admin and household users"""
        user = self.request.user
        bill = serializer.validated_data['bill']
        
        # Validate: Household can only pay their own bills
        if user.role == 'Household':
            try:
                household = user.household
                if bill.household != household:
                    from rest_framework.exceptions import PermissionDenied
                    raise PermissionDenied("You can only pay your own bills")
            except:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Household not found")
        
        # Set payment details
        payment = serializer.save(
            submitted_by=user,
            received_by=user if user.role in ['Admin', 'Manager'] else None,
            payment_date=date.today(),
            payment_time=datetime.now().time()
        )
        
        # Send SMS confirmation
        try:
            sms_service.send_payment_confirmation(payment)
        except Exception as e:
            print(f"Failed to send SMS: {e}")
            
        # Send In-App Notifications
        try:
            print(f"DEBUG: Processing notifications for payment {payment.receipt_number} by {user.role}")
            if user.role == 'Household':
                # Household paying: Notify admins
                print("DEBUG: Triggering notify_household_payment")
                NotificationService.notify_household_payment(payment)
            else:
                # Admin recording payment: Notify household
                print("DEBUG: Triggering notify_admin_payment")
                print(f"DEBUG: Payment bill household user: {payment.bill.household.user}")
                NotificationService.notify_admin_payment(payment)
        except Exception as e:
            print(f"Failed to send notification: {e}")
            import traceback
            traceback.print_exc()

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_csv(self, request):
        """Export payments to CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="payments_{datetime.now().strftime("%Y%m%d")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Receipt No', 'Date', 'Household', 'Amount', 'Method', 'Status', 'Received By'])
        
        payments = self.filter_queryset(self.get_queryset())
        for payment in payments:
            writer.writerow([
                payment.receipt_number,
                payment.payment_date,
                payment.bill.household.household_name if payment.bill else 'N/A',
                payment.amount_paid,
                payment.payment_method,
                payment.payment_status,
                payment.received_by.username if payment.received_by else 'System'
            ])
            
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def export_pdf(self, request):
        """Export payments to PDF"""
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="payments_{datetime.now().strftime("%Y%m%d")}.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        
        styles = getSampleStyleSheet()
        elements.append(Paragraph("Payment Report", styles['Title']))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Paragraph(" ", styles['Normal']))
        
        data = [['Receipt', 'Date', 'Household', 'Amount', 'Method']]
        
        payments = self.filter_queryset(self.get_queryset())
        for payment in payments:
            data.append([
                payment.receipt_number,
                str(payment.payment_date),
                payment.bill.household.household_name[:15] + '...' if payment.bill and len(payment.bill.household.household_name) > 15 else (payment.bill.household.household_name if payment.bill else 'N/A'),
                str(payment.amount_paid),
                payment.payment_method
            ])
            
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        return response



    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def download_receipt(self, request, pk=None):
        """Download receipt for a single payment"""
        payment = self.get_object()
        
        # Check permissions: User must be admin/manager or the household owner
        if request.user.role == 'Household':
            if payment.bill.household.user != request.user:
                return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        response = HttpResponse(content_type='application/pdf')
        filename = f"Receipt_{payment.receipt_number}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()
        
        # Header
        elements.append(Paragraph("VILLAGE WATER SYSTEM", styles['Title']))
        elements.append(Paragraph("Payment Receipt", styles['Heading2']))
        elements.append(Paragraph(" ", styles['Normal']))
        
        # Receipt Details
        data = [
            ['Receipt Number:', payment.receipt_number],
            ['Date:', str(payment.payment_date)],
            ['Time:', str(payment.payment_time)],
            ['Payer Name:', payment.payer_name],
            ['Household:', payment.bill.household.household_name],
            ['Household Code:', payment.bill.household.household_code],
            ['Bill Number:', payment.bill.bill_number],
            ['Billing Period:', payment.bill.billing_period],
            ['Payment Method:', payment.payment_method],
            ['Transaction Ref:', payment.transaction_reference or 'N/A'],
            ['Amount Paid:', f"{payment.amount_paid} RWF"],
            ['Status:', payment.payment_status],
        ]
        
        table = Table(data, colWidths=[200, 200])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(table)
        elements.append(Paragraph(" ", styles['Normal']))
        elements.append(Paragraph("Thank you for your payment!", styles['Italic']))
        
        doc.build(elements)
        return response


class SMSNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """SMS Notification logs (All authenticated users, filtered by household)"""
    queryset = SMSNotification.objects.all()
    serializer_class = SMSNotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter logs by user role"""
        user = self.request.user
        queryset = SMSNotification.objects.all()
        
        if user.role == 'Household':
            # Households can only see their own logs (linked via phone number)
            # Since SMS logs are by phone number, we filter by household phone number
            try:
                household = user.household
                # Filter by either household phone or head of household phone
                queryset = SMSNotification.objects.filter(
                    Q(phone_number__contains=household.phone_number) |
                    Q(phone_number__contains=user.phone_number)
                )
            except:
                queryset = SMSNotification.objects.none()
        
        # Apply filters
        notification_type = self.request.query_params.get('type', None)
        status_filter = self.request.query_params.get('status', None)
        
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-sent_at')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    user = request.user
    
    # Base querysets
    if user.role == 'Household':
        try:
            household = user.household
            households = Household.objects.filter(household_id=household.household_id)
            bills = Bill.objects.filter(household=household)
            payments = Payment.objects.filter(bill__household=household)
            water_usage = WaterUsage.objects.filter(household=household)
        except:
            households = Household.objects.none()
            bills = Bill.objects.none()
            payments = Payment.objects.none()
            water_usage = WaterUsage.objects.none()
    else:
        households = Household.objects.all()
        bills = Bill.objects.all()
        payments = Payment.objects.all()
        water_usage = WaterUsage.objects.all()
    
    # Calculate statistics
    total_households = households.count()
    active_connections = households.filter(status='Active').count()
    
    # Monthly revenue (current month)
    current_month = datetime.now().strftime('%Y-%m')
    monthly_revenue = payments.filter(
        payment_date__year=datetime.now().year,
        payment_date__month=datetime.now().month,
        payment_status='Completed'
    ).aggregate(total=Sum('amount_paid'))['total'] or Decimal('0')
    
    pending_bills = bills.filter(status='Pending').count()
    total_bills = bills.count()
    total_payments = payments.filter(payment_status='Completed').count()
    
    total_water_consumed = water_usage.aggregate(total=Sum('liters_used'))['total'] or Decimal('0')
    
    stats = {
        'total_households': total_households,
        'active_connections': active_connections,
        'monthly_revenue': monthly_revenue,
        'pending_bills': pending_bills,
        'total_bills': total_bills,
        'total_payments': total_payments,
        'total_water_consumed': total_water_consumed,
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsManagerOrAdmin])
def dashboard_charts(request):
    """Get dashboard chart data"""
    
    # Revenue trend (last 6 months)
    revenue_data = []
    for i in range(5, -1, -1):
        month_date = datetime.now() - timedelta(days=30*i)
        month_str = month_date.strftime('%Y-%m')
        
        revenue = Payment.objects.filter(
            payment_date__year=month_date.year,
            payment_date__month=month_date.month,
            payment_status='Completed'
        ).aggregate(total=Sum('amount_paid'))['total'] or Decimal('0')
        
        revenue_data.append({
            'month': month_str,
            'revenue': revenue
        })
    
    # Bill status distribution
    bill_status_data = []
    for status_choice in Bill.STATUS_CHOICES:
        count = Bill.objects.filter(status=status_choice[0]).count()
        bill_status_data.append({
            'status': status_choice[0],
            'count': count
        })
    
    # Top 5 consumers
    top_consumers = WaterUsage.objects.values(
        'household__household_code',
        'household__household_name'
    ).annotate(
        total_consumption=Sum('liters_used')
    ).order_by('-total_consumption')[:5]
    
    top_consumers_data = [{
        'household_code': item['household__household_code'],
        'household_name': item['household__household_name'],
        'total_consumption': item['total_consumption']
    } for item in top_consumers]
    
    return Response({
        'revenue_trend': revenue_data,
        'bill_status': bill_status_data,
        'top_consumers': top_consumers_data

    }, status=status.HTTP_200_OK)


class NotificationViewSet(viewsets.ModelViewSet):
    """Notification views"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get notifications for current user"""
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        return Response({'count': count})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark single notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
