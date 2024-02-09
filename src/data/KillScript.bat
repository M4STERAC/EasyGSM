@echo off

set gameName=%~1
taskkill /IM cmd.exe /FI "WINDOWTITLE eq EasyGSM %gameName% Manager"
pause