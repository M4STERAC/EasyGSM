@echo off
title PalServer Manager
setlocal enabledelayedexpansion

set crashCount = 0
set applicationName=PalServer-Win64-Test-Cmd.exe
set logName=Application
set errorLogPath=C:\temp
set errorLogFile=%errorLogPath%\PalWorldServerCrashLog.txt
set query=*[System[(EventID=1000 or EventID=1001)]]

:Start
    "C:\Program Files (x86)\Steam\steamapps\common\PalServer\PalServer.exe"
    cls
    set /a crashCount+=1

    if not exist "%errorLogPath%" mkdir "%errorLogPath%"
    if exist "%errorLogFile%" del "%errorLogFile%"
    wevtutil qe %logName% /q:"%query%" /f:text > "%errorLogFile%"
    
    echo Crash Number: !crashCount!
    echo Logs of the most recent crash has been output to %errorLogFile%

    node ../LogFilter.exe
    echo Filtered Eventlogs to PalServerErrorLogs.json in your documents folder

    TIMEOUT /T 30

GOTO:Start