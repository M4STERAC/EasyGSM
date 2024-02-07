@echo off

set gameName=%~1
set imageName=%~2

if not defined imageName set imageName=cmd.exe
taskkill /IM %imageName% /FI "WINDOWTITLE eq EasyGSM %gameName% Manager"