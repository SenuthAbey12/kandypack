# KandyPack Login Credentials

## 🔐 Demo Login Credentials

Use these credentials to test the application:

### 👨‍💼 Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Name:** Admin User
- **Access:** Full admin dashboard with product management, order management, customer communication

### 👤 Customer Accounts
- **Username:** `john` | **Password:** `john123` | **Name:** John Doe | **ID:** CUST001
- **Username:** `jane` | **Password:** `jane123` | **Name:** Jane Smith | **ID:** CUST002
- **Username:** `bob` | **Password:** `bob123` | **Name:** Bob Wilson | **ID:** CUST003
- **Username:** `alice` | **Password:** `alice123` | **Name:** Alice Brown | **ID:** CUST004

### 🚛 Driver Accounts (Employee Portal)
- **Username:** `saman` | **Password:** `saman123` | **Name:** Saman Perera | **ID:** DRV001
- **Username:** `kamal` | **Password:** `kamal123` | **Name:** Kamal Silva | **ID:** DRV002
- **Username:** `nimal` | **Password:** `nimal123` | **Name:** Nimal Fernando | **ID:** DRV003
- **Username:** `sunil` | **Password:** `sunil123` | **Name:** Sunil Rathnayake | **ID:** DRV004

### 👨‍🔧 Assistant Accounts (Employee Portal)
- **Username:** `priya` | **Password:** `priya123` | **Name:** Priya Jayasinghe | **ID:** AST001
- **Username:** `chamara` | **Password:** `chamara123` | **Name:** Chamara Wijesekara | **ID:** AST002
- **Username:** `sanduni` | **Password:** `sanduni123` | **Name:** Sanduni Mendis | **ID:** AST003
- **Username:** `thilaka` | **Password:** `thilaka123` | **Name:** Thilaka Kumari | **ID:** AST004


## 📋 Registered Customers

### Direct Test User
- **Username:** `testdirect`
- **Password:** `testpass123`
- **Customer ID:** `TEST123`
- **Registration Date:** 9/20/2025


### Final Test User
- **Username:** `finaltest`
- **Password:** `finalpass123`
- **Customer ID:** `CUST_FINAL_TEST`
- **Registration Date:** 9/20/2025

## 🚀 How to Login

1. Go to the Home page
2. Click on "Sign In"
3. Choose either "Admin Login" or "Customer Login"
4. Enter the appropriate credentials above
5. You'll be redirected to the role-specific dashboard

## 📱 Features by Role

### Admin Dashboard Features:
- Product Management (Add, Edit, Delete products)
- Order Management (View all customer orders)
- Customer Management (View customer details)
- System Analytics
- Messaging with customers
- Notifications management

### Customer Dashboard Features:
- Order History & Tracking
- Profile Management
- Cart & Checkout access
- Message center with admin
- Order notifications

## 🛒 Testing the Full Flow

1. **Browse Products:** Go to Products page (no login required)
2. **Add to Cart:** Select products and add them to cart
3. **Checkout:** When you try to checkout, you'll be prompted to login
4. **Login:** Use the customer credentials above
5. **Complete Order:** Place your order and see it in the dashboard
6. **Admin View:** Login as admin to see the order from admin perspective

## 🔧 Development Notes

- Credentials are stored in `src/context/AuthContext.js`
- Authentication state persists in localStorage
- Role-based routing implemented in App.js
- Protected routes require authentication

Enjoy testing your KandyPack application! 🎉