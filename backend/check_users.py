
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')
django.setup()

from api.models import User

try:
    count = User.objects.count()
    users = list(User.objects.all().values('username', 'role', 'status'))
    
    with open('user_check_result.txt', 'w') as f:
        f.write(f"Count: {count}\n")
        for u in users:
            f.write(f"{u['username']} - {u['role']} - {u['status']}\n")
            
    print(f"Comparison finished. Users: {count}")

except Exception as e:
    with open('user_check_result.txt', 'w') as f:
        f.write(f"Error: {e}")
