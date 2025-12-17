from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Household, Bill, Payment, TariffRate, WaterUsage
from datetime import date, datetime
from decimal import Decimal

User = get_user_model()

class ReportGenerationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create Admin User
        self.admin_user = User.objects.create_user(
            username='admin',
            password='password123',
            role='Admin',
            status='Active'
        )
        self.client.force_authenticate(user=self.admin_user)
        
        # Create Household
        self.household = Household.objects.create(
            household_code='HH001',
            household_name='Test Household',
            head_of_household='John Doe',
            national_id='123456789',
            phone_number='0780000000',
            status='Active',
            registered_by=self.admin_user
        )
        
        # Create Tariff
        self.tariff = TariffRate.objects.create(
            rate_name='Standard',
            rate_per_liter=Decimal('0.5'),
            is_active=True,
            set_by=self.admin_user
        )
        
        # Create Usage
        self.usage = WaterUsage.objects.create(
            household=self.household,
            reading_date=date.today(),
            reading_month='2023-10',
            meter_reading=1000,
            liters_used=100,
            recorded_by=self.admin_user
        )
        
        # Create Bill
        self.bill = Bill.objects.create(
            household=self.household,
            usage=self.usage,
            tariff=self.tariff,
            liters_consumed=100,
            rate_applied=Decimal('0.5'),
            subtotal=Decimal('50.0'),
            total_amount=Decimal('50.0'),
            bill_date=date.today(),
            due_date=date.today(),
            billing_period='2023-10',
            generated_by=self.admin_user
        )
        
        # Create Payment
        self.payment = Payment.objects.create(
            bill=self.bill,
            amount_paid=Decimal('50.0'),
            payment_date=date.today(),
            payment_method='Cash',
            payment_status='Completed',
            received_by=self.admin_user,
            receipt_number='REC001'
        )

    def test_household_export_csv(self):
        response = self.client.get('/api/households/export_csv/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')
        content = response.content.decode('utf-8')
        self.assertIn('Household Code', content)
        self.assertIn('HH001', content)

    def test_household_export_pdf(self):
        response = self.client.get('/api/households/export_pdf/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_payment_export_csv(self):
        response = self.client.get('/api/payments/export_csv/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')
        content = response.content.decode('utf-8')
        self.assertIn('Receipt No', content)
        self.assertIn('REC001', content)

    def test_payment_export_pdf(self):
        response = self.client.get('/api/payments/export_pdf/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))
