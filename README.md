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
-CrashManager           - Restarts server on crash and queries all 1000 and 1001 event IDs from event viewer and drops them in C:/temp/
-BackupManager          - Creates a backup of all PalWorld saves and puts the backups in $home/Documents/{partition by date}/
-CrashEventFilter.ts    - Reads the error logs in C:/temp/ and filters the ones for PalServer and outputs them to $home\Documents as a JSON file
-index.ts               - Used to execute the TS files