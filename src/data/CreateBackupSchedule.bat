@echo off
schtasks /query /tn "PalServerBackupSchedule" >nul 2>&1
if errorlevel 1 (
    echo The task does not exist.
    schtasks /create /sc daily /tn "PalServerBackupSchedule" /tr "%~dp0BackupManager.bat" /st 06:00
) else (
    echo The task exists, deleting now...
    schtasks /delete /tn "PalServerBackupSchedule" /f
    schtasks /create /sc daily /tn "PalServerBackupSchedule" /tr "%~dp0BackupManager.bat" /st 06:00
)
pause