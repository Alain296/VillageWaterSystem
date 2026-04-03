Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleaning test database and running tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Deleting old test database..." -ForegroundColor Yellow

# Delete the test database using Django shell
python manage.py shell -c "from django.db import connection; connection.creation.destroy_test_db('test_village_water_system', verbosity=1, keepdb=False)" 2>$null

Write-Host ""
Write-Host "Running Django tests..." -ForegroundColor Yellow
Write-Host ""

# Run tests
python manage.py test api.tests --verbosity=2

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test execution completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

