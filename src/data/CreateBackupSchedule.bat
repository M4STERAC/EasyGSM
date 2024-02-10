@echo off

set game=%~1
@REM xx:xx format. Example 06:00
set time=%~2

schtasks /query /tn "%game%BackupSchedule" >nul 2>&1
if errorlevel 1 (
    echo The task does not exist.
    schtasks /create /sc daily /tn "%game%PalServerBackupSchedule" /tr "%~dp0BackupManager.bat" /st %time%
) else (
    echo The task exists, deleting now...
    schtasks /delete /tn "%game%PalServerBackupSchedule" /f
    schtasks /create /sc daily /tn "%game%PalServerBackupSchedule" /tr "%~dp0BackupManager.bat" /st %time%
)
pause