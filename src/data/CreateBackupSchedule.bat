@echo off

set game=%~1
set time=%~2
set saveDirectory=%~3

schtasks /query /tn "%game%BackupSchedule" >nul 2>&1
if errorlevel 1 (
    echo The task does not exist.
    schtasks /create /sc daily /tn "%game%BackupSchedule" /tr "%~dp0BackupManager.bat" /st %time%
) else (
    echo The task exists, deleting now...
    schtasks /delete /tn "%game%BackupSchedule" /f
    schtasks /create /sc daily /tn "%game%BackupSchedule" /tr "%~dp0BackupManager.bat %game% %saveDirectory%" /st %time%
)
pause