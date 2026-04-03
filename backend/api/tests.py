"""
Comprehensive Test Suite for Village Water System API
"""
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Household, Bill, Payment, TariffRate, WaterUsage, Notification
from datetime import date, datetime, timedelta
from decimal import Decimal

User = get_user_model()


class AuthenticationTests(TestCase):
    """Test authentication endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
    
    def test_register_user_success(self):
        """Test successful user registration"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'full_name': 'Test User',
            'phone_number': '0781234567',
            'role': 'Household'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)
    
    def test_register_duplicate_username(self):
        """Test registration with duplicate username"""
        User.objects.create_user(
            username='existing',
            email='existing@example.com',
            password='pass123',
            role='Household'
        )
        data = {
            'username': 'existing',
            'email': 'new@example.com',
            'password': 'pass123',
            'full_name': 'New User',
            'phone_number': '0781234567'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_success(self):
        """Test successful login"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='Household',
            status='Active'
        )
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_access_protected_endpoint_without_auth(self):
        """Test accessing protected endpoint without authentication"""
        response = self.client.get('/api/households/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class HouseholdTests(TestCase):
    """Test household CRUD operations"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            role='Admin',
            status='Active'
        )
        self.client.force_authenticate(user=self.admin_user)
    
    def test_create_household_success(self):
        """Test creating household with valid data"""
        data = {
            'household_name': 'Test Household',
            'head_of_household': 'John Doe',
            'national_id': '1234567890123456',
            'phone_number': '0781234567',
            'email': 'household@test.com',
            'address': '123 Test Street',
            'connection_date': date.today().isoformat(),
            'status': 'Active'
        }
        response = self.client.post('/api/households/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('household_code', response.data)
    
    def test_create_household_invalid_national_id(self):
        """Test creating household with invalid national ID format"""
        data = {
            'household_name': 'Test Household',
            'head_of_household': 'John Doe',
            'national_id': '12345',  # Invalid: must be 16 digits
            'phone_number': '0781234567',
            'connection_date': date.today().isoformat()
        }
        response = self.client.post('/api/households/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_list_households(self):
        """Test listing households"""
        # Create test household
        Household.objects.create(
            household_code='HH-2024-0001',
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='1234567890123456',
            phone_number='0781234567',
            connection_date=date.today(),
            registered_by=self.admin_user
        )
        response = self.client.get('/api/households/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
    
    def test_household_auto_generate_code(self):
        """Test household code auto-generation"""
        household = Household.objects.create(
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='1234567890123456',
            phone_number='0781234567',
            connection_date=date.today(),
            registered_by=self.admin_user
        )
        self.assertIsNotNone(household.household_code)
        self.assertTrue(household.household_code.startswith('HH-'))


class WaterUsageTests(TestCase):
    """Test water usage operations"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            role='Admin',
            status='Active'
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.household = Household.objects.create(
            household_code='HH-2024-0001',
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='1234567890123456',
            phone_number='0781234567',
            connection_date=date.today(),
            registered_by=self.admin_user
        )
    
    def test_record_water_usage_success(self):
        """Test recording water usage with valid readings"""
        data = {
            'household': self.household.household_id,
            'previous_reading': Decimal('1000'),
            'current_reading': Decimal('1100'),
            'reading_date': date.today().isoformat(),
            'reading_month': '2024-01'
        }
        response = self.client.post('/api/usage/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['liters_used'], '100.00')
    
    def test_record_usage_current_less_than_previous(self):
        """Test recording usage where current < previous reading"""
        data = {
            'household': self.household.household_id,
            'previous_reading': Decimal('1100'),
            'current_reading': Decimal('1000'),  # Invalid
            'reading_date': date.today().isoformat(),
            'reading_month': '2024-01'
        }
        response = self.client.post('/api/usage/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_auto_calculate_liters_used(self):
        """Test automatic calculation of liters used"""
        usage = WaterUsage.objects.create(
            household=self.household,
            previous_reading=Decimal('1000'),
            current_reading=Decimal('1100'),
            reading_date=date.today(),
            reading_month='2024-01',
            recorded_by=self.admin_user
        )
        self.assertEqual(usage.liters_used, Decimal('100'))


class BillingTests(TestCase):
    """Test billing operations"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            role='Admin',
            status='Active'
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.household = Household.objects.create(
            household_code='HH-2024-0001',
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='1234567890123456',
            phone_number='0781234567',
            connection_date=date.today(),
            registered_by=self.admin_user
        )
        
        self.tariff = TariffRate.objects.create(
            rate_name='Standard',
            rate_per_liter=Decimal('0.5'),
            effective_from=date.today(),
            is_active=True,
            set_by=self.admin_user
        )
        
        self.usage = WaterUsage.objects.create(
            household=self.household,
            previous_reading=Decimal('1000'),
            current_reading=Decimal('1100'),
            reading_date=date.today(),
            reading_month='2024-01',
            recorded_by=self.admin_user
        )
    
    def test_generate_bill_success(self):
        """Test generating bill for household"""
        data = {
            'household_id': self.household.household_id,
            'billing_period': '2024-01'
        }
        response = self.client.post('/api/bills/generate_bills/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('bills', response.data)
    
    def test_bill_auto_calculation(self):
        """Test bill total calculation"""
        bill = Bill.objects.create(
            household=self.household,
            usage=self.usage,
            tariff=self.tariff,
            liters_consumed=Decimal('100'),
            rate_applied=Decimal('0.5'),
            subtotal=Decimal('50.0'),
            total_amount=Decimal('50.0'),
            bill_date=date.today(),
            due_date=date.today() + timedelta(days=30),
            billing_period='2024-01',
            generated_by=self.admin_user
        )
        self.assertEqual(bill.total_amount, Decimal('50.0'))
        self.assertIsNotNone(bill.bill_number)


class PaymentTests(TestCase):
    """Test payment operations"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            role='Admin',
            status='Active'
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.household = Household.objects.create(
            household_code='HH-2024-0001',
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='1234567890123456',
            phone_number='0781234567',
            connection_date=date.today(),
            registered_by=self.admin_user
        )
        
        self.tariff = TariffRate.objects.create(
            rate_name='Standard',
            rate_per_liter=Decimal('0.5'),
            effective_from=date.today(),
            is_active=True,
            set_by=self.admin_user
        )
        
        self.usage = WaterUsage.objects.create(
            household=self.household,
            previous_reading=Decimal('1000'),
            current_reading=Decimal('1100'),
            reading_date=date.today(),
            reading_month='2024-01',
            recorded_by=self.admin_user
        )
        
        self.bill = Bill.objects.create(
            household=self.household,
            usage=self.usage,
            tariff=self.tariff,
            liters_consumed=Decimal('100'),
            rate_applied=Decimal('0.5'),
            subtotal=Decimal('50.0'),
            total_amount=Decimal('50.0'),
            bill_date=date.today(),
            due_date=date.today() + timedelta(days=30),
            billing_period='2024-01',
            generated_by=self.admin_user
        )
    
    def test_create_payment_success(self):
        """Test creating payment with valid amount"""
        data = {
            'bill': self.bill.bill_id,
            'amount_paid': Decimal('50.0'),
            'payment_method': 'Cash',
            'payer_name': 'John Doe'
        }
        response = self.client.post('/api/payments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('receipt_number', response.data)
    
    def test_payment_auto_generate_receipt(self):
        """Test payment receipt number auto-generation"""
        payment = Payment.objects.create(
            bill=self.bill,
            amount_paid=Decimal('50.0'),
            payment_date=date.today(),
            payment_time=datetime.now().time(),
            payment_method='Cash',
            payer_name='John Doe',
            received_by=self.admin_user
        )
        self.assertIsNotNone(payment.receipt_number)
        self.assertTrue(payment.receipt_number.startswith('RCP-'))
    
    def test_payment_updates_bill_status(self):
        """Test that payment updates bill status to Paid"""
        payment = Payment.objects.create(
            bill=self.bill,
            amount_paid=Decimal('50.0'),
            payment_date=date.today(),
            payment_time=datetime.now().time(),
            payment_method='Cash',
            payer_name='John Doe',
            payment_status='Completed',
            received_by=self.admin_user
        )
        self.bill.refresh_from_db()
        self.assertEqual(self.bill.status, 'Paid')


class ReportGenerationTests(TestCase):
    """Test report generation (CSV/PDF exports)"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            role='Admin',
            status='Active'
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.household = Household.objects.create(
            household_code='HH-2024-0001',
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='1234567890123456',
            phone_number='0781234567',
            connection_date=date.today(),
            registered_by=self.admin_user
        )
        
        self.tariff = TariffRate.objects.create(
            rate_name='Standard',
            rate_per_liter=Decimal('0.5'),
            effective_from=date.today(),
            is_active=True,
            set_by=self.admin_user
        )
        
        self.usage = WaterUsage.objects.create(
            household=self.household,
            previous_reading=Decimal('1000'),
            current_reading=Decimal('1100'),
            reading_date=date.today(),
            reading_month='2024-01',
            recorded_by=self.admin_user
        )
        
        self.bill = Bill.objects.create(
            household=self.household,
            usage=self.usage,
            tariff=self.tariff,
            liters_consumed=Decimal('100'),
            rate_applied=Decimal('0.5'),
            subtotal=Decimal('50.0'),
            total_amount=Decimal('50.0'),
            bill_date=date.today(),
            due_date=date.today() + timedelta(days=30),
            billing_period='2024-01',
            generated_by=self.admin_user
        )
        
        self.payment = Payment.objects.create(
            bill=self.bill,
            amount_paid=Decimal('50.0'),
            payment_date=date.today(),
            payment_time=datetime.now().time(),
            payment_method='Cash',
            payer_name='John Doe',
            payment_status='Completed',
            received_by=self.admin_user
        )
    
    def test_household_export_csv(self):
        """Test household CSV export"""
        response = self.client.get('/api/households/export_csv/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv; charset=utf-8')
        content = response.content.decode('utf-8')
        self.assertIn('Household Code', content)
        self.assertIn('HH-2024-0001', content)
    
    def test_household_export_pdf(self):
        """Test household PDF export"""
        response = self.client.get('/api/households/export_pdf/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))
    
    def test_payment_export_csv(self):
        """Test payment CSV export"""
        response = self.client.get('/api/payments/export_csv/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv; charset=utf-8')
        content = response.content.decode('utf-8')
        self.assertIn('Receipt No', content)
    
    def test_payment_export_pdf(self):
        """Test payment PDF export"""
        response = self.client.get('/api/payments/export_pdf/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))


class PermissionTests(TestCase):
    """Test role-based permissions"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create users with different roles
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            role='Admin',
            status='Active'
        )
        
        self.household_user = User.objects.create_user(
            username='household',
            email='household@test.com',
            password='household123',
            role='Household',
            status='Active'
        )
        
        self.household = Household.objects.create(
            household_code='HH-2024-0001',
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='1234567890123456',
            phone_number='0781234567',
            connection_date=date.today(),
            registered_by=self.admin_user,
            user=self.household_user
        )
    
    def test_household_user_sees_only_own_data(self):
        """Test household user can only see their own household"""
        self.client.force_authenticate(user=self.household_user)
        response = self.client.get('/api/households/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see their own household
        self.assertEqual(len(response.data), 1)
    
    def test_admin_sees_all_households(self):
        """Test admin can see all households"""
        # Create another household
        Household.objects.create(
            household_code='HH-2024-0002',
            household_name='Another Household',
            head_of_household='Jane Doe',
            national_id='9876543210987654',
            phone_number='0787654321',
            connection_date=date.today(),
            registered_by=self.admin_user
        )
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/households/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)
