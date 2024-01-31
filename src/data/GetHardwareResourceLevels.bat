@echo off
setlocal

set destination=%USERPROFILE%\Documents\PalServer\logs\error
set filename=resource_usage.txt

if not exist %destination% mkdir %destination%

:: Get CPU usage
echo CPU USAGE IN %% > %destination%\%filename%
wmic cpu get loadpercentage >> %destination%\%filename%

systeminfo | findstr /C:"Available Physical Memory" >> %destination%\%filename%

echo NETWORK USAGE IN BYTES >> %destination%\%filename%
netstat -e >> %destination%\%filename%

endlocal