import os
import django
import sys
import datetime

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')
django.setup()

import traceback

def log(msg):
    print(msg)
    with open('result.txt', 'a') as f:
        f.write(msg + '\n')

def test_notifications():
    if os.path.exists('result.txt'):
        os.remove('result.txt')
        
    log("--- Starting Notification Test ---")
    try:
        # Import moved inside try block to catch import errors
        from api.models import Notification, User, Household, TariffRate, Payment, Bill
        from api.notification_service import NotificationService
        from django.utils import timezone
        
        # 1. Setup Test Data
        # Create or get a test household user
        username = 'test_household_user_notify'
        try:
            user = User.objects.get(username=username)
            log(f"Found existing user: {user}")
        except User.DoesNotExist:
            user = User.objects.create_user(username=username, email='test@example.com', password='password123', role='Household')
            log(f"Created user: {user}")
            
        # Ensure household profile exists
        try:
            household = Household.objects.get(household_code='TEST-NOTIFY-001')
            if household.user != user:
                household.user = user
                household.save()
        except Household.DoesNotExist:
            household = Household.objects.create(
                household_code='TEST-NOTIFY-001',
                household_name='Test Notify Household',
                user=user,
                connection_date=timezone.now().date()
            )
            log("Created household")

        # Clear existing notifications for this user
        Notification.objects.filter(user=user).delete()
        log("Cleared existing notifications")

        # 2. Test Tariff Change Notification
        log("\n[Test 1] Tariff Change Notification")
        tariff = TariffRate(rate_name="Standard Test", rate_per_liter=5.0)
        # Note: We don't need to save the tariff to DB for the notification logic, just pass the object
        NotificationService.notify_tariff_change(tariff)
        
        # Verify
        notifs = Notification.objects.filter(user=user, notification_type='tariff_change')
        if notifs.exists():
            log(f"SUCCESS: Found {notifs.count()} tariff notifications.")
            log(f"Message: {notifs.first().message}")
        else:
            log("FAILURE: No tariff notification found.")

        # 3. Test Admin Payment Notification
        log("\n[Test 2] Admin Payment Notification")
        # Need a bill
        bill = Bill.objects.create(
            household=household,
            bill_date=timezone.now().date(),
            due_date=timezone.now().date(),
            total_amount=1000,
            status='Pending',
            rate_applied=5.0,
            liters_consumed=200
        )
        
        # Need an admin user
        try:
            admin = User.objects.get(username='admin')
        except User.DoesNotExist:
            admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin')
            
        payment = Payment(
            bill=bill,
            amount_paid=500,
            payment_date=timezone.now().date(),
            payment_time=timezone.now().time(),
            received_by=admin, # This triggers the logic
            receipt_number="TEST-RCPT-001"
        )
        # Don't save payment, just pass to service
        NotificationService.notify_admin_payment(payment)
        
        # Verify
        notifs = Notification.objects.filter(user=user, notification_type='admin_payment')
        if notifs.exists():
            log(f"SUCCESS: Found {notifs.count()} admin payment notifications.")
            log(f"Message: {notifs.first().message}")
        else:
            log("FAILURE: No admin payment notification found.")
            
        # Cleanup
        bill.delete()
        # household.delete() # User might want to keep it
        
    except Exception as e:
        log(f"ERROR: {str(e)}")
        log(traceback.format_exc())
    
    log("\n--- Test Finished ---")

if __name__ == '__main__':
    test_notifications()
