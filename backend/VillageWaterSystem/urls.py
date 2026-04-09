"""
URL configuration for VillageWaterSystem project.
"""
from django.contrib import admin
from django.urls import path, include

from django.http import JsonResponse

def root_health(request):
    return JsonResponse({"status": "village water system api online"})

urlpatterns = [
    path('', root_health),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
