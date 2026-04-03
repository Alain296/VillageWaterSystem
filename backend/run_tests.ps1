Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Village Water System - Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Running Django tests..." -ForegroundColor Yellow
Write-Host ""

# Run tests with automatic yes for database deletion
python manage.py test api.tests --verbosity=2 --keepdb

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test execution completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

