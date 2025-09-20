# 🚀 KandyPack - Quick Start Guide

## One-Click Startup

### **Easy Way**: Double-click `START.bat`
Simply double-click the `START.bat` file in the project folder to start everything automatically!

### **Alternative Ways**:

#### Option 1: PowerShell Script
```powershell
.\start-kandypack.ps1
```

#### Option 2: Command Line
```batch
START.bat
```

## What Gets Started
- ✅ MySQL Database (MySQL93 service)
- ✅ Backend API Server (Port 5000)
- ✅ Frontend React App (Port 3000)

## Access Your Application
- **Website**: http://localhost:3000
- **API**: http://localhost:5000

## Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Customer | john@test.com | password123 |
| Driver | driver@test.com | driver123 |
| Assistant | assistant@test.com | assistant123 |

## Features Available
- 🛍️ Product browsing and ordering
- 👤 User authentication (multiple roles)
- 📊 Admin dashboard
- 👨‍💼 Customer portal
- 🚚 Driver and assistant portals
- 💳 Order management

## Troubleshooting
If something doesn't work:
1. **Check MySQL**: Make sure MySQL93 service is running
2. **Port Issues**: The script automatically cleans up old processes
3. **Database Issues**: Run `backend\test_db.js` to verify connection
4. **Manual Start**: Use individual commands in separate terminals

## Manual Commands (if needed)
```bash
# Start MySQL (if not auto-started)
net start MySQL93

# Start Backend (in backend folder)
cd backend
node server.js

# Start Frontend (in main folder)
npm start
```

## File Structure
```
kandypack/
├── START.bat              # 🎯 ONE-CLICK STARTUP
├── start-kandypack.ps1    # PowerShell startup script
├── backend/               # API server
├── src/                   # React frontend
└── package.json           # Frontend dependencies
```

---
**Just double-click `START.bat` and you're ready to go!** 🎉