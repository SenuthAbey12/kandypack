# KandyPack Startup Script
Write-Host "Starting KandyPack Application..." -ForegroundColor Green
Write-Host ""

# Function to stop processes on a port
function Stop-ProcessOnPort {
    param($Port)
    $processes = netstat -ano | Select-String ":$Port" | ForEach-Object {
        $parts = $_.Line -split '\s+' | Where-Object { $_ -ne '' }
        if ($parts.Length -ge 5 -and $parts[4] -ne '0') {
            $parts[4]
        }
    } | Sort-Object -Unique
    
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Stopped process $pid on port $Port" -ForegroundColor Yellow
        } catch {
            # Process might already be stopped
        }
    }
}

# Clean up existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Stop-ProcessOnPort 5000
Stop-ProcessOnPort 3000

# Check MySQL service
Write-Host "Checking MySQL service..." -ForegroundColor Cyan
$mysqlService = Get-Service -Name "MySQL93" -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -eq "Running") {
    Write-Host "✓ MySQL service is running" -ForegroundColor Green
} else {
    Write-Host "Starting MySQL service..." -ForegroundColor Yellow
    try {
        Start-Service -Name "MySQL93"
        Write-Host "✓ MySQL service started" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to start MySQL service" -ForegroundColor Red
        Write-Host "Please start MySQL service manually" -ForegroundColor Yellow
    }

Write-Host ""

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; node server.js"

# Wait for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Frontend Application
Write-Host "Starting Frontend Application..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'Frontend Starting...' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Magenta
Write-Host "🚀 KandyPack is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Yellow
Write-Host "Admin: admin@test.com / admin123" -ForegroundColor White
Write-Host "Customer: john@test.com / password123" -ForegroundColor White
Write-Host "Driver: driver@test.com / driver123" -ForegroundColor White
Write-Host "Assistant: assistant@test.com / assistant123" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Magenta
Write-Host ""

# Test connections after a delay
Write-Host "Testing connections in 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test backend health
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5
    Write-Host "✓ Backend health check: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend not responding yet" -ForegroundColor Red
}

# Test admin login
try {
    $loginData = @{
        username = "admin"
        password = "admin123"
        role = "admin"
    }
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 5
    Write-Host "✓ Admin login test: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Admin login test failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")