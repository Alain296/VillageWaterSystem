Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restoring Original Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Step 1: Creating/Resetting database..." -ForegroundColor Yellow

$dbName = "village_water_system"
$dbUser = "root"
$dbPassword = "Chemistry77+"

# Drop and recreate database using schema.sql
try {
    Write-Host "Dropping existing database (if exists)..." -ForegroundColor Yellow
    mysql -u $dbUser -p$dbPassword -e "DROP DATABASE IF EXISTS $dbName;" 2>$null
    
    Write-Host "Creating fresh database..." -ForegroundColor Yellow
    mysql -u $dbUser -p$dbPassword -e "CREATE DATABASE $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Step 2: Running schema.sql..." -ForegroundColor Yellow
        $schemaPath = "..\database\schema.sql"
        
        if (Test-Path $schemaPath) {
            mysql -u $dbUser -p$dbPassword $dbName < $schemaPath 2>$null
            Write-Host "Schema loaded successfully!" -ForegroundColor Green
        } else {
            Write-Host "Schema file not found. Running Django migrations instead..." -ForegroundColor Yellow
            python manage.py migrate
        }
    } else {
        Write-Host "Could not create database via command line." -ForegroundColor Yellow
        Write-Host "Please run the SQL manually:" -ForegroundColor Yellow
        Write-Host "  1. Open MySQL Workbench" -ForegroundColor White
        Write-Host "  2. Run: DROP DATABASE IF EXISTS village_water_system;" -ForegroundColor White
        Write-Host "  3. Run: CREATE DATABASE village_water_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
        Write-Host "  4. Then run: python manage.py migrate" -ForegroundColor White
        Write-Host ""
        $continue = Read-Host "Press Enter to continue with migrations (if database exists) or Ctrl+C to cancel"
        python manage.py migrate
    }
} catch {
    Write-Host "MySQL command not found. Using Django migrations..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please ensure the database exists, then running migrations..." -ForegroundColor Yellow
    python manage.py migrate
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database restored to original state!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run the server with: python manage.py runserver" -ForegroundColor Green

