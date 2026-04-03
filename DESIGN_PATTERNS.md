# Software Design Patterns Used in Village Water System

## Overview
This document identifies and documents the software design patterns implemented in the Village Water System application. Design patterns are reusable solutions to common problems in software design that improve code maintainability, scalability, and readability.

---

## 1. Singleton Pattern

### Location: `backend/api/sms_service.py`

**Pattern Description:**
The Singleton pattern ensures that a class has only one instance and provides a global point of access to it.

**Implementation:**
```python
class SMSService:
    """SMS service for sending notifications (Sandbox mode)"""
    
    def __init__(self):
        self.enabled = True
        logger.info("SMS Service initialized in SANDBOX mode")
    
    # ... methods ...

# Global SMS service instance (Singleton)
sms_service = SMSService()
```

**Why Used:**
- Ensures only one SMS service instance exists throughout the application
- Prevents multiple initializations and resource conflicts
- Provides a centralized point for SMS operations
- Used across multiple views (`views.py`) without creating new instances

**Usage Example:**
```python
# In views.py
from .sms_service import sms_service

# Used directly without instantiation
sms_service.send_bill_notification(bill)
sms_service.send_payment_confirmation(payment)
```

---

## 2. Service Pattern / Service Layer Pattern

### Location: 
- `backend/api/sms_service.py` - `SMSService`
- `backend/api/notification_service.py` - `NotificationService`

**Pattern Description:**
The Service pattern encapsulates business logic in separate service classes, separating it from controllers/views and models.

**Implementation:**

#### SMSService (`sms_service.py`):
```python
class SMSService:
    """SMS service for sending notifications"""
    
    def send_sms(self, phone_number, message):
        """Send SMS message"""
        # Business logic for SMS sending
        
    def send_bill_notification(self, bill):
        """Send SMS when bill is generated"""
        # Encapsulates bill notification logic
        
    def send_payment_confirmation(self, payment):
        """Send SMS when payment is received"""
        # Encapsulates payment confirmation logic
```

#### NotificationService (`notification_service.py`):
```python
class NotificationService:
    """Service for managing in-app notifications"""
    
    @staticmethod
    def create_notification(user, notification_type, title, message, link=None):
        """Create a new notification"""
        
    @staticmethod
    def notify_household_payment(payment):
        """Notify admin/manager when household makes payment"""
        
    @staticmethod
    def notify_new_bill(bill):
        """Notify household of new bill generation"""
```

**Why Used:**
- Separates business logic from view/controller logic
- Makes code more testable and maintainable
- Allows reuse of notification logic across different views
- Centralizes complex operations (SMS sending, notification creation)

**Usage Example:**
```python
# In views.py
from .notification_service import NotificationService
from .sms_service import sms_service

# Service methods called from views
NotificationService.notify_new_bill(bill)
sms_service.send_bill_notification(bill)
```

---

## 3. Factory Pattern

### Location: `backend/api/models.py` - `UserManager`

**Pattern Description:**
The Factory pattern provides an interface for creating objects without specifying their exact classes. The factory decides which class to instantiate.

**Implementation:**
```python
class UserManager(BaseUserManager):
    """Custom user manager - Factory for creating users"""
    
    def create_user(self, username, email, password=None, **extra_fields):
        """Create and save a regular user"""
        if not username:
            raise ValueError('Users must have a username')
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('role', 'Admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(username, email, password, **extra_fields)
```

**Why Used:**
- Provides a standardized way to create User objects
- Handles different user types (regular user vs superuser)
- Encapsulates user creation logic
- Ensures proper initialization of user objects

**Usage Example:**
```python
# Create regular user
user = User.objects.create_user(
    username='john',
    email='john@example.com',
    password='password123',
    role='Household'
)

# Create superuser/admin
admin = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123'
)
```

---

## 4. Repository Pattern

### Location: `backend/api/views.py` - Django REST Framework ViewSets

**Pattern Description:**
The Repository pattern abstracts data access logic, providing a collection-like interface for accessing domain objects.

**Implementation:**
Django REST Framework ViewSets act as repositories, encapsulating CRUD operations:

```python
class HouseholdViewSet(viewsets.ModelViewSet):
    """Household CRUD operations"""
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter households based on user role"""
        # Repository query logic
        
    def perform_create(self, serializer):
        """Set registered_by to current user"""
        # Repository create logic
```

**Why Used:**
- Abstracts database access from business logic
- Provides consistent interface for data operations
- Handles filtering, pagination, and permissions
- Makes code more testable (can mock repositories)

**Usage Example:**
```python
# ViewSets automatically provide:
# GET /api/households/ - List all
# POST /api/households/ - Create new
# GET /api/households/{id}/ - Retrieve one
# PUT /api/households/{id}/ - Update
# DELETE /api/households/{id}/ - Delete
```

---

## 5. Observer Pattern

### Location: `backend/api/notification_service.py` and `backend/api/models.py`

**Pattern Description:**
The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

**Implementation:**
The notification system observes events (bill generation, payments) and notifies relevant users:

```python
class NotificationService:
    @staticmethod
    def notify_new_bill(bill):
        """Notify household of new bill generation"""
        household_user = bill.household.user
        if household_user:
            NotificationService.create_notification(
                user=household_user,
                notification_type='new_bill',
                title='New Bill Generated',
                message=f'New bill {bill.bill_number}...',
                link=f'/bills'
            )
    
    @staticmethod
    def notify_household_payment(payment):
        """Notify admin/manager when household makes payment"""
        admins = User.objects.filter(role__in=['Admin', 'Manager'])
        for admin in admins:
            NotificationService.create_notification(...)
```

**Why Used:**
- Decouples event sources (bills, payments) from observers (users)
- Allows multiple notifications for a single event
- Easy to add new notification types without modifying existing code
- Follows Open/Closed Principle

**Usage Example:**
```python
# In views.py - When bill is created
bill = Bill.objects.create(...)
NotificationService.notify_new_bill(bill)  # Observers notified

# When payment is made
payment = Payment.objects.create(...)
NotificationService.notify_household_payment(payment)  # Observers notified
```

---

## 6. Context Pattern (React)

### Location: `frontend/src/context/AuthContext.js`

**Pattern Description:**
The Context pattern (React Context API) provides a way to share data across the component tree without prop drilling.

**Implementation:**
```javascript
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const login = async (username, password) => {
        // Login logic
    };
    
    const logout = async () => {
        // Logout logic
    };
    
    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        // ... other values
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
```

**Why Used:**
- Eliminates prop drilling (passing props through multiple component levels)
- Provides global authentication state
- Makes authentication state accessible to any component
- Simplifies state management for user data

**Usage Example:**
```javascript
// In any component
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user, isAdmin, logout } = useAuth();
    
    return (
        <div>
            <h1>Welcome {user?.full_name}</h1>
            {isAdmin && <AdminPanel />}
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

---

## 7. Adapter Pattern

### Location: `frontend/src/services/api.js`

**Pattern Description:**
The Adapter pattern allows incompatible interfaces to work together by wrapping an object with an adapter that translates calls.

**Implementation:**
The API service adapts Axios HTTP client to provide a simplified, application-specific interface:

```javascript
// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - adapts requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

// Response interceptor - adapts responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle token refresh
        // Adapt error responses
    }
);

// Adapted API interface
export const authAPI = {
    register: (data) => api.post('/auth/register/', data),
    login: (data) => api.post('/auth/login/', data),
    logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
};
```

**Why Used:**
- Adapts Axios to application-specific needs
- Adds automatic token handling
- Implements token refresh logic
- Provides a clean, consistent API interface
- Hides complexity of HTTP client from components

**Usage Example:**
```javascript
// Components use simplified interface
import { authAPI } from '../services/api';

// Instead of raw axios calls
await authAPI.login({ username, password });
await authAPI.register(userData);
```

---

## 8. Strategy Pattern (Implicit)

### Location: `backend/api/permissions.py` and `backend/api/views.py`

**Pattern Description:**
The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.

**Implementation:**
Different permission classes represent different authorization strategies:

```python
# Different permission strategies
class IsAdminUser(BasePermission):
    """Only admin users"""
    
class IsManagerOrAdmin(BasePermission):
    """Manager or admin users"""
    
class IsHouseholdOwner(BasePermission):
    """Household can only access their own data"""

# Used in views
class HouseholdViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # Strategy
    
    def get_queryset(self):
        """Different filtering strategies based on role"""
        if user.role == 'Household':
            # Strategy: Filter to own household
            queryset = queryset.filter(user=user)
        # Strategy: Show all for admin/manager
```

**Why Used:**
- Allows different authorization strategies
- Easy to change permission logic
- Encapsulates role-based access control
- Makes views flexible and reusable

---

## Summary

### Patterns by Category:

**Creational Patterns:**
- ✅ Factory Pattern (UserManager)
- ✅ Singleton Pattern (SMSService)

**Structural Patterns:**
- ✅ Adapter Pattern (API Service)
- ✅ Repository Pattern (ViewSets)

**Behavioral Patterns:**
- ✅ Observer Pattern (Notification System)
- ✅ Strategy Pattern (Permissions)
- ✅ Service Pattern (Business Logic Services)
- ✅ Context Pattern (React State Management)

### Benefits of Using These Patterns:

1. **Maintainability**: Code is organized and easy to modify
2. **Testability**: Services and repositories can be easily mocked
3. **Reusability**: Components can be reused across the application
4. **Scalability**: Patterns support future growth and changes
5. **Separation of Concerns**: Business logic separated from presentation
6. **Code Quality**: Follows industry best practices and SOLID principles

---

## References

- Django REST Framework: https://www.django-rest-framework.org/
- React Context API: https://react.dev/reference/react/useContext
- Design Patterns: https://refactoring.guru/design-patterns

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Project:** Village Water System

