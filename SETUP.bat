@echo off
title ClipBridge Setup
echo.
echo  =========================================
echo   ClipBridge - First Time Setup
echo  =========================================
echo.

:: Check if already set up
if exist "%~dp0node.exe" (
    echo  ClipBridge is already set up.
    echo  You can delete this setup file if you like.
    echo.
    pause
    exit /b 0
)

:: Find node.exe on this system
echo  Looking for Node.js on your system...

set NODE_PATH=

if exist "C:\Program Files\nodejs\node.exe" (
    set NODE_PATH=C:\Program Files\nodejs\node.exe
    goto :found
)

if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set NODE_PATH=C:\Program Files (x86)\nodejs\node.exe
    goto :found
)

for /f "delims=" %%i in ('where node.exe 2^>nul') do (
    set NODE_PATH=%%i
    goto :found
)

:notfound
echo.
echo  ERROR: Node.js not found on this system.
echo  Please install Node.js from https://nodejs.org first,
echo  then run this setup again.
echo.
pause
exit /b 1

:found
echo  Found Node.js at: %NODE_PATH%
echo.
echo  Copying node.exe into ClipBridge folder...
copy "%NODE_PATH%" "%~dp0node.exe"
if errorlevel 1 (
    echo.
    echo  ERROR: Could not copy node.exe. Try right-clicking
    echo  SETUP.bat and choosing "Run as administrator".
    echo.
    pause
    exit /b 1
)
echo  Done.
echo.

:: Install dependencies
echo  Installing dependencies (this takes about 1 minute)...
cd /d "%~dp0"
where npm >nul 2>&1
if not errorlevel 1 (
    npm install
) else (
    echo  WARNING: npm not found. Please run 'npm install' manually.
)

echo.
echo  =========================================
echo   Setup complete!
echo.
echo   Double-click "Start ClipBridge.vbs"
echo   to launch the app.
echo  =========================================
echo.
pause
