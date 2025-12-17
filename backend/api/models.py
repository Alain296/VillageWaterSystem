"""
Django models for Village Water System
"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from datetime import datetime, date
from decimal import Decimal


class UserManager(BaseUserManager):
    """Custom user manager"""
    
    def create_user(self, username, email, password=None, **extra_fields):
        """Create and save a regular user"""
        if not username:
            raise ValueError('Users must have a username')
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('role', 'Admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model"""
    
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Household', 'Household'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=15)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Household')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    created_date = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Required for Django admin
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class Household(models.Model):
    """Household model"""
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Suspended', 'Suspended'),
    ]
    
    household_id = models.AutoField(primary_key=True)
    household_code = models.CharField(max_length=20, unique=True)
    household_name = models.CharField(max_length=100)
    head_of_household = models.CharField(max_length=100)
    national_id = models.CharField(max_length=16, unique=True)
    address = models.TextField(blank=True, null=True)
    sector = models.CharField(max_length=50, blank=True, null=True)
    cell = models.CharField(max_length=50, blank=True, null=True)
    village = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(max_length=100, blank=True, null=True)
    number_of_members = models.IntegerField(default=1)
    meter_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    connection_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    registered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='registered_households')
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='household')
    registration_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'households'
        indexes = [
            models.Index(fields=['household_code']),
            models.Index(fields=['national_id']),
            models.Index(fields=['status']),
        ]
    
    def save(self, *args, **kwargs):
        """Auto-generate household code if not provided"""
        if not self.household_code:
            year = datetime.now().year
            # Get the last household code for this year
            last_household = Household.objects.filter(
                household_code__startswith=f'HH-{year}-'
            ).order_by('-household_code').first()
            
            if last_household:
                last_number = int(last_household.household_code.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.household_code = f'HH-{year}-{new_number:04d}'
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.household_code} - {self.household_name}"


class TariffRate(models.Model):
    """Tariff Rate model"""
    
    tariff_id = models.AutoField(primary_key=True)
    rate_name = models.CharField(max_length=100)
    rate_per_liter = models.DecimalField(max_digits=10, decimal_places=2)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    set_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tariff_rates'
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['effective_from', 'effective_to']),
        ]
    
    def __str__(self):
        return f"{self.rate_name} - {self.rate_per_liter} RWF/L"


class WaterUsage(models.Model):
    """Water Usage model"""
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Verified', 'Verified'),
        ('Billed', 'Billed'),
    ]
    
    usage_id = models.AutoField(primary_key=True)
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name='water_usages')
    previous_reading = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_reading = models.DecimalField(max_digits=10, decimal_places=2)
    liters_used = models.DecimalField(max_digits=10, decimal_places=2)
    reading_date = models.DateField()
    reading_month = models.CharField(max_length=7)  # Format: YYYY-MM
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'water_usage'
        unique_together = [['household', 'reading_month']]
        indexes = [
            models.Index(fields=['reading_month']),
            models.Index(fields=['household']),
            models.Index(fields=['status']),
        ]
    
    def save(self, *args, **kwargs):
        """Auto-calculate liters used"""
        self.liters_used = self.current_reading - self.previous_reading
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.household.household_code} - {self.reading_month}: {self.liters_used}L"


class Bill(models.Model):
    """Bill model"""
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
    ]
    
    bill_id = models.AutoField(primary_key=True)
    bill_number = models.CharField(max_length=30, unique=True)
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name='bills')
    usage = models.ForeignKey(WaterUsage, on_delete=models.SET_NULL, null=True, blank=True)
    tariff = models.ForeignKey(TariffRate, on_delete=models.SET_NULL, null=True, blank=True)
    liters_consumed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    rate_applied = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    penalty_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    bill_date = models.DateField()
    due_date = models.DateField()
    billing_period = models.CharField(max_length=7)  # Format: YYYY-MM
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    generation_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'bills'
        indexes = [
            models.Index(fields=['bill_number']),
            models.Index(fields=['household']),
            models.Index(fields=['status']),
            models.Index(fields=['billing_period']),
        ]
    
    def save(self, *args, **kwargs):
        """Auto-generate bill number and calculate totals"""
        if not self.bill_number:
            year = datetime.now().year
            month = datetime.now().month
            # Get the last bill number for this month
            last_bill = Bill.objects.filter(
                bill_number__startswith=f'BILL-{year}{month:02d}-'
            ).order_by('-bill_number').first()
            
            if last_bill:
                last_number = int(last_bill.bill_number.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.bill_number = f'BILL-{year}{month:02d}-{new_number:04d}'
        
        # Calculate totals
        self.subtotal = self.liters_consumed * self.rate_applied
        self.total_amount = self.subtotal + self.penalty_amount - self.discount_amount
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.bill_number} - {self.household.household_code}: {self.total_amount} RWF"


class Payment(models.Model):
    """Payment model"""
    
    PAYMENT_METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Mobile Money', 'Mobile Money'),
        ('Bank Transfer', 'Bank Transfer'),
    ]
    
    STATUS_CHOICES = [
        ('Completed', 'Completed'),
        ('Pending', 'Pending'),
        ('Failed', 'Failed'),
    ]
    
    payment_id = models.AutoField(primary_key=True)
    receipt_number = models.CharField(max_length=30, unique=True)
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='payments')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_time = models.TimeField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_reference = models.CharField(max_length=100, blank=True, null=True)
    payer_name = models.CharField(max_length=100)
    payer_phone = models.CharField(max_length=15, blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Completed')
    received_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_payments')
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_payments')
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['receipt_number']),
            models.Index(fields=['bill']),
            models.Index(fields=['payment_date']),
        ]
    
    def save(self, *args, **kwargs):
        """Auto-generate receipt number and transaction reference"""
        if not self.receipt_number:
            year = datetime.now().year
            month = datetime.now().month
            # Get the last receipt number for this month
            last_payment = Payment.objects.filter(
                receipt_number__startswith=f'RCP-{year}{month:02d}-'
            ).order_by('-receipt_number').first()
            
            if last_payment:
                last_number = int(last_payment.receipt_number.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.receipt_number = f'RCP-{year}{month:02d}-{new_number:04d}'
        
        # Auto-generate transaction reference if not provided
        if not self.transaction_reference:
            year = datetime.now().year
            month = datetime.now().month
            day = datetime.now().day
            # Get the last transaction for today
            last_txn = Payment.objects.filter(
                transaction_reference__startswith=f'TXN-{year}{month:02d}{day:02d}-'
            ).order_by('-transaction_reference').first()
            
            if last_txn:
                last_number = int(last_txn.transaction_reference.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.transaction_reference = f'TXN-{year}{month:02d}{day:02d}-{new_number:04d}'
        
        super().save(*args, **kwargs)
        
        # Update bill status if fully paid
        total_paid = self.bill.payments.filter(payment_status='Completed').aggregate(
            total=models.Sum('amount_paid')
        )['total'] or Decimal('0')
        
        if total_paid >= self.bill.total_amount:
            self.bill.status = 'Paid'
            self.bill.save()
    
    def __str__(self):
        return f"{self.receipt_number} - {self.amount_paid} RWF"


class SMSNotification(models.Model):
    """SMS Notification Log"""
    
    NOTIFICATION_TYPES = [
        ('Bill Generated', 'Bill Generated'),
        ('Payment Confirmation', 'Payment Confirmation'),
        ('General', 'General'),
    ]
    
    STATUS_CHOICES = [
        ('Sent', 'Sent'),
        ('Failed', 'Failed'),
    ]
    
    sms_id = models.AutoField(primary_key=True)
    phone_number = models.CharField(max_length=15)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES, default='General')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Sent')
    error_message = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'sms_notifications'
        ordering = ['-sent_at']


class Notification(models.Model):
    """Notification model for in-app alerts"""
    NOTIFICATION_TYPES = [
        ('household_payment', 'Household Payment'),
        ('new_registration', 'New Registration'),
        ('tariff_change', 'Tariff Change'),
        ('admin_payment', 'Admin Payment'),
        ('new_bill', 'New Bill'),
    ]
    
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    link = models.CharField(max_length=200, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def __str__(self):
        return f"{self.notification_type} - {self.phone_number} - {self.status}"
