"""
Serializers for Village Water System API
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User, Household, TariffRate, WaterUsage, Bill, Payment, SMSNotification, Notification
from datetime import datetime, date
from decimal import Decimal
import re


class UserSerializer(serializers.ModelSerializer):
    """User serializer"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=False)
    
    household_code = serializers.SerializerMethodField()
    household_status = serializers.SerializerMethodField()
    household_id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['user_id', 'username', 'password', 'confirm_password', 'full_name', 
                  'email', 'phone_number', 'role', 'status', 'created_date', 'last_login',
                  'household_code', 'household_status', 'household_id']
        read_only_fields = ['user_id', 'created_date', 'last_login', 'household_code', 'household_status', 'household_id']

    def get_household_code(self, obj):
        if obj.role == 'Household' and hasattr(obj, 'household'):
            return obj.household.household_code
        return None

    def get_household_id(self, obj):
        if obj.role == 'Household' and hasattr(obj, 'household'):
            return obj.household.household_id
        return None

    def get_household_status(self, obj):
        if obj.role == 'Household' and hasattr(obj, 'household'):
            return obj.household.status
        return None
    
    def validate_username(self, value):
        """Validate username format"""
        if len(value) < 4 or len(value) > 50:
            raise serializers.ValidationError("Username must be between 4 and 50 characters")
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Username must contain only letters, numbers, and underscores")
        return value
    
    def validate_phone_number(self, value):
        """Validate phone number"""
        if not re.match(r'^\d{10,15}$', value):
            raise serializers.ValidationError("Phone number must be 10-15 digits")
        return value
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if 'confirm_password' in attrs:
            if attrs.get('password') != attrs.get('confirm_password'):
                raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
            attrs.pop('confirm_password')
        return attrs
    
    def create(self, validated_data):
        """Create user with hashed password"""
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        """Update user"""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class HouseholdSerializer(serializers.ModelSerializer):
    """Household serializer"""
    user_details = UserSerializer(source='user', read_only=True)
    registered_by_name = serializers.CharField(source='registered_by.full_name', read_only=True)
    password = serializers.CharField(write_only=True, required=False, min_length=8, 
                                     help_text="Password for household user account (min 8 characters)")
    username = serializers.CharField(write_only=True, required=False,
                                     help_text="Username for household user account")
    
    class Meta:
        model = Household
        fields = '__all__'
        read_only_fields = ['household_id', 'household_code', 'registration_date']
    
    def validate_national_id(self, value):
        """Validate national ID format"""
        if not re.match(r'^\d{16}$', value):
            raise serializers.ValidationError("National ID must be exactly 16 digits")
        return value
    
    def validate_phone_number(self, value):
        """Validate phone number"""
        if not re.match(r'^\d{10,15}$', value):
            raise serializers.ValidationError("Phone number must be 10-15 digits")
        return value
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if value:
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
                raise serializers.ValidationError("Invalid email format")
            
            # Check if email exists in User table
            email_query = User.objects.filter(email=value)
            
            # If updating, exclude the current household's user from the check
            if self.instance and self.instance.user:
                email_query = email_query.exclude(user_id=self.instance.user.user_id)
            
            if email_query.exists():
                raise serializers.ValidationError("A user with this email already exists")
        return value
    
    def validate_number_of_members(self, value):
        """Validate number of members"""
        if value < 1:
            raise serializers.ValidationError("Number of members must be at least 1")
        return value

    def validate_username(self, value):
        """Validate username uniqueness"""
        username_query = User.objects.filter(username=value)
        
        # If updating, exclude the current household's user from the check
        if self.instance and self.instance.user:
            username_query = username_query.exclude(user_id=self.instance.user.user_id)
        
        if username_query.exists():
            raise serializers.ValidationError("A user with this username already exists")
        return value
    
    def create(self, validated_data):
        """Create household and associated user account"""
        password = validated_data.pop('password', None)
        username = validated_data.pop('username', None)
        
        # If head_of_household is missing but username is provided, use username
        if not validated_data.get('head_of_household') and username:
            validated_data['head_of_household'] = username
            
        household = super().create(validated_data)
        
        # Create or update user account
        if username and password:
            if household.user:
                user = household.user
                user.username = username
                user.set_password(password)
                user.save()
            else:
                # Create new user
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    email=validated_data.get('email', ''),
                    full_name=validated_data.get('head_of_household', username),
                    role='Household'
                )
                household.user = user
                household.save()
        
        return household

    def update(self, instance, validated_data):
        """Update household and associated user account"""
        password = validated_data.pop('password', None)
        username = validated_data.pop('username', None)
        
        # Update household fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update associated user if exists
        if instance.user:
            user = instance.user
            
            # Update user email if household email changed
            if 'email' in validated_data and validated_data['email']:
                user.email = validated_data['email']
            
            # Update username if provided
            if username:
                user.username = username
            
            # Update password if provided
            if password:
                user.set_password(password)
            
            # Update full name from head_of_household
            if 'head_of_household' in validated_data:
                user.full_name = validated_data['head_of_household']
            
            user.save()
        
        return instance



class TariffRateSerializer(serializers.ModelSerializer):
    """Tariff Rate serializer"""
    set_by_name = serializers.CharField(source='set_by.full_name', read_only=True)
    
    class Meta:
        model = TariffRate
        fields = '__all__'
        read_only_fields = ['tariff_id', 'created_date']
    
    def validate_rate_per_liter(self, value):
        """Validate rate is positive"""
        if value <= 0:
            raise serializers.ValidationError("Rate per liter must be greater than 0")
        return value
    
    def validate(self, attrs):
        """Validate effective dates"""
        effective_from = attrs.get('effective_from')
        effective_to = attrs.get('effective_to')
        
        if effective_to and effective_from and effective_to < effective_from:
            raise serializers.ValidationError({
                "effective_to": "Effective to date must be after effective from date"
            })
        
        return attrs


class WaterUsageSerializer(serializers.ModelSerializer):
    """Water Usage serializer"""
    household_name = serializers.CharField(source='household.household_name', read_only=True)
    household_code = serializers.CharField(source='household.household_code', read_only=True)
    recorded_by_name = serializers.CharField(source='recorded_by.full_name', read_only=True)
    
    class Meta:
        model = WaterUsage
        fields = '__all__'
        read_only_fields = ['usage_id', 'liters_used', 'created_date']
    
    def validate_current_reading(self, value):
        """Validate current reading is positive"""
        if value < 0:
            raise serializers.ValidationError("Current reading cannot be negative")
        return value
    
    def validate(self, attrs):
        """Validate readings and check for duplicates"""
        current_reading = attrs.get('current_reading')
        previous_reading = attrs.get('previous_reading', 0)
        household = attrs.get('household')
        reading_month = attrs.get('reading_month')
        
        # Validate current >= previous
        if current_reading < previous_reading:
            raise serializers.ValidationError({
                "current_reading": "Current reading must be greater than or equal to previous reading"
            })
        
        # Check for duplicate usage for same household and month
        if household and reading_month:
            existing = WaterUsage.objects.filter(
                household=household,
                reading_month=reading_month
            )
            
            # Exclude current instance if updating
            if self.instance:
                existing = existing.exclude(usage_id=self.instance.usage_id)
            
            if existing.exists():
                raise serializers.ValidationError({
                    "reading_month": f"Usage record already exists for {household.household_code} in {reading_month}"
                })
        
        return attrs


class BillSerializer(serializers.ModelSerializer):
    """Bill serializer"""
    household_name = serializers.CharField(source='household.household_name', read_only=True)
    household_code = serializers.CharField(source='household.household_code', read_only=True)
    generated_by_name = serializers.CharField(source='generated_by.full_name', read_only=True)
    tariff_rate_name = serializers.CharField(source='tariff.rate_name', read_only=True)
    
    class Meta:
        model = Bill
        fields = '__all__'
        read_only_fields = ['bill_id', 'bill_number', 'subtotal', 'total_amount', 'generation_date', 'rate_applied']
    
    def validate(self, attrs):
        """Validate bill data"""
        household = attrs.get('household')
        bill_date = attrs.get('bill_date')
        due_date = attrs.get('due_date')
        
        # Validate household is active
        if household and household.status != 'Active':
            raise serializers.ValidationError({
                "household": "Only Active households can generate bills"
            })
        
        # Validate due date
        if due_date and bill_date:
            days_diff = (due_date - bill_date).days
            if days_diff < 1 or days_diff > 90:
                raise serializers.ValidationError({
                    "due_date": "Due date must be 1-90 days after bill date"
                })
        
        return attrs


class PaymentSerializer(serializers.ModelSerializer):
    """Payment serializer"""
    bill_number = serializers.CharField(source='bill.bill_number', read_only=True)
    bill_total = serializers.DecimalField(source='bill.total_amount', max_digits=10, decimal_places=2, read_only=True)
    household_name = serializers.CharField(source='bill.household.household_name', read_only=True)
    received_by_name = serializers.CharField(source='received_by.full_name', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.full_name', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['payment_id', 'receipt_number', 'created_date']
    
    def validate_amount_paid(self, value):
        """Validate amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be greater than 0")
        return value
    
    def validate(self, attrs):
        """Validate payment amount against bill total"""
        bill = attrs.get('bill')
        amount_paid = attrs.get('amount_paid')
        
        if bill and amount_paid:
            # Calculate total already paid
            existing_payments = bill.payments.filter(payment_status='Completed').aggregate(
                total=serializers.models.Sum('amount_paid')
            )['total'] or Decimal('0')
            
            # Check if new payment exceeds remaining amount
            remaining = bill.total_amount - existing_payments
            if amount_paid > remaining:
                raise serializers.ValidationError({
                    "amount_paid": f"Payment amount ({amount_paid}) exceeds remaining bill amount ({remaining})"
                })
        
        return attrs


class DashboardStatsSerializer(serializers.Serializer):
    """Dashboard statistics serializer"""
    total_households = serializers.IntegerField()
    active_connections = serializers.IntegerField()
    monthly_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    pending_bills = serializers.IntegerField()
    total_bills = serializers.IntegerField()
    total_payments = serializers.IntegerField()
    total_water_consumed = serializers.DecimalField(max_digits=15, decimal_places=2)


class RevenueChartSerializer(serializers.Serializer):
    """Revenue chart data serializer"""
    month = serializers.CharField()
    revenue = serializers.DecimalField(max_digits=15, decimal_places=2)


class BillStatusChartSerializer(serializers.Serializer):
    """Bill status chart data serializer"""
    status = serializers.CharField()
    count = serializers.IntegerField()


class TopConsumerSerializer(serializers.Serializer):
    """Top consumer serializer"""
    household_code = serializers.CharField()
    household_name = serializers.CharField()
    total_consumption = serializers.DecimalField(max_digits=15, decimal_places=2)


class SMSNotificationSerializer(serializers.ModelSerializer):
    """SMS Notification serializer"""
    class Meta:
        model = SMSNotification
        fields = '__all__'
    class Meta:
        model = SMSNotification
        fields = '__all__'
        read_only_fields = ['sms_id', 'sent_at', 'status', 'error_message']


class NotificationSerializer(serializers.ModelSerializer):
    """Notification serializer"""
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['notification_id', 'created_at', 'is_read']
