# Docker Desktop WSL Error Troubleshooting Guide

## Error Description
```
preparing block device /dev/sde: mounting disk: input/output error
```

This error indicates that Docker Desktop's WSL backend is having trouble mounting a virtual disk device. This is typically caused by:
- Corrupted WSL distribution
- Docker Desktop's virtual disk corruption
- WSL configuration issues
- Disk I/O problems

## Solutions (Try in Order)

### Solution 1: Restart WSL and Docker Desktop

1. **Close Docker Desktop completely** (make sure it's not running in the system tray)

2. **Restart WSL** in PowerShell (as Administrator):
   ```powershell
   wsl --shutdown
   ```

3. **Wait 10-15 seconds**, then restart Docker Desktop

4. **Try running your Docker containers again**

### Solution 2: Reset Docker Desktop to Factory Defaults

If Solution 1 doesn't work:

1. **Open Docker Desktop**
2. Click **Settings** (gear icon)
3. Go to **Troubleshoot** tab
4. Click **Reset to factory defaults**
5. **Restart Docker Desktop**
6. Reconfigure your Docker settings if needed

### Solution 3: Reinstall WSL Distribution

1. **List WSL distributions**:
   ```powershell
   wsl --list --verbose
   ```

2. **Shutdown WSL**:
   ```powershell
   wsl --shutdown
   ```

3. **Unregister Docker's WSL distribution** (if it exists):
   ```powershell
   wsl --unregister docker-desktop
   wsl --unregister docker-desktop-data
   ```

4. **Restart Docker Desktop** - it will recreate the distributions

### Solution 4: Clean Docker Desktop Data

1. **Close Docker Desktop**

2. **Delete Docker Desktop data** (backup first if needed):
   ```powershell
   # Navigate to Docker data directory
   cd $env:LOCALAPPDATA\Docker
   
   # Backup (optional)
   Copy-Item -Path "wsl" -Destination "wsl_backup" -Recurse
   
   # Delete WSL data
   Remove-Item -Path "wsl\data\ext4.vhdx" -Force -ErrorAction SilentlyContinue
   ```

3. **Restart Docker Desktop**

### Solution 5: Update WSL and Docker Desktop

1. **Update WSL**:
   ```powershell
   wsl --update
   ```

2. **Update Docker Desktop** to the latest version from [Docker's website](https://www.docker.com/products/docker-desktop/)

3. **Restart your computer**

### Solution 6: Switch Docker Backend (If Available)

If you have Hyper-V available, you can try switching Docker Desktop to use Hyper-V instead of WSL2:

1. Open **Docker Desktop Settings**
2. Go to **General** tab
3. Uncheck **"Use the WSL 2 based engine"** (if available)
4. **Apply & Restart**

### Solution 7: Check Disk Space and Health

1. **Check available disk space** on your system drive (Docker needs space for virtual disks)

2. **Run Windows Disk Check**:
   ```powershell
   chkdsk C: /f
   ```
   (Replace C: with your system drive if different)

3. **Restart your computer** if disk check found issues

## Quick Fix Script

Run this PowerShell script as Administrator to perform a quick reset:

```powershell
# Stop Docker Desktop
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue

# Shutdown WSL
wsl --shutdown

# Wait a moment
Start-Sleep -Seconds 5

# Restart Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

## Prevention Tips

1. **Regularly update** Docker Desktop and WSL
2. **Don't force-close** Docker Desktop - use proper shutdown
3. **Maintain adequate disk space** (at least 10GB free)
4. **Avoid running multiple WSL distributions** simultaneously if possible
5. **Keep Windows updated**

## Alternative: Use Docker Without WSL2

If WSL2 continues to cause issues, you can:
- Use Docker with Hyper-V backend (Windows Pro/Enterprise)
- Use Docker Toolbox (older, but more stable on some systems)
- Run containers directly on a Linux VM

## Still Having Issues?

If none of these solutions work:
1. Gather diagnostics from Docker Desktop (Settings → Troubleshoot → Gather diagnostics)
2. Check Docker Desktop logs: `%LOCALAPPDATA%\Docker\log.txt`
3. Check WSL logs: `wsl --list --verbose` and check individual distro logs
4. Submit a support request to Docker with the diagnostics

