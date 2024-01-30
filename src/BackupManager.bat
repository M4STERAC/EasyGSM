@echo off
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set currentDate=%datetime:~0,4%\\%datetime:~4,2%\\%datetime:~6,2%

set targetPath=%USERPROFILE%\AppData\Local\Pal\Saved\SaveGames\
set secondTargetPath=C:\Program Files (x86)\Steam\steamapps\common\PalServer\Pal\Saved\SaveGames\
set destinationPath=%USERPROFILE%\Documents\PalServer\backups

if not exist "%destinationPath%\%currentDate%" mkdir "%destinationPath%\%currentDate%"
if not exist "%destinationPath%\" mkdir "%destinationPath%"
if not exist "%targetPath%" (
    if not exist "%secondTargetPath%" (
        echo "PalWorld saves not found at native path. Please move saves to their native directory at %targetPath%"
        pause
        exit
    )
    powershell -command "Compress-Archive -Path '%secondTargetPath%*' -DestinationPath '%destinationPath%\%currentDate%\WorldSaveBackups.zip'"
)
if not exist "%targetPath%" echo "PalWorld saves not found at native path. Please move saves to their native directory at %targetPath%"

powershell -command "Compress-Archive -Path '%targetPath%*' -DestinationPath '%destinationPath%\%currentDate%\WorldSaveBackups.zip'"
exit