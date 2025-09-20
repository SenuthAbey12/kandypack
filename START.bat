@echo off
title KandyPack Startup
echo.
echo ==========================================
echo    Starting KandyPack Application
echo ==========================================
echo.

REM Kill any existing processes
echo Cleaning up existing processes...
taskkill /f /im node.exe /t >nul 2>&1

REM Check MySQL
echo Checking MySQL service...
sc query MySQL93 | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo Starting MySQL...
    net start MySQL93 >nul 2>&1
)
echo MySQL is ready!

echo.
echo Starting Backend Server...
cd /d "%~dp0backend"
start "KandyPack Backend" cmd /k "echo Backend Server Running... && node server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend...
cd /d "%~dp0"
start "KandyPack Frontend" cmd /k "echo Frontend Running... && npm start"

echo.
echo ==========================================
echo    KandyPack is Starting!
echo ==========================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Test Credentials:
echo - Admin: admin / admin123
echo - Customer: john / john123
echo - Driver: saman / saman123
echo - Assistant: priya / priya123
echo.
echo Press any key to continue...
pause >nul