@echo off
title KandyPack Application Startup

echo ==========================================
echo Starting KandyPack Application
echo ==========================================
echo.

REM Stop any existing processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1

REM Check MySQL service
echo Checking MySQL service...
sc query MySQL93 | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo MySQL service is running
) else (
    echo Starting MySQL service...
    net start MySQL93
)

echo.
echo Starting Backend Server...
cd /d "%~dp0backend"
start "KandyPack Backend" cmd /k "echo Backend starting... && node server.js"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo Starting Frontend Application...
cd /d "%~dp0"
start "KandyPack Frontend" cmd /k "echo Frontend starting... && npm start"

echo.
echo ==========================================
echo KandyPack is starting up!
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Login credentials:
echo - Admin: admin / admin123
echo - Customer: john / john123
echo - Driver: saman / saman123
echo - Assistant: priya / priya123
echo ==========================================
echo.
echo Both applications are starting in separate windows.
echo You can close this window once they are running.
echo.
pause