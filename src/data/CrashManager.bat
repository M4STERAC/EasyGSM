@echo off
title PalServer Manager
setlocal enabledelayedexpansion

set crashCount=0
set applicationName=PalServer-Win64-Test-Cmd.exe
set logName=Application
set errorLogPath=C:\temp\EasyGSM
set errorLogFile=%errorLogPath%\PalWorldServerCrashLog.txt
set query=*[System[(EventID=1000 or EventID=1001)]]
set destinationPath=%USERPROFILE%\Documents\EasyGSM\PalServer\logs\error

:Start
    "C:\Program Files (x86)\Steam\steamapps\common\PalServer\PalServer.exe"
    cls
    call GetHardwareResourceLevels.bat
    echo Hardware Resource Levels writen to %USERPROFILE%\Documents\EasyGSM\PalServer\logs\error\resource_usage.txt
    set /a crashCount+=1

    if not exist "%errorLogPath%" mkdir "%errorLogPath%"
    if not exist "%destinationPath%" mkdir "%destinationPath%"
    if exist "%errorLogFile%" del "%errorLogFile%"
    wevtutil qe %logName% /q:"%query%" /f:text > "%errorLogFile%"
    
    echo Crash Number: !crashCount!

    "../Filterlogs.exe"
    echo Filtered Eventlogs to %destinationPath%\PalServerErrorLogs.json

    TIMEOUT /T 15

GOTO:Start