"""
Custom permissions for Village Water System
"""
from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission check for Admin users only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'Admin'


class IsManagerOrAdmin(permissions.BasePermission):
    """
    Permission check for Manager or Admin users
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['Admin', 'Manager']
        )


class IsHouseholdOwner(permissions.BasePermission):
    """
    Permission check for household owners to access their own data
    """
    def has_object_permission(self, request, view, obj):
        # Admin and Manager can access all
        if request.user.role in ['Admin', 'Manager']:
            return True
        
        # Household can only access their own data
        if request.user.role == 'Household':
            # Check if the object is related to the user's household
            if hasattr(obj, 'household'):
                return obj.household.user == request.user
            elif hasattr(obj, 'user'):
                return obj.user == request.user
            elif obj.__class__.__name__ == 'Household':
                return obj.user == request.user
        
        return False
