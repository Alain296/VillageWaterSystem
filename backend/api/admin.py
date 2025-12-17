from django.contrib import admin
from .models import User, Household, TariffRate, WaterUsage, Bill, Payment

# Register models with admin site
admin.site.register(User)
admin.site.register(Household)
admin.site.register(TariffRate)
admin.site.register(WaterUsage)
admin.site.register(Bill)
admin.site.register(Payment)
