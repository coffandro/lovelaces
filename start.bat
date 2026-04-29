@echo off
setlocal

pushd "%~dp0"

if not exist "lovelaces.exe" (
	echo lovelaces.exe was not found in this directory.
	popd
	exit /b 1
)

start "" "%~dp0lovelaces.exe"
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

echo Press Ctrl+C to exit.
:wait
timeout /t 1 /nobreak >nul
goto wait
