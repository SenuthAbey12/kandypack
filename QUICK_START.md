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
| Role | Username | Password | Notes |
|------|----------|----------|-------|
| **Admin** | admin | admin123 | Employee Portal ✅ |
| **Customer** | john | john123 | Customer Portal ✅ |
| **Driver** | saman | saman123 | Employee Portal ✅ |
| **Assistant** | priya | priya123 | Employee Portal ✅ |

### Additional Test Accounts
| Role | Username | Password | Name |
|------|----------|----------|------|
| Customer | jane | jane123 | Jane Smith |
| Customer | bob | bob123 | Bob Wilson |
| Customer | alice | alice123 | Alice Brown |
| Driver | kamal | kamal123 | Kamal Silva |
| Driver | nimal | nimal123 | Nimal Fernando |
| Driver | sunil | sunil123 | Sunil Rathnayake |
| Assistant | chamara | chamara123 | Chamara Wijesekara |
| Assistant | sanduni | sanduni123 | Sanduni Mendis |
| Assistant | thilaka | thilaka123 | Thilaka Kumari |

## Features Available
- 🛍️ Product browsing and ordering
- 👤 User authentication (multiple roles)
- 📊 Admin dashboard (admin/admin123)
- 👨‍💼 Customer portal (john/john123)
- 🚚 Driver portal (saman/saman123)
- 👨‍🔧 Assistant portal (priya/priya123)
- 💳 Order management

## Portal Access
- **Customer Portal**: `/customer` - Product browsing, orders, profile
- **Employee Portal**: `/employee` - Admin, driver, and assistant functions
- **Auto-Redirect**: Login automatically routes to correct portal based on role

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

## 🔑 Quick Test Logins
- **Customer**: `john` / `john123`
- **Admin**: `admin` / `admin123`  
- **Driver**: `saman` / `saman123`
- **Assistant**: `priya` / `priya123`

**Note**: Use usernames (not emails) for login. All credentials verified working!