@echo off

set gameName=%~1
set executable=%~2
set executableName=%~3

title EasyGSM %gameName% Manager
setlocal enabledelayedexpansion

set destinationPath=%USERPROFILE%\Documents\EasyGSM\%gameName%\logs\error
set crashCount=0
set logName=Application
set errorLogPath=C:\temp\EasyGSM
set errorLogFile=%errorLogPath%\%gameName%CrashLog.txt
set query=*[System[(EventID=1000 or EventID=1001)]]

:Start
    start /wait "%executable%"
    cls
    call GetHardwareResourceLevels.bat
    echo Hardware Resource Levels writen to %USERPROFILE%\Documents\EasyGSM\%gameName%\logs\error\resource_usage.txt
    set /a crashCount+=1

    if not exist "%errorLogPath%" mkdir "%errorLogPath%"
    if not exist "%destinationPath%" mkdir "%destinationPath%"
    if exist "%errorLogFile%" del "%errorLogFile%"
    wevtutil qe %logName% /q:"%query%" /f:text > "%errorLogFile%"
    
    echo Crash Number: !crashCount!

    @REM "../../Filterlogs.exe"
    @REM echo Filtered Eventlogs to %destinationPath%\PalServerErrorLogs.json

    TIMEOUT /T 15

GOTO:Start