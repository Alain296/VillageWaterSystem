# Docker WSL Error Fix Script
# This script attempts to fix the "mounting disk: input/output error" issue

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker WSL Error Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "WARNING: Not running as Administrator. Some operations may fail." -ForegroundColor Yellow
    Write-Host "For best results, run PowerShell as Administrator." -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Stop Docker Desktop
Write-Host "[1/6] Stopping Docker Desktop..." -ForegroundColor Yellow
$dockerProcesses = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
if ($dockerProcesses) {
    Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
    Write-Host "   Docker Desktop stopped." -ForegroundColor Green
} else {
    Write-Host "   Docker Desktop is not running." -ForegroundColor Gray
}

# Step 2: Shutdown WSL
Write-Host "[2/6] Shutting down WSL..." -ForegroundColor Yellow
try {
    wsl --shutdown 2>&1 | Out-Null
    Write-Host "   WSL shutdown complete." -ForegroundColor Green
} catch {
    Write-Host "   WSL shutdown may have failed: $_" -ForegroundColor Yellow
}

# Step 3: Wait for processes to fully terminate
Write-Host "[3/6] Waiting for processes to terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "   Wait complete." -ForegroundColor Green

# Step 4: List WSL distributions
Write-Host "[4/6] Checking WSL distributions..." -ForegroundColor Yellow
try {
    $wslList = wsl --list --verbose 2>&1
    Write-Host "   Current WSL distributions:" -ForegroundColor Gray
    $wslList | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} catch {
    Write-Host "   Could not list WSL distributions." -ForegroundColor Yellow
}

# Step 5: Check Docker data directory
Write-Host "[5/6] Checking Docker data directory..." -ForegroundColor Yellow
$dockerDataPath = "$env:LOCALAPPDATA\Docker"
if (Test-Path $dockerDataPath) {
    $diskSpace = (Get-PSDrive C).Free / 1GB
    Write-Host "   Docker data path: $dockerDataPath" -ForegroundColor Gray
    Write-Host "   Available disk space: $([math]::Round($diskSpace, 2)) GB" -ForegroundColor Gray
    
    if ($diskSpace -lt 5) {
        Write-Host "   WARNING: Low disk space! Docker needs at least 5GB free." -ForegroundColor Red
    } else {
        Write-Host "   Disk space is sufficient." -ForegroundColor Green
    }
} else {
    Write-Host "   Docker data directory not found (this is normal if Docker was never started)." -ForegroundColor Gray
}

# Step 6: Restart Docker Desktop
Write-Host "[6/6] Attempting to restart Docker Desktop..." -ForegroundColor Yellow
$dockerExe = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerExe) {
    try {
        Start-Process $dockerExe
        Write-Host "   Docker Desktop start command issued." -ForegroundColor Green
        Write-Host ""
        Write-Host "   Please wait for Docker Desktop to fully start (this may take 1-2 minutes)." -ForegroundColor Cyan
    } catch {
        Write-Host "   Could not start Docker Desktop automatically." -ForegroundColor Red
        Write-Host "   Please start Docker Desktop manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "   Docker Desktop executable not found at: $dockerExe" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix script completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait for Docker Desktop to fully start" -ForegroundColor White
Write-Host "2. Try running your docker-compose command again" -ForegroundColor White
Write-Host "3. If the error persists, try Solution 2 (Factory Reset) from DOCKER_WSL_TROUBLESHOOTING.md" -ForegroundColor White
Write-Host ""

# Optional: Ask if user wants to try factory reset
$response = Read-Host "Would you like to try a factory reset? (y/N)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "To perform a factory reset:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop" -ForegroundColor White
    Write-Host "2. Go to Settings → Troubleshoot" -ForegroundColor White
    Write-Host "3. Click 'Reset to factory defaults'" -ForegroundColor White
    Write-Host ""
}

