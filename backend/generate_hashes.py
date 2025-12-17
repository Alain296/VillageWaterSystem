"""
Generate proper Django password hashes for default users.
This script can be run to see what the proper hashes should be.
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')
django.setup()

from django.contrib.auth.hashers import make_password

# Generate hashes for default users
admin_hash = make_password('admin123')
manager_hash = make_password('manager123')

print("=" * 80)
print("Generated Django Password Hashes")
print("=" * 80)
print()
print("Admin password hash (password: admin123):")
print(admin_hash)
print()
print("Manager password hash (password: manager123):")
print(manager_hash)
print()
print("=" * 80)
