Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Village Water System Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Creating database..." -ForegroundColor Yellow

# Try to create database using MySQL command
$dbName = "village_water_system"
$dbUser = "root"
$dbPassword = "Chemistry77+"

# Create database
try {
    $createDbCmd = "CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    mysql -u $dbUser -p$dbPassword -e $createDbCmd 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Note: Could not create database via command line." -ForegroundColor Yellow
        Write-Host "Please create it manually using MySQL Workbench or command line:" -ForegroundColor Yellow
        Write-Host "  CREATE DATABASE village_water_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
        Write-Host ""
        $continue = Read-Host "Press Enter to continue with migrations (if database exists) or Ctrl+C to cancel"
    }
} catch {
    Write-Host "Note: MySQL command not found in PATH." -ForegroundColor Yellow
    Write-Host "Please create the database manually:" -ForegroundColor Yellow
    Write-Host "  1. Open MySQL Workbench or command line" -ForegroundColor White
    Write-Host "  2. Run: CREATE DATABASE village_water_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Press Enter to continue with migrations (if database exists) or Ctrl+C to cancel"
}

Write-Host ""
Write-Host "Running migrations..." -ForegroundColor Yellow
python manage.py migrate

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database setup completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run the server with: python manage.py runserver" -ForegroundColor Green

