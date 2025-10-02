#!/bin/bash

# KandyPack Application Stop Script for Ubuntu/Linux
# Usage: ./stop-kandypack-ubuntu.sh

echo "=========================================="
echo "Stopping KandyPack Application"
echo "=========================================="
echo

# Function to kill processes by pattern
kill_processes() {
    local pattern="$1"
    local description="$2"
    
    local pids=$(pgrep -f "$pattern")
    if [ -n "$pids" ]; then
        echo "Stopping $description..."
        pkill -f "$pattern"
        sleep 2
        
        # Force kill if still running
        local remaining=$(pgrep -f "$pattern")
        if [ -n "$remaining" ]; then
            echo "Force killing $description..."
            pkill -9 -f "$pattern"
        fi
        echo "$description stopped"
    else
        echo "No $description processes found"
    fi
}

# Stop backend
kill_processes "node.*server.js" "backend server"

# Stop frontend
kill_processes "npm.*start" "frontend application"

# Also try to stop any remaining node processes from this project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
kill_processes "$SCRIPT_DIR" "KandyPack processes"

echo
echo "All KandyPack processes have been stopped."
echo "You may also want to check for any remaining processes:"
echo "ps aux | grep -E '(node|npm)' | grep kandypack"