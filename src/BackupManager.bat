@echo off
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set currentDate=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

set targetPath=%USERPROFILE%\AppData\Local\Pal\Saved\SaveGames\
set destinationPath=%USERPROFILE%\Documents\PalServerBackups

if not exist "%destinationPath%\%currentDate%" mkdir "%destinationPath%\%currentDate%"
if not exist "%destinationPath%\" mkdir "%destinationPath%"
if not exist "%targetPath%" echo "PalWorld saves not found at native path. Please move saves to their native directory at %targetPath%"

powershell -command "Compress-Archive -Path '%targetPath%*' -DestinationPath '%destinationPath%\%currentDate%\WorldSaveBackups.zip'"
pause
exit