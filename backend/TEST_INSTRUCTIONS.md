# How to Run Tests - Quick Guide

## Quick Command (Windows)

### Option 1: Double-click the batch file
Simply double-click `run_tests.bat` in the `backend` folder.

### Option 2: Run from Command Line

```bash
cd backend
run_tests.bat
```

### Option 3: Direct Python Command

```bash
cd backend
venv\Scripts\activate
python manage.py test api.tests --verbosity=2
```

## What Tests Are Included?

The test suite includes **30+ test cases** covering:

✅ **Authentication Tests** (5 tests)
- User registration
- User login
- Duplicate username handling
- Invalid credentials
- Protected endpoint access

✅ **Household Management Tests** (4 tests)
- Create household
- List households
- Auto-generate household codes
- Validation (national ID format)

✅ **Water Usage Tests** (3 tests)
- Record water usage
- Validate readings
- Auto-calculate liters used

✅ **Billing Tests** (2 tests)
- Generate bills
- Bill calculation

✅ **Payment Tests** (3 tests)
- Create payments
- Auto-generate receipt numbers
- Update bill status

✅ **Report Generation Tests** (4 tests)
- CSV exports (households, payments)
- PDF exports (households, payments)

✅ **Permission Tests** (2 tests)
- Role-based access control
- Household users see only own data

## Expected Output

When you run the tests, you should see:

```
Creating test database for alias 'default'...
System check identified no issues (0 silenced).

test_register_user_success (api.tests.AuthenticationTests) ... ok
test_login_success (api.tests.AuthenticationTests) ... ok
test_create_household_success (api.tests.HouseholdTests) ... ok
...

----------------------------------------------------------------------
Ran 30 tests in X.XXXs

OK
Destroying test database for alias 'default'...
```

## Troubleshooting

**If you get "No module named 'api'" error:**
- Make sure you're in the `backend` directory
- Ensure virtual environment is activated

**If tests fail:**
- Check that your database is properly configured
- Ensure all migrations are applied: `python manage.py migrate`

## For Lecturer Demonstration

**Show this command:**
```bash
cd backend && python manage.py test api.tests --verbosity=2
```

**Or show the test file:**
- Open `backend/api/tests.py` to show all test cases
- Show `TESTING_PLAN.md` for comprehensive testing documentation

