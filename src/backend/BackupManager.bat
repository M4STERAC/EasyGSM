@echo off

set game=%~1
set saveDirectory=%~2

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I

set currentDate=%datetime:~0,4%\\%datetime:~4,2%\\%datetime:~6,2%
set destinationPath=%USERPROFILE%\Documents\EasyGSM\%game%\Backups


if not exist "%destinationPath%\%currentDate%" mkdir "%destinationPath%\%currentDate%"
if not exist "%destinationPath%\" mkdir "%destinationPath%"
if not exist "%saveDirectory%" (
    echo "PalWorld saves not found at native path. Please move saves to their native directory at %saveDirectory%"
    pause
)
powershell -command "Compress-Archive -Path '%saveDirectory%*' -DestinationPath '%destinationPath%\%currentDate%\WorldSaveBackups.zip'"
exit