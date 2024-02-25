# PalServer-Manager
Auto manager for PalServer

## How to use
-Run batch script in src/
    -The batch script does everything for you 
        -Any crashes are handled programatically
        -Logs are output to %USER%\Documents\PalServerErrorLogs.json
-Do not run any .exe file in the project


## Directories
src         ~   All files that execute      <br>
.vscode     ~   Launch configuration        <br>
.test       ~   Holds tests for functions   <br>
.data       ~   Holds test data             <br>

## Relavent Commands
Found in package.json

## Files and Their Uses
-CrashManager               - Restarts server on crash and queries all 1000 and 1001 event IDs from event viewer and drops them in C:/temp/
-BackupManager              - Creates a backup of all PalWorld saves and puts the backups in $home/Documents/{partition by date}/
-CrashEventFilter           - Reads the error logs in $Home\Documents\PalServer\logs\error\ and filters the ones for PalServer and outputs them to $home\Documents as a JSON file
-index                      - Used to execute the TS files
-CreateBackupSchedule       - Creates a task schedule to create backups for for all worlds in the server. Backups are created daily at 6AM
-GetHardwareResourceLevels  - Gets the hardware resource levels of the computer this manager is running on and logs it to a file in $Home\Documents\PalServer\logs\error\

### Additional Notes
User hosting the server must be logged on for backups to be created

By default, it writes logs to the following locations:

on Linux: ~/.config/{app name}/logs/main.log
on macOS: ~/Library/Logs/{app name}/main.log
on Windows: %USERPROFILE%\AppData\Roaming\easygsm\logs\main.log