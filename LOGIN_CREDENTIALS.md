# KandyPack Login Credentials

## 🔐 Demo Login Credentials

Use these credentials to test the application:

### 👨‍💼 Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Name:** Admin User
- **Access:** Full admin dashboard with product management, order management, customer communication

### 👤 Customer Account
- **Username:** `customer`
- **Password:** `customer123`
- **Name:** John Doe
- **Access:** Customer dashboard with order tracking, profile management

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