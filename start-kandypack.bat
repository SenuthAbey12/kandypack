@echo off
echo Starting KandyPack Application...
echo.

REM Stop any existing processes on ports 3000 and 5000
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (
    if not "%%a"=="0" (
        echo Stopping process %%a on port 5000
        taskkill /f /pid %%a >nul 2>&1
    )
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    if not "%%a"=="0" (
        echo Stopping process %%a on port 3000
        taskkill /f /pid %%a >nul 2>&1
    )
)

REM Check MySQL service
echo Checking MySQL service...
sc query MySQL93 | findstr "RUNNING" >nul
if %errorlevel% neq 0 (
    echo Starting MySQL service...
    net start MySQL93
) else (
    echo MySQL service is already running
)

echo.
echo Starting Backend Server...
cd /d "%~dp0backend"
start "KandyPack Backend" cmd /k "echo Backend Server Starting... && node server.js"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Application...
cd /d "%~dp0"
start "KandyPack Frontend" cmd /k "echo Frontend Starting... && npm start"

echo.
echo =========================================
echo KandyPack is starting up!
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Login credentials:
echo Admin: admin / admin123
echo Customer: john / john123
echo Driver: saman / saman123
echo Assistant: priya / priya123
echo =========================================
echo.
pause