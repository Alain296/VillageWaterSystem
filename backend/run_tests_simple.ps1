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
Write-Host "Deleting MySQL test database..." -ForegroundColor Yellow

# Delete test database using MySQL command
$mysqlCmd = "DROP DATABASE IF EXISTS test_village_water_system;"
# Try to execute via mysql command if available
try {
    mysql -u root -pChemistry77+ -e $mysqlCmd 2>$null
    Write-Host "Test database deleted." -ForegroundColor Green
} catch {
    Write-Host "Note: Could not auto-delete MySQL database. Please delete manually if needed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Running Django tests with SQLite..." -ForegroundColor Yellow
Write-Host ""

# Run tests with SQLite settings
python manage.py test api.tests --verbosity=2 --settings=VillageWaterSystem.test_settings

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test execution completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

