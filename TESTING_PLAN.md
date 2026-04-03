# Testing Plan for Village Water System

## Overview
This document outlines a comprehensive testing plan for the Village Water System application. The plan covers unit tests, integration tests, and end-to-end tests for both backend (Django) and frontend (React) components.

---

## Table of Contents
1. [Testing Strategy](#testing-strategy)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Integration Testing](#integration-testing)
5. [Test Cases](#test-cases)
6. [Test Execution](#test-execution)
7. [Test Coverage Goals](#test-coverage-goals)

---

## Testing Strategy

### Testing Levels
1. **Unit Tests**: Test individual components/functions in isolation
2. **Integration Tests**: Test interaction between components
3. **API Tests**: Test REST API endpoints
4. **Frontend Component Tests**: Test React components
5. **End-to-End Tests**: Test complete user workflows

### Testing Tools
- **Backend**: Django TestCase, Django REST Framework APIClient
- **Frontend**: Jest, React Testing Library
- **API Testing**: Postman/Insomnia (manual), pytest-django (automated)
- **Coverage**: Coverage.py (backend), Jest coverage (frontend)

---

## Backend Testing

### Test Structure
```
backend/
├── api/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_models.py
│   │   ├── test_serializers.py
│   │   ├── test_views.py
│   │   ├── test_services.py
│   │   └── test_permissions.py
│   └── tests.py (existing)
```

### Test Categories

#### 1. Model Tests (`test_models.py`)
- Model field validation
- Model methods (save, __str__)
- Auto-generated fields (household_code, bill_number, receipt_number)
- Model relationships
- Model constraints

#### 2. Serializer Tests (`test_serializers.py`)
- Field validation
- Data transformation
- Custom validation logic
- Create/update operations

#### 3. View Tests (`test_views.py`)
- API endpoint responses
- HTTP status codes
- Authentication/authorization
- CRUD operations
- Filtering and pagination
- Export functionality (CSV/PDF)

#### 4. Service Tests (`test_services.py`)
- SMS Service functionality
- Notification Service logic
- Business logic validation

#### 5. Permission Tests (`test_permissions.py`)
- Role-based access control
- Permission classes
- User role restrictions

---

## Frontend Testing

### Test Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── LoginForm.test.js
│   │   │   ├── Dashboard.test.js
│   │   │   ├── HouseholdList.test.js
│   │   │   └── ...
│   ├── context/
│   │   ├── __tests__/
│   │   │   └── AuthContext.test.js
│   ├── services/
│   │   ├── __tests__/
│   │   │   └── api.test.js
│   └── App.test.js
```

### Test Categories

#### 1. Component Tests
- Component rendering
- User interactions (clicks, form submissions)
- Props handling
- State management
- Conditional rendering

#### 2. Context Tests
- Authentication context
- State updates
- Context provider functionality

#### 3. Service Tests
- API calls
- Error handling
- Token management

---

## Integration Testing

### API Integration Tests
- Complete workflows (register → login → create household → generate bill → make payment)
- Cross-module interactions
- Database transactions
- External service integration (SMS)

### Frontend-Backend Integration
- API communication
- Authentication flow
- Data synchronization
- Error handling

---

## Test Cases

### Backend Test Cases

#### Authentication & Authorization

**TC-BE-001: User Registration**
- **Test**: Register new user with valid data
- **Expected**: User created, JWT tokens returned, status 201
- **Priority**: High

**TC-BE-002: User Registration - Duplicate Username**
- **Test**: Register user with existing username
- **Expected**: Validation error, status 400
- **Priority**: High

**TC-BE-003: User Login - Valid Credentials**
- **Test**: Login with correct username/password
- **Expected**: JWT tokens returned, status 200
- **Priority**: High

**TC-BE-004: User Login - Invalid Credentials**
- **Test**: Login with wrong password
- **Expected**: Error message, status 401
- **Priority**: High

**TC-BE-005: User Login - Inactive Account**
- **Test**: Login with inactive account
- **Expected**: Error message, status 403
- **Priority**: Medium

**TC-BE-006: Access Protected Endpoint Without Token**
- **Test**: Access /api/households/ without authentication
- **Expected**: Status 401 Unauthorized
- **Priority**: High

**TC-BE-007: Household User Can Only See Own Data**
- **Test**: Household user accesses /api/households/
- **Expected**: Only their household returned
- **Priority**: High

**TC-BE-008: Admin Can See All Households**
- **Test**: Admin accesses /api/households/
- **Expected**: All households returned
- **Priority**: High

---

#### Household Management

**TC-BE-009: Create Household - Valid Data**
- **Test**: Create household with all required fields
- **Expected**: Household created, household_code auto-generated, status 201
- **Priority**: High

**TC-BE-010: Create Household - Invalid National ID**
- **Test**: Create household with invalid national ID format
- **Expected**: Validation error, status 400
- **Priority**: Medium

**TC-BE-011: Create Household - Duplicate National ID**
- **Test**: Create household with existing national ID
- **Expected**: Validation error, status 400
- **Priority**: High

**TC-BE-012: Update Household**
- **Test**: Update household information
- **Expected**: Household updated, status 200
- **Priority**: Medium

**TC-BE-013: Delete Household**
- **Test**: Delete household
- **Expected**: Household deleted, status 204
- **Priority**: Medium

**TC-BE-014: List Households with Search Filter**
- **Test**: Search households by name/code
- **Expected**: Filtered results returned
- **Priority**: Medium

**TC-BE-015: Export Households to CSV**
- **Test**: Export households as CSV
- **Expected**: CSV file downloaded with correct data
- **Priority**: Low

**TC-BE-016: Export Households to PDF**
- **Test**: Export households as PDF
- **Expected**: PDF file downloaded with correct data
- **Priority**: Low

---

#### Water Usage

**TC-BE-017: Record Water Usage - Valid Reading**
- **Test**: Record water usage with valid meter readings
- **Expected**: Usage recorded, liters_used auto-calculated, status 201
- **Priority**: High

**TC-BE-018: Record Water Usage - Current < Previous**
- **Test**: Record usage where current reading < previous reading
- **Expected**: Validation error, status 400
- **Priority**: High

**TC-BE-019: Record Water Usage - Duplicate Month**
- **Test**: Record usage for same household and month twice
- **Expected**: Validation error, status 400
- **Priority**: High

**TC-BE-020: Calculate Liters Used Automatically**
- **Test**: Create usage record, verify liters_used = current - previous
- **Expected**: Correct calculation
- **Priority**: High

---

#### Billing System

**TC-BE-021: Generate Bill - Valid Data**
- **Test**: Generate bill for household with usage record
- **Expected**: Bill created, bill_number auto-generated, total calculated, status 201
- **Priority**: High

**TC-BE-022: Generate Bill - No Usage Record**
- **Test**: Generate bill without usage record
- **Expected**: Error message, status 400
- **Priority**: High

**TC-BE-023: Generate Bill - No Active Tariff**
- **Test**: Generate bill when no active tariff exists
- **Expected**: Error message, status 400
- **Priority**: High

**TC-BE-024: Generate Bills for All Households**
- **Test**: Bulk generate bills for all active households
- **Expected**: Bills created for all households with usage records
- **Priority**: Medium

**TC-BE-025: Bill Auto-Calculation**
- **Test**: Verify bill total = (liters × rate) + penalty - discount
- **Expected**: Correct calculation
- **Priority**: High

**TC-BE-026: Bill Status Update on Payment**
- **Test**: Make payment equal to bill total
- **Expected**: Bill status changes to 'Paid'
- **Priority**: High

---

#### Payment Processing

**TC-BE-027: Create Payment - Valid Amount**
- **Test**: Create payment with valid amount
- **Expected**: Payment created, receipt_number auto-generated, status 201
- **Priority**: High

**TC-BE-028: Create Payment - Amount Exceeds Bill Total**
- **Test**: Pay more than bill total
- **Expected**: Validation error, status 400
- **Priority**: High

**TC-BE-029: Create Payment - Household Can Only Pay Own Bills**
- **Test**: Household user tries to pay another household's bill
- **Expected**: Permission denied, status 403
- **Priority**: High

**TC-BE-030: Payment Auto-Generates Receipt Number**
- **Test**: Create payment without receipt_number
- **Expected**: Receipt number auto-generated in format RCP-YYYYMM-####
- **Priority**: Medium

**TC-BE-031: Multiple Payments for Same Bill**
- **Test**: Make partial payments for same bill
- **Expected**: All payments recorded, bill status updates when fully paid
- **Priority**: Medium

**TC-BE-032: Download Payment Receipt PDF**
- **Test**: Download receipt for payment
- **Expected**: PDF file downloaded with correct data
- **Priority**: Low

---

#### Tariff Rates

**TC-BE-033: Create Tariff Rate**
- **Test**: Create new tariff rate
- **Expected**: Tariff created, status 201
- **Priority**: Medium

**TC-BE-034: Update Tariff Rate**
- **Test**: Update existing tariff rate
- **Expected**: Tariff updated, households notified, status 200
- **Priority**: Medium

**TC-BE-035: Get Active Tariff Rate**
- **Test**: Retrieve active tariff rate
- **Expected**: Only active tariff returned
- **Priority**: Medium

---

#### Notifications

**TC-BE-036: SMS Notification on Bill Generation**
- **Test**: Generate bill, verify SMS sent
- **Expected**: SMSNotification record created
- **Priority**: Medium

**TC-BE-037: In-App Notification on Payment**
- **Test**: Make payment, verify notification created
- **Expected**: Notification created for relevant users
- **Priority**: Medium

**TC-BE-038: Notification for Tariff Change**
- **Test**: Update tariff, verify all households notified
- **Expected**: Notifications created for all household users
- **Priority**: Low

---

#### Dashboard

**TC-BE-039: Get Dashboard Statistics**
- **Test**: Retrieve dashboard stats
- **Expected**: Correct statistics returned (households, revenue, bills, etc.)
- **Priority**: Medium

**TC-BE-040: Dashboard Stats Filtered by Role**
- **Test**: Household user gets dashboard stats
- **Expected**: Only their own statistics returned
- **Priority**: Medium

**TC-BE-041: Get Dashboard Charts Data**
- **Test**: Retrieve chart data (revenue trend, bill status, top consumers)
- **Expected**: Correct chart data returned
- **Priority**: Low

---

### Frontend Test Cases

#### Authentication

**TC-FE-001: Login Form Rendering**
- **Test**: Login form renders correctly
- **Expected**: Username and password fields visible
- **Priority**: High

**TC-FE-002: Login Form Validation**
- **Test**: Submit empty login form
- **Expected**: Validation errors displayed
- **Priority**: High

**TC-FE-003: Successful Login**
- **Test**: Login with valid credentials
- **Expected**: User redirected to dashboard, user data stored
- **Priority**: High

**TC-FE-004: Login Error Handling**
- **Test**: Login with invalid credentials
- **Expected**: Error message displayed
- **Priority**: High

**TC-FE-005: Logout Functionality**
- **Test**: Click logout button
- **Expected**: User logged out, redirected to login, tokens cleared
- **Priority**: High

**TC-FE-006: Protected Route Redirect**
- **Test**: Access protected route without login
- **Expected**: Redirected to login page
- **Priority**: High

---

#### Components

**TC-FE-007: Dashboard Rendering**
- **Test**: Dashboard renders with user data
- **Expected**: Statistics and charts displayed
- **Priority**: High

**TC-FE-008: Household List Display**
- **Test**: Household list component renders
- **Expected**: Households displayed in table/list
- **Priority**: Medium

**TC-FE-009: Household Form Submission**
- **Test**: Submit household creation form
- **Expected**: Form submitted, success message shown
- **Priority**: Medium

**TC-FE-010: Bill Generation Form**
- **Test**: Generate bill form submission
- **Expected**: Bill generated, success message shown
- **Priority**: Medium

**TC-FE-011: Payment Form Validation**
- **Test**: Submit payment with invalid amount
- **Expected**: Validation error displayed
- **Priority**: High

**TC-FE-012: Notification Bell Display**
- **Test**: Notification bell shows unread count
- **Expected**: Badge with count displayed
- **Priority**: Medium

---

#### Context & State Management

**TC-FE-013: AuthContext Provides User Data**
- **Test**: Use useAuth hook
- **Expected**: User data and auth methods available
- **Priority**: High

**TC-FE-014: AuthContext Updates on Login**
- **Test**: Login updates context state
- **Expected**: User state updated, isAuthenticated true
- **Priority**: High

**TC-FE-015: Token Refresh on 401**
- **Test**: API call returns 401, token refresh triggered
- **Expected**: Token refreshed, request retried
- **Priority**: Medium

---

### Integration Test Cases

**TC-INT-001: Complete Registration Flow**
- **Test**: Register → Login → Create Household → Record Usage → Generate Bill → Make Payment
- **Expected**: All steps complete successfully
- **Priority**: High

**TC-INT-002: Admin Workflow**
- **Test**: Admin logs in → Views all households → Generates bills → Records payments
- **Expected**: All operations successful
- **Priority**: High

**TC-INT-003: Household User Workflow**
- **Test**: Household logs in → Views own data → Records usage → Views bills → Makes payment
- **Expected**: All operations successful, only own data accessible
- **Priority**: High

**TC-INT-004: Notification Flow**
- **Test**: Generate bill → Verify SMS sent → Make payment → Verify notifications created
- **Expected**: All notifications created correctly
- **Priority**: Medium

---

## Test Execution

### Running Backend Tests

```bash
# Run all tests
cd backend
python manage.py test

# Run specific test file
python manage.py test api.tests.test_views

# Run specific test case
python manage.py test api.tests.test_views.UserRegistrationTests.test_register_user

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Running Frontend Tests

```bash
# Run all tests
cd frontend
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- LoginForm.test.js
```

### Test Data Setup

**Backend Test Fixtures:**
- Create test users (admin, manager, household)
- Create test households
- Create test tariff rates
- Create test usage records
- Create test bills and payments

**Frontend Test Mocks:**
- Mock API responses
- Mock localStorage
- Mock authentication context

---

## Test Coverage Goals

### Backend Coverage Targets
- **Models**: 90%+
- **Views/API**: 85%+
- **Serializers**: 85%+
- **Services**: 80%+
- **Overall**: 85%+

### Frontend Coverage Targets
- **Components**: 80%+
- **Services**: 90%+
- **Context**: 85%+
- **Overall**: 80%+

---

## Test Maintenance

### Best Practices
1. Write tests before fixing bugs (TDD approach)
2. Keep tests independent and isolated
3. Use descriptive test names
4. Clean up test data after each test
5. Mock external dependencies
6. Test edge cases and error scenarios
7. Review and update tests when code changes

### Test Review Checklist
- [ ] All critical paths tested
- [ ] Error cases covered
- [ ] Edge cases handled
- [ ] Tests are readable and maintainable
- [ ] Test data is realistic
- [ ] No hardcoded values in tests
- [ ] Tests run quickly
- [ ] Coverage goals met

---

## Test Reporting

### Reports Generated
1. **Coverage Report**: HTML coverage report showing untested code
2. **Test Results**: Console output with pass/fail status
3. **CI/CD Integration**: Automated test runs on commits

### Metrics Tracked
- Test execution time
- Code coverage percentage
- Number of passing/failing tests
- Test reliability (flaky tests)

---

## Conclusion

This testing plan provides comprehensive coverage for the Village Water System application. Regular execution of these tests ensures code quality, prevents regressions, and maintains application reliability.

**Next Steps:**
1. Implement test cases starting with high-priority items
2. Set up CI/CD pipeline for automated testing
3. Monitor test coverage and improve gradually
4. Review and update test plan as application evolves

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Project:** Village Water System

