import os
import django
import sys

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')
django.setup()

from api.models import Notification
from django.db.utils import OperationalError, ProgrammingError

try:
    c = Notification.objects.count()
    result = f"SUCCESS: Notification count: {c}"
    print(result)
    with open('db_check_result.txt', 'w') as f:
        f.write(result)
except Exception as e:
    result = f"FAILURE: {e}"
    print(result)
    with open('db_check_result.txt', 'w') as f:
        f.write(result)
