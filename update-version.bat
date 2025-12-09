@echo off
REM Update version.txt from current git branch

for /f "tokens=*" %%i in ('git branch --show-current') do set BRANCH=%%i
echo %BRANCH%> version.txt
echo Updated version.txt to: %BRANCH%

