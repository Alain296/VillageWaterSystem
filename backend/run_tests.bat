@echo off
echo ========================================
echo Village Water System - Test Suite
echo ========================================
echo.

cd /d %~dp0

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Running Django tests...
echo.

python manage.py test api.tests --verbosity=2

echo.
echo ========================================
echo Test execution completed!
echo ========================================
pause

