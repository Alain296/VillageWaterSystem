"""
Fix password hashes for default users in the database.
Run this script to fix authentication issues with default users.
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')

try:
    django.setup()
    print("✓ Django environment loaded successfully")
except Exception as e:
    print(f"✗ Error loading Django: {e}")
    sys.exit(1)

from api.models import User

print("\n" + "=" * 60)
print("Village Water System - Password Fix Script")
print("=" * 60 + "\n")

# Fix admin user
try:
    admin = User.objects.get(username='admin')
    print(f"Found user: admin")
    print(f"Current password hash: {admin.password[:50]}...")
    
    admin.set_password('admin123')
    admin.save()
    print("✓ Admin password updated to: admin123\n")
except User.DoesNotExist:
    print("✗ Admin user not found in database\n")
except Exception as e:
    print(f"✗ Error updating admin: {e}\n")

# Fix manager user
try:
    manager = User.objects.get(username='manager1')
    print(f"Found user: manager1")
    print(f"Current password hash: {manager.password[:50]}...")
    
    manager.set_password('manager123')
    manager.save()
    print("✓ Manager password updated to: manager123\n")
except User.DoesNotExist:
    print("✗ Manager user not found in database\n")
except Exception as e:
    print(f"✗ Error updating manager: {e}\n")

print("=" * 60)
print("Password fix completed!")
print("=" * 60)
print("\nYou can now login with:")
print("  Admin:   username = admin     password = admin123")
print("  Manager: username = manager1  password = manager123")
print()
