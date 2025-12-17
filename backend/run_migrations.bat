@echo off
echo Starting migrations... > migration_log.txt
.\venv\Scripts\python.exe manage.py makemigrations api >> migration_log.txt 2>&1
echo Make migrations finished with code %ERRORLEVEL% >> migration_log.txt
.\venv\Scripts\python.exe manage.py migrate >> migration_log.txt 2>&1
echo Migrate finished with code %ERRORLEVEL% >> migration_log.txt
echo Done. >> migration_log.txt
