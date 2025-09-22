@echo off@echo off@echo off@echo off@echo off@echo off@echo off@echo off

title KandyPack Application Startup

title KandyPack Startup

echo ==========================================

echo  Starting KandyPack Applicationecho Starting KandyPack Application...

echo ==========================================

echo.echo ==========================================



echo [1/4] Cleaning up existing processes...echo Starting KandyPack Applicationpowershell.exe -ExecutionPolicy Bypass -File "%~dp0start-kandypack.ps1"

taskkill /F /IM node.exe >nul 2>&1

echo    Done.echo ==========================================

echo.

echo.echo Starting Backend Server...

echo [2/4] Checking MySQL service...

sc query "MySQL93" | find "RUNNING" >nul

if %errorlevel% == 0 (

    echo    MySQL service is already running.echo [1/2] Starting Backend Server...start cmd /k "cd /d %~dp0backend && node server.js"pausetitle KandyPack Startup

) else (

    echo    Attempting to start MySQL service...start "KandyPack Backend" cmd /k "title KandyPack Backend && cd /d %~dp0 && .\start-backend-simple.bat"

    net start "MySQL93"

)

echo.

echo Waiting 3 seconds for backend to initialize...

echo [3/4] Starting Backend Server...

cd /d "%~dp0backend"timeout /t 3 /nobreak >nulecho Waiting 3 seconds...echo Starting KandyPack Application...

start "KandyPack Backend" cmd /c "title KandyPack Backend && node server.js && pause"

echo    Backend is starting in a new window.

echo.

echo [2/2] Starting Frontend Application...timeout /t 3 /nobreak >nul

echo [4/4] Starting Frontend Application...

cd /d "%~dp0"start "KandyPack Frontend" cmd /k "title KandyPack Frontend && cd /d %~dp0 && npm start"

start "KandyPack Frontend" cmd /c "title KandyPack Frontend && npm start"

echo    Frontend is starting in a new window.echo Starting KandyPack Application...

echo.

echo.

echo ==========================================

echo  KandyPack is starting up!echo ==========================================echo Starting Frontend Application...

echo ==========================================

echo.echo KandyPack is starting up!

echo    Frontend will be available at: http://localhost:3000

echo    Backend API is running at:   http://localhost:5000echo.start cmd /k "cd /d %~dp0 && npm start"echo.echo.echo Starting KandyPack Application...echo Starting KandyPack Application...

echo.

echo    Login credentials:echo Frontend: http://localhost:3000

echo    - Admin:     admin / admin123

echo    - Customer:  john / john123echo Backend API: http://localhost:5000

echo    - Driver:    saman / saman123

echo    - Assistant: priya / priya123echo.

echo.

echo ==========================================echo Login credentials:echo.

echo.

echo Press any key to close this window...echo - Admin: admin / admin123

pause >nul
echo - Customer: john / john123echo Both applications are starting in separate windows.

echo - Driver: saman / saman123

echo - Assistant: priya / priya123echo Frontend: http://localhost:3000echo Cleaning up existing processes...

echo ==========================================

echo.echo Backend: http://localhost:5000

echo Both applications are starting in separate windows.

echo You can close this window once they are running.echo.taskkill /F /IM node.exe >nul 2>&1

echo.

pausepause
REM Cleanup existing processesecho.echo.

echo Checking MySQL service...

sc query MySQL93 | find "RUNNING" >nulecho Cleaning up existing processes...

if %errorlevel% == 0 (

    echo MySQL service is runningtaskkill /F /IM node.exe >nul 2>&1

) else (

    echo Starting MySQL service...

    net start MySQL93

)REM Check MySQL serviceREM Cleanup existing processesREM Stop any existing processes on ports 3000 and 5000



echo.echo Checking MySQL service...

echo Starting Backend Server...

cd /d "%~dp0backend"sc query MySQL93 | find "RUNNING" >nulecho Cleaning up existing processes...echo Cleaning up existing processes...

start "KandyPack Backend" cmd /c "echo Starting backend... && node server.js && pause"

if %errorlevel% == 0 (

echo Waiting 5 seconds for backend to start...

timeout /t 5 /nobreak >nul    echo MySQL service is runningtaskkill /F /IM node.exe >nul 2>&1for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (



echo Starting Frontend Application...) else (

cd /d "%~dp0"

start "KandyPack Frontend" cmd /c "echo Starting frontend... && npm start && pause"    echo Starting MySQL service...taskkill /F /IM "Code.exe" >nul 2>&1    if not "%%a"=="0" (



echo.    net start MySQL93

echo ==========================================

echo KandyPack is starting up!    if %errorlevel% == 0 (        echo Stopping process %%a on port 5000

echo.

echo Frontend: http://localhost:3000        echo MySQL service started

echo Backend API: http://localhost:5000

echo.    ) else (REM Check MySQL service        taskkill /f /pid %%a >nul 2>&1

echo Login credentials:

echo - Admin: admin / admin123        echo Failed to start MySQL service

echo - Customer: john / john123

echo - Driver: saman / saman123        echo Please start MySQL service manuallyecho Checking MySQL service...    )

echo - Assistant: priya / priya123

echo ==========================================    )

echo.

)sc query MySQL93 | find "RUNNING" >nul)

echo Both applications are starting in separate windows.

echo You can close this window once they are running.

echo.

pauseecho.if %errorlevel% == 0 (

echo Starting Backend Server...

cd /d "%~dp0backend"    echo ✓ MySQL service is runningfor /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (

start "KandyPack Backend" cmd /c "node server.js"

) else (    if not "%%a"=="0" (

echo Waiting for backend to initialize...

timeout /t 5 /nobreak >nul    echo Starting MySQL service...        echo Stopping process %%a on port 3000



echo Starting Frontend Application...    net start MySQL93        taskkill /f /pid %%a >nul 2>&1

cd /d "%~dp0"

start "KandyPack Frontend" cmd /c "npm start"    if %errorlevel% == 0 (    )



echo.        echo ✓ MySQL service started)

echo =========================================

echo KandyPack is starting up!    ) else (

echo.

echo Frontend: http://localhost:3000        echo ✗ Failed to start MySQL serviceREM Check MySQL service

echo Backend API: http://localhost:5000

echo.        echo Please start MySQL service manuallyecho Checking MySQL service...

echo Login credentials:

echo Admin: admin / admin123    )sc query MySQL93 | findstr "RUNNING" >nul

echo Customer: john / john123

echo Driver: saman / saman123)if %errorlevel% neq 0 (

echo Assistant: priya / priya123

echo =========================================    echo Starting MySQL service...

echo.

echo.    net start MySQL93

echo Applications are starting...

echo You can close this window once both applications are running.echo Starting Backend Server...) else (

echo.

pausecd /d "%~dp0backend"    echo MySQL service is already running

start "KandyPack Backend" cmd /k "node server.js")



echo Waiting for backend to initialize...echo.

timeout /t 5 /nobreak >nulecho Starting Backend Server...

cd /d "%~dp0backend"

echo Starting Frontend Application...start "KandyPack Backend" cmd /k "echo Backend Server Starting... && node server.js"

cd /d "%~dp0"

start "KandyPack Frontend" cmd /k "npm start"REM Wait a bit for backend to start

timeout /t 3 /nobreak >nul

echo.

echo =========================================echo.

echo 🚀 KandyPack is starting up!echo Starting Frontend Application...

echo.cd /d "%~dp0"

echo Frontend: http://localhost:3000start "KandyPack Frontend" cmd /k "echo Frontend Starting... && npm start"

echo Backend API: http://localhost:5000

echo.echo.

echo Login credentials:echo =========================================

echo Admin: admin / admin123echo KandyPack is starting up!

echo Customer: john / john123echo.

echo Driver: saman / saman123echo Frontend: http://localhost:3000

echo Assistant: priya / priya123echo Backend API: http://localhost:5000

echo =========================================echo.

echo.echo Login credentials:

echo Admin: admin / admin123

echo Testing connections in 10 seconds...echo Customer: john / john123

timeout /t 10 /nobreak >nulecho Driver: saman / saman123

echo Assistant: priya / priya123

REM Test backend healthecho =========================================

curl -s http://localhost:5000/api/dashboard/stats >nul 2>&1echo.

if %errorlevel% == 0 (pause
    echo ✓ Backend health check: KandyPack API is running
) else (
    echo ✗ Backend not responding yet
)

echo.
echo Press any key to exit...
pause >nul