#!/bin/bash

# KandyPack Application Startup Script for Ubuntu/Linux
# Usage: ./start-kandypack-ubuntu.sh

set -e  # Exit on any error

echo "=========================================="
echo "Starting KandyPack Application"
echo "=========================================="
echo

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a service is running
is_service_running() {
    systemctl is-active --quiet "$1"
}

# Function to kill existing Node.js processes
cleanup_processes() {
    echo "Cleaning up existing Node.js processes..."
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "npm.*start" 2>/dev/null || true
    sleep 2
}

# Check dependencies
echo "Checking dependencies..."

if ! command_exists node; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    echo "Run: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
    echo "Then: sudo apt-get install -y nodejs"
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists mysql; then
    echo "Warning: MySQL client not found. Make sure MySQL server is running."
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo

# Check and start MySQL service
echo "Checking MySQL service..."
if systemctl list-units --type=service | grep -q mysql; then
    if is_service_running mysql; then
        echo "MySQL service is running"
    else
        echo "Starting MySQL service..."
        sudo systemctl start mysql
        echo "MySQL service started"
    fi
elif systemctl list-units --type=service | grep -q mariadb; then
    if is_service_running mariadb; then
        echo "MariaDB service is running"
    else
        echo "Starting MariaDB service..."
        sudo systemctl start mariadb
        echo "MariaDB service started"
    fi
else
    echo "Warning: No MySQL/MariaDB service found. Please ensure database is running."
fi

# Cleanup existing processes
cleanup_processes

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: Backend directory not found at $BACKEND_DIR"
    exit 1
fi

if [ ! -f "$BACKEND_DIR/package.json" ]; then
    echo "Error: Backend package.json not found"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/package.json" ]; then
    echo "Error: Frontend package.json not found"
    exit 1
fi

# Install dependencies if needed
echo "Checking backend dependencies..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo "Checking frontend dependencies..."
cd "$SCRIPT_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo
echo "Starting Backend Server..."
cd "$BACKEND_DIR"

# Start backend in background with logging
nohup node server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 5

# Check if backend is still running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Error: Backend failed to start. Check backend.log for details."
    cat ../backend.log
    exit 1
fi

echo "Starting Frontend Application..."
cd "$SCRIPT_DIR"

# Start frontend in background
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Wait a bit for frontend to start
sleep 3

echo
echo "=========================================="
echo "KandyPack is starting up!"
echo
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo
echo "Login credentials:"
echo "- Admin: admin / admin123"
echo "- Customer: john / john123"
echo "- Driver: saman / saman123"
echo "- Assistant: priya / priya123"
echo "=========================================="
echo
echo "Process IDs:"
echo "- Backend PID: $BACKEND_PID"
echo "- Frontend PID: $FRONTEND_PID"
echo
echo "To stop the application:"
echo "- Kill backend: kill $BACKEND_PID"
echo "- Kill frontend: kill $FRONTEND_PID"
echo "- Or use: pkill -f 'node.*server.js' && pkill -f 'npm.*start'"
echo
echo "Logs:"
echo "- Backend: $SCRIPT_DIR/backend.log"
echo "- Frontend: $SCRIPT_DIR/frontend.log"
echo "- View logs: tail -f backend.log frontend.log"
echo
echo "Press Ctrl+C to stop monitoring (applications will continue running)"

# Monitor processes
while kill -0 $BACKEND_PID 2>/dev/null && kill -0 $FRONTEND_PID 2>/dev/null; do
    sleep 5
done

echo "One or more processes have stopped. Check the logs for details."