import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')
django.setup()

from api.sms_service import sms_service
from api.models import SMSNotification

def test_sms():
    print("Testing SMS Service...")
    
    # Test phone number (you can change this)
    phone = "+250788123456"
    message = "Test SMS from Village Water System"
    
    print(f"Sending SMS to {phone}...")
    success, msg = sms_service.send_sms(phone, message)
    
    if success:
        print(f"✅ Success: {msg}")
        
        # Verify log
        log = SMSNotification.objects.filter(phone_number=phone).first()
        if log:
            print(f"✅ Log found in database: {log}")
        else:
            print("❌ Error: SMS not logged in database")
    else:
        print(f"❌ Failed: {msg}")

if __name__ == "__main__":
    test_sms()
