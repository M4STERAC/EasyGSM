@echo off

set gameName=%~1
set executable=%~2

title EasyGSM %gameName% Manager
setlocal enabledelayedexpansion

set destinationPath=%USERPROFILE%\Documents\EasyGSM\%gameName%\logs\error
set crashCount=0
set logName=Application
set errorLogPath=C:\temp\EasyGSM
set errorLogFile=%errorLogPath%\%gameName%CrashLog.txt
set query=*[System[(EventID=1000 or EventID=1001)]]

:Start
    "%executable%"
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


@REM @echo off
@REM title PalServer Manager
@REM setlocal enabledelayedexpansion

@REM set crashCount=0
@REM set applicationName=PalServer-Win64-Test-Cmd.exe
@REM set logName=Application
@REM set errorLogPath=C:\temp\EasyGSM
@REM set errorLogFile=%errorLogPath%\PalWorldServerCrashLog.txt
@REM set query=*[System[(EventID=1000 or EventID=1001)]]
@REM set destinationPath=%USERPROFILE%\Documents\EasyGSM\PalServer\logs\error

@REM :Start
@REM     "C:\Program Files (x86)\Steam\steamapps\common\PalServer\PalServer.exe"
@REM     cls
@REM     call GetHardwareResourceLevels.bat
@REM     echo Hardware Resource Levels writen to %USERPROFILE%\Documents\EasyGSM\PalServer\logs\error\resource_usage.txt
@REM     set /a crashCount+=1

@REM     if not exist "%errorLogPath%" mkdir "%errorLogPath%"
@REM     if not exist "%destinationPath%" mkdir "%destinationPath%"
@REM     if exist "%errorLogFile%" del "%errorLogFile%"
@REM     wevtutil qe %logName% /q:"%query%" /f:text > "%errorLogFile%"
    
@REM     echo Crash Number: !crashCount!

@REM     "../Filterlogs.exe"
@REM     echo Filtered Eventlogs to %destinationPath%\PalServerErrorLogs.json

@REM     TIMEOUT /T 15

@REM GOTO:Start