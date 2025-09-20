# 📊 KandyPack Database Documentation

*Last Updated: 9/20/2025, 1:48:41 PM*
*Status: Demo Mode (MySQL Connection Error)*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** 7  
**Database Engine:** MySQL  
**Connection Status:** ❌ Disconnected (Demo Mode)

## 📋 Table Summary

- **admin**: 1 records
- **customer**: 3 records
- **product**: 5 records
- **orders**: 3 records
- **order_item**: 3 records
- **train_shipments**: 2 records
- **truck_deliveries**: 2 records

## 📊 Detailed Table Information

### 🏷️ admin

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| admin_id | varchar(8) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| password | varchar(255) | NO |  | NULL |  |

#### 📄 Sample Data

| admin_id | name | password |
|---|---|---|
| ADM001 | System Administrator | $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi |

---

### 🏷️ customer

**Records:** 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| customer_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| phone_no | varchar(15) | YES |  | NULL |  |
| city | varchar(50) | YES |  | NULL |  |
| address | varchar(200) | YES |  | NULL |  |
| user_name | varchar(50) | NO | UNI | NULL |  |
| password | varchar(255) | NO |  | NULL |  |

#### 📄 Sample Data

| customer_id | name | phone_no | city | address | user_name | password |
|---|---|---|---|---|---|---|
| CUST_001 | John Doe | +1234567890 | Colombo | 123 Main Street, Colombo 01, Western Province | johndoe | $2a$10$eImiTXuWVxfM37uY4JANjeBYpJ4iE/e1u/9jHPW.9DvqFaBH6QkMq |
| CUST_002 | Jane Smith | +1987654321 | Kandy | 456 Oak Avenue, Kandy Central, Central Province | janesmith | $2a$10$XHT2kYhzYGqZr8vL4N3Q1eUH.jKq7Y2M3F8wVvZ9cX6D5pR7qL9Nm |
| CUST_003 | Mike Johnson | +1555123456 | Galle | 789 Beach Road, Galle Fort, Southern Province | mikejohnson | $2a$10$QAZ2wsx3edC4rfv5tgB6yhN7ujM8ik9ol0pP/qW.eR2tY6u7I8o0A |

---

### 🏷️ product

**Records:** 5

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| product_id | varchar(40) | NO | PRI | NULL |  |
| product_name | varchar(100) | NO |  | NULL |  |
| description | text | YES |  | NULL |  |
| price | decimal(10,2) | NO |  | NULL |  |
| weight_per_item | decimal(8,2) | NO |  | NULL |  |
| volume_per_item | decimal(8,2) | NO |  | NULL |  |
| category | varchar(50) | YES |  | NULL |  |
| available_quantity | int | YES |  | 0 |  |

#### 📄 Sample Data

| product_id | product_name | description | price | weight_per_item | volume_per_item | category | available_quantity |
|---|---|---|---|---|---|---|---|
| PROD_001 | Premium Electronics Package | High-quality electronics including smartphones, tablets, and accessories with warranty coverage | 299.99 | 2.5 | 0.02 | Electronics | 50 |
| PROD_002 | Fashion Accessories Set | Trendy fashion accessories including jewelry, bags, and designer clothing items | 79.99 | 0.5 | 0.005 | Fashion | 100 |
| PROD_003 | Home & Garden Essentials | Essential home goods including kitchen appliances, gardening tools, and home decor items | 149.99 | 5 | 0.1 | Home & Garden | 25 |
| PROD_004 | Educational Books & Media | Comprehensive educational materials including textbooks, digital media, and learning resources | 29.99 | 0.8 | 0.003 | Books | 75 |
| PROD_005 | Professional Sports Equipment | Quality sports gear including fitness equipment, outdoor gear, and professional sporting goods | 199.99 | 3.2 | 0.05 | Sports | 30 |

---

### 🏷️ orders

**Records:** 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_id | varchar(40) | NO | PRI | NULL |  |
| customer_id | varchar(40) | YES | MUL | NULL |  |
| order_date | datetime | NO |  | NULL |  |
| destination_city | varchar(50) | YES |  | NULL |  |
| destination_address | varchar(200) | YES |  | NULL |  |
| total_weight | decimal(8,2) | YES |  | NULL |  |
| total_volume | decimal(8,2) | YES |  | NULL |  |
| order_status | enum('Pending','Confirmed','In Transit','Delivered','Cancelled') | YES |  | Pending |  |

#### 📄 Sample Data

| order_id | customer_id | order_date | destination_city | destination_address | total_weight | total_volume | order_status |
|---|---|---|---|---|---|---|---|
| ORD_001 | CUST_001 | 2025-09-20 10:30:00 | Galle | 789 Beach Road, Galle Fort, Southern Province, Sri Lanka | 3 | 0.025 | Pending |
| ORD_002 | CUST_002 | 2025-09-19 14:15:30 | Matara | 321 Temple Street, Matara Central, Southern Province, Sri Lanka | 5.5 | 0.105 | Confirmed |
| ORD_003 | CUST_003 | 2025-09-18 09:45:15 | Kandy | 654 Hill Street, Kandy Central, Central Province, Sri Lanka | 0.8 | 0.003 | In Transit |

---

### 🏷️ order_item

**Records:** 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_item_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | YES | MUL | NULL |  |
| product_id | varchar(40) | YES | MUL | NULL |  |
| quantity | int | NO |  | NULL |  |
| price | decimal(10,2) | NO |  | NULL |  |

#### 📄 Sample Data

| order_item_id | order_id | product_id | quantity | price |
|---|---|---|---|---|
| OI_001 | ORD_001 | PROD_001 | 1 | 299.99 |
| OI_002 | ORD_002 | PROD_003 | 1 | 149.99 |
| OI_003 | ORD_003 | PROD_004 | 1 | 29.99 |

---

### 🏷️ train_shipments

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|

#### 📄 Sample Data

| shipment_id | order_id | train_id | departure_date | arrival_date |
|---|---|---|---|---|
| SHIP_001 | ORD_002 | TR_001 | 2025-09-20 | 2025-09-21 |
| SHIP_002 | ORD_003 | TR_002 | 2025-09-19 | 2025-09-20 |

---

### 🏷️ truck_deliveries

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|

#### 📄 Sample Data

| delivery_id | order_id | truck_id | delivery_date |
|---|---|---|---|
| DEL_001 | ORD_001 | TRK_001 | 2025-09-21 |
| DEL_002 | ORD_003 | TRK_002 | 2025-09-20 |

---

## 📝 Usage Notes

### 🔐 Authentication Tables
- **admin**: Stores administrator accounts with hashed passwords
- **customer**: Stores customer accounts with profile information

### 🛍️ Product Management
- **product**: Catalog of available products with pricing and inventory
- Products have weight and volume for shipping calculations

### 📦 Order System
- **orders**: Main order records with customer and delivery information
- **order_item**: Individual items within each order
- Order status tracking: Pending → Confirmed → In Transit → Delivered

### 🚚 Logistics Management
- **train_shipments**: Rail transport tracking
- **truck_deliveries**: Road transport tracking

### 🔧 Data Integrity
- Foreign key constraints ensure referential integrity
- Customer deletion would affect related orders (cascade handling needed)
- Product deletion requires checking for existing order items

### 📊 Performance Considerations
- Indexes on primary keys and foreign keys
- Consider adding indexes on frequently queried columns:
  - customer.user_name (for login)
  - orders.order_status (for status filtering)
  - product.category (for product browsing)

### ⚠️ Connection Status
- **Current Status**: Demo Mode
- **Issue**: MySQL connection failed
- **Resolution**: Check MySQL service, credentials, and network connectivity
- **Action Required**: Fix database connection to enable live documentation

---

*This documentation is automatically generated and updated when database changes occur.*
*Currently running in demo mode due to database connection issues.*
