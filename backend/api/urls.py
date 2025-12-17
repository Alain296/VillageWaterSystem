"""
URL configuration for API endpoints
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    register, login, logout, get_user,
    UserViewSet, HouseholdViewSet, TariffRateViewSet,
    WaterUsageViewSet, BillViewSet, PaymentViewSet,
    dashboard_stats, dashboard_charts, SMSNotificationViewSet,
    NotificationViewSet
)


# Create router for viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'households', HouseholdViewSet, basename='household')
router.register(r'tariffs', TariffRateViewSet, basename='tariff')
router.register(r'usage', WaterUsageViewSet, basename='usage')
router.register(r'bills', BillViewSet, basename='bill')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'sms', SMSNotificationViewSet, basename='sms')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/user/', get_user, name='get_user'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard endpoints
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('dashboard/charts/', dashboard_charts, name='dashboard_charts'),
    
    # Include router URLs
    path('', include(router.urls)),
]
