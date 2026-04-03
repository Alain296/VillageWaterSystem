Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Registration (Safe - Uses Test DB)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: Tests use a SEPARATE test database." -ForegroundColor Green
Write-Host "Your real project data is SAFE!" -ForegroundColor Green
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Running Registration Tests..." -ForegroundColor Yellow
Write-Host ""

# Run only registration tests
python manage.py test api.tests.AuthenticationTests.test_register_user_success --verbosity=2

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test completed! Your real database is untouched." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

