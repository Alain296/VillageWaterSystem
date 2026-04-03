
import os
import sys
import django
from datetime import date

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')
django.setup()

from api.models import User, TariffRate


def seed_data():
    with open('seed_log.txt', 'w') as log:
        log.write("Starting database seeding...\n")

        try:
            # 1. Create Admin User
            if not User.objects.filter(username='admin').exists():
                admin = User.objects.create_superuser(
                    username='admin',
                    email='admin@villagewater.rw',
                    password='admin123',
                    full_name='System Administrator',
                    phone_number='0788000001'
                )
                log.write(f"Created Admin user: {admin.username}\n")
            else:
                log.write("Admin user already exists.\n")

            # 2. Create Manager User
            if not User.objects.filter(username='manager1').exists():
                manager = User.objects.create_user(
                    username='manager1',
                    email='manager@villagewater.rw',
                    password='manager123',
                    full_name='Water Manager',
                    phone_number='0788000002',
                    role='Manager'
                )
                log.write(f"Created Manager user: {manager.username}\n")
            else:
                log.write("Manager user already exists.\n")

            # 3. Create Default Tariff
            if not TariffRate.objects.exists():
                tariff = TariffRate.objects.create(
                    rate_name='Standard Rate 2025',
                    rate_per_liter=10.00,
                    effective_from=date(2025, 1, 1),
                    is_active=True,
                    set_by=User.objects.get(username='admin')
                )
                log.write(f"Created Default Tariff: {tariff.rate_name}\n")
            else:
                log.write("Tariff rates already exist.\n")

            log.write("Database seeding completed successfully.\n")
        except Exception as e:
            log.write(f"Error seeding data: {e}\n")
            raise e


if __name__ == '__main__':
    try:
        seed_data()
    except Exception as e:
        print(f"Error seeding data: {e}")
