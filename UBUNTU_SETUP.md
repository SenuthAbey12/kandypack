# KandyPack Ubuntu Setup Instructions

This document provides instructions for running KandyPack on Ubuntu/Linux systems.

## Prerequisites

### 1. Install Node.js and npm
```bash
# Install Node.js LTS version
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install MySQL
```bash
# Install MySQL Server
sudo apt update
sudo apt install mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 3. Configure MySQL Database
```bash
# Login to MySQL as root
sudo mysql -u root -p

# Create database and user (optional - adjust credentials as needed)
CREATE DATABASE kandypack;
CREATE USER 'kandypack_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON kandypack.* TO 'kandypack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Setup Instructions

### 1. Clone/Download the Project
```bash
# If using git
git clone <repository-url>
cd kandypack

# Or extract from archive
cd /path/to/kandypack
```

### 2. Configure Environment Variables
```bash
# Backend environment setup
cd backend
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

Example `.env` configuration:
```
DB_HOST=localhost
DB_USER=kandypack_user
DB_PASSWORD=your_password
DB_NAME=kandypack
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

### 3. Make Scripts Executable
```bash
chmod +x start-kandypack-ubuntu.sh
chmod +x stop-kandypack-ubuntu.sh
```

### 4. Initialize Database (if needed)
```bash
# Run database setup
cd backend
npm run setup-db

# Or manually import the schema
mysql -u kandypack_user -p kandypack < database/merged_portal_schema.sql
```

## Running the Application

### Start KandyPack
```bash
./start-kandypack-ubuntu.sh
```

This script will:
- Check and install dependencies
- Start MySQL service if needed
- Start the backend server (Node.js)
- Start the frontend application (React)
- Display access URLs and credentials

### Stop KandyPack
```bash
./stop-kandypack-ubuntu.sh
```

### Manual Start (Alternative)
```bash
# Terminal 1 - Backend
cd backend
npm install
node server.js

# Terminal 2 - Frontend
npm install
npm start
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Default Login Credentials

- **Admin**: admin / admin123
- **Customer**: john / john123
- **Driver**: saman / saman123
- **Assistant**: priya / priya123

## Troubleshooting

### Check Logs
```bash
# View application logs
tail -f backend.log frontend.log

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Common Issues

1. **MySQL Connection Error**
   ```bash
   # Check MySQL status
   sudo systemctl status mysql
   
   # Restart MySQL
   sudo systemctl restart mysql
   ```

2. **Port Already in Use**
   ```bash
   # Find processes using ports 3000 or 5000
   sudo lsof -i :3000
   sudo lsof -i :5000
   
   # Kill specific process
   kill -9 <PID>
   ```

3. **Permission Errors**
   ```bash
   # Fix script permissions
   chmod +x *.sh
   
   # Fix node_modules permissions
   sudo chown -R $USER:$USER node_modules/
   ```

4. **Dependencies Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Remove and reinstall node_modules
   rm -rf node_modules package-lock.json
   npm install
   ```

### Process Management

```bash
# Check running processes
ps aux | grep -E "(node|npm)" | grep kandypack

# Kill all KandyPack processes
pkill -f "kandypack"

# Monitor system resources
htop
```

## System Service (Optional)

To run KandyPack as a system service, create systemd service files:

```bash
# Create service file
sudo nano /etc/systemd/system/kandypack.service
```

Example service configuration:
```ini
[Unit]
Description=KandyPack Application
After=mysql.service

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/kandypack
ExecStart=/path/to/kandypack/start-kandypack-ubuntu.sh
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable kandypack
sudo systemctl start kandypack
```

## Development Mode

For development with auto-reload:

```bash
# Backend with nodemon
cd backend
npm install -g nodemon
nodemon server.js

# Frontend (already has hot reload)
npm start
```