import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VillageWaterSystem.settings')
django.setup()

from api.models import TariffRate, WaterUsage, Household

print("\n===========================================")
print("      VILLAGE WATER SYSTEM DIAGNOSTIC      ")
print("===========================================\n")

# 1. Check Tariff
print("1. CHECKING TARIFF RATES...")
tariff = TariffRate.objects.filter(is_active=True).first()
if tariff:
    print(f"   ✅ Active Tariff Found: {tariff.rate_name}")
    print(f"      Rate: {tariff.rate_per_liter} RWF/Liter")
else:
    print("   ❌ ERROR: No Active Tariff Found!")
    print("      -> Go to 'Tariff Rates' page and create a new rate.")

print("\n-------------------------------------------\n")

# 2. Check Usage for December 2025
print("2. CHECKING WATER USAGE (2025-12)...")
usage_count = WaterUsage.objects.filter(reading_month='2025-12').count()
print(f"   📊 Total Usage Records for Dec 2025: {usage_count}")

if usage_count == 0:
    print("   ❌ ERROR: No water usage recorded for December 2025.")
    print("      -> Go to 'Usage' page and add readings for households.")
else:
    print("   ✅ Usage records found. You should be able to generate bills.")
    
    # List first 3 households with usage
    print("\n   Households ready for billing:")
    usages = WaterUsage.objects.filter(reading_month='2025-12')[:3]
    for u in usages:
        print(f"   - {u.household.household_code}: {u.liters_used} Liters")

print("\n===========================================\n")
