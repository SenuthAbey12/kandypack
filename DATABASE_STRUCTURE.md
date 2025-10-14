# 📊 KandyPack Database Documentation

*Last Updated: 10/14/2025, 12:05:02 PM*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** 15  
**Database Engine:** MySQL  

## 📋 Table Summary

- **admin**: 2 records
- **assistant**: 4 records
- **assistants**: 3 records
- **customer**: 7 records
- **driver**: 4 records
- **driver_assignments**: 0 records
- **driver_requests**: 0 records
- **drivers**: 3 records
- **inventory_items**: 0 records
- **order_item**: 0 records
- **orders**: 0 records
- **product**: 5 records
- **support_tickets**: 0 records
- **train_shipments**: 0 records
- **truck_deliveries**: 0 records

## 📊 Detailed Table Information

### 🏷️ admin

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| admin_id | varchar(8) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| password | varchar(255) | NO |  | NULL |  |

#### 📄 Sample Data

| admin_id | name | password |
|---|---|---|
| ADM001 | System Administrator | $2a$10$f/cYEXjz.SqTJxbyzcvy... |
| admin | Administrator | $2a$10$WN2439lvrlsMMIUsW8uE... |

---

### 🏷️ assistant

**Records:** 4

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| assistant_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| phone_no | varchar(15) | YES |  | NULL |  |
| address | varchar(200) | YES |  | NULL |  |
| user_name | varchar(50) | NO | UNI | NULL |  |
| password | varchar(255) | NO |  | NULL |  |
| department | varchar(50) | YES |  | NULL |  |
| shift_schedule | varchar(100) | YES |  | NULL |  |
| hire_date | date | YES |  | NULL |  |
| status | enum('active','inactive') | YES |  | active |  |

#### 📄 Sample Data

| assistant_id | name | phone_no | address | user_name | password | department | shift_schedule | hire_date | status |
|---|---|---|---|---|---|---|---|---|---|
| AST001 | Priya Jayasinghe | +94721234567 | 90 Park Road, Colombo | priya | $2a$10$ZwDPIdB00P3g/R5Yru3.... | Customer Service | Day Shift (8AM-5PM) | Sat Jan 20 2024 00:00:00 GMT+0530 (India Standard Time) | active |
| AST002 | Chamara Wijesekara | +94722345678 | 12 School Lane, Kandy | chamara | $2a$10$h0ccCAerilRuk2jumDZB... | Logistics | Evening Shift (2PM-11PM) | Thu Feb 15 2024 00:00:00 GMT+0530 (India Standard Time) | active |
| AST003 | Sanduni Mendis | +94723456789 | 34 Church Street, Galle | sanduni | $2a$10$YNbJcDw5we1blGXLYOXM... | Inventory | Day Shift (8AM-5PM) | Tue Mar 05 2024 00:00:00 GMT+0530 (India Standard Time) | active |

---

### 🏷️ assistants

**Records:** 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| assistant_id | varchar(8) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| email | varchar(100) | NO | UNI | NULL |  |
| phone | varchar(15) | YES |  | NULL |  |
| password | varchar(255) | NO |  | NULL |  |
| department | enum('logistics','customer_service','inventory','maintenance') | YES |  | logistics |  |
| shift_schedule | varchar(50) | YES |  | NULL |  |
| status | enum('active','inactive','on_break') | YES |  | active |  |
| hire_date | date | NO |  | NULL |  |
| performance_rating | decimal(2,1) | YES |  | 5.0 |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

#### 📄 Sample Data

| assistant_id | name | email | phone | password | department | shift_schedule | status | hire_date | performance_rating | created_at | updated_at |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AST001 | Sarah Support | sarah.support@kandypack.com | +94774567890 | $2a$10$92IXUNpkjO0rOQ5byMi.... | customer_service | Day Shift (8AM-5PM) | active | Sat Jan 20 2024 00:00:00 GMT+0530 (India Standard Time) | 5.0 | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) |
| AST002 | David Logistics | david.logistics@kandypack.com | +94775678901 | $2a$10$92IXUNpkjO0rOQ5byMi.... | logistics | Evening Shift (2PM-11PM) | active | Thu Feb 15 2024 00:00:00 GMT+0530 (India Standard Time) | 5.0 | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) |
| AST003 | Lisa Inventory | lisa.inventory@kandypack.com | +94776789012 | $2a$10$92IXUNpkjO0rOQ5byMi.... | inventory | Day Shift (8AM-5PM) | active | Tue Mar 05 2024 00:00:00 GMT+0530 (India Standard Time) | 5.0 | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) |

---

### 🏷️ customer

**Records:** 7

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
| CUS001 | John Doe | +94771234567 | Colombo | 123 Galle Road, Colombo 03 | john | $2a$10$GDfD4ty0/PI6bOXZEBJF... |
| CUS002 | Jane Smith | +94772345678 | Kandy | 456 Peradeniya Road, Kandy | jane | $2a$10$wTtGQeiM2SbCvjBjrg/s... |
| CUS003 | Bob Wilson | +94773456789 | Galle | 789 Main Street, Galle | bob | $2a$10$r5Ll57mRWa0FEqKIzv42... |

---

### 🏷️ driver

**Records:** 4

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| driver_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| phone_no | varchar(15) | YES |  | NULL |  |
| address | varchar(200) | YES |  | NULL |  |
| user_name | varchar(50) | NO | UNI | NULL |  |
| password | varchar(255) | NO |  | NULL |  |
| license_number | varchar(50) | YES |  | NULL |  |
| vehicle_assigned | varchar(50) | YES |  | NULL |  |
| hire_date | date | YES |  | NULL |  |
| status | enum('active','inactive') | YES |  | active |  |

#### 📄 Sample Data

| driver_id | name | phone_no | address | user_name | password | license_number | vehicle_assigned | hire_date | status |
|---|---|---|---|---|---|---|---|---|---|
| DRV001 | Saman Perera | +94711234567 | 12 Temple Road, Colombo | saman | $2a$10$lWYBVtSTsVuMwkK8jSQe... | DL001234 | VAN-001 | Mon Jan 15 2024 00:00:00 GMT+0530 (India Standard Time) | active |
| DRV002 | Kamal Silva | +94712345678 | 34 Lake Road, Kandy | kamal | $2a$10$j5.gwbYlOF5CLxle1w5v... | DL002345 | TRUCK-001 | Tue Feb 20 2024 00:00:00 GMT+0530 (India Standard Time) | active |
| DRV003 | Nimal Fernando | +94713456789 | 56 Sea View, Galle | nimal | $2a$10$6VfgX2M40xgC95itfGas... | DL003456 | VAN-002 | Sun Mar 10 2024 00:00:00 GMT+0530 (India Standard Time) | active |

---

### 🏷️ driver_assignments

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| assignment_id | varchar(10) | NO | PRI | NULL |  |
| driver_id | varchar(8) | YES | MUL | NULL |  |
| order_id | varchar(8) | YES | MUL | NULL |  |
| assignment_date | date | NO |  | NULL |  |
| status | enum('pending','in_progress','completed','cancelled') | YES |  | pending |  |
| estimated_delivery_time | datetime | YES |  | NULL |  |
| actual_delivery_time | datetime | YES |  | NULL |  |
| route_details | text | YES |  | NULL |  |
| special_instructions | text | YES |  | NULL |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

#### 📄 Sample Data

*No data available*

---

### 🏷️ driver_requests

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| request_id | varchar(10) | NO | PRI | NULL |  |
| driver_id | varchar(8) | YES | MUL | NULL |  |
| assistant_id | varchar(8) | YES | MUL | NULL |  |
| request_type | enum('route_change','vehicle_issue','schedule_change','emergency','break_request') | NO |  | NULL |  |
| description | text | NO |  | NULL |  |
| status | enum('pending','approved','denied','resolved') | YES |  | pending |  |
| priority | enum('low','medium','high','urgent') | YES |  | medium |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| resolved_at | datetime | YES |  | NULL |  |
| resolution_notes | text | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ drivers

**Records:** 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| driver_id | varchar(8) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| email | varchar(100) | NO | UNI | NULL |  |
| phone | varchar(15) | YES |  | NULL |  |
| password | varchar(255) | NO |  | NULL |  |
| license_number | varchar(50) | NO | UNI | NULL |  |
| vehicle_assigned | varchar(50) | YES |  | NULL |  |
| status | enum('active','inactive','on_break') | YES |  | active |  |
| hire_date | date | NO |  | NULL |  |
| performance_rating | decimal(2,1) | YES |  | 5.0 |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

#### 📄 Sample Data

| driver_id | name | email | phone | password | license_number | vehicle_assigned | status | hire_date | performance_rating | created_at | updated_at |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DRV001 | John Driver | john.driver@kandypack.com | +94771234567 | $2a$10$92IXUNpkjO0rOQ5byMi.... | DL123456789 | VAN-001 | active | Mon Jan 15 2024 00:00:00 GMT+0530 (India Standard Time) | 5.0 | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) |
| DRV002 | Jane Transport | jane.transport@kandypack.com | +94772345678 | $2a$10$92IXUNpkjO0rOQ5byMi.... | DL987654321 | TRUCK-002 | active | Tue Feb 20 2024 00:00:00 GMT+0530 (India Standard Time) | 5.0 | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) |
| DRV003 | Mike Delivery | mike.delivery@kandypack.com | +94773456789 | $2a$10$92IXUNpkjO0rOQ5byMi.... | DL456789123 | VAN-003 | active | Sun Mar 10 2024 00:00:00 GMT+0530 (India Standard Time) | 5.0 | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) | Mon Sep 22 2025 17:06:16 GMT+0530 (India Standard Time) |

---

### 🏷️ inventory_items

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| item_id | varchar(10) | NO | PRI | NULL |  |
| item_name | varchar(150) | NO |  | NULL |  |
| category | enum('packaging','supplies','equipment','safety') | YES |  | packaging |  |
| current_stock | int | YES |  | 0 |  |
| minimum_stock | int | YES |  | 10 |  |
| unit_price | decimal(10,2) | YES |  | NULL |  |
| supplier | varchar(100) | YES |  | NULL |  |
| last_restocked | date | YES |  | NULL |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

#### 📄 Sample Data

*No data available*

---

### 🏷️ order_item

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_item_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | YES | MUL | NULL |  |
| product_id | varchar(40) | YES | MUL | NULL |  |
| quantity | int | NO |  | NULL |  |
| price | decimal(10,2) | NO |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ orders

**Records:** 0

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

*No data available*

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
| PROD_001 | Electronics Item | High-quality electronics | 299.99 | 2.50 | 0.02 | Electronics | 50 |
| PROD_002 | Fashion Item | Trendy fashion accessories | 79.99 | 0.50 | 0.05 | Fashion | 100 |
| PROD_003 | Home & Garden Item | Essential home goods | 149.99 | 5.00 | 0.10 | Home & Garden | 25 |

---

### 🏷️ support_tickets

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| ticket_id | varchar(10) | NO | PRI | NULL |  |
| customer_id | varchar(8) | YES | MUL | NULL |  |
| assistant_id | varchar(8) | YES | MUL | NULL |  |
| driver_id | varchar(8) | YES | MUL | NULL |  |
| title | varchar(200) | NO |  | NULL |  |
| description | text | NO |  | NULL |  |
| priority | enum('low','medium','high','urgent') | YES |  | medium |  |
| status | enum('open','in_progress','resolved','closed') | YES |  | open |  |
| category | enum('delivery','billing','technical','general') | YES |  | general |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| resolved_at | datetime | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ train_shipments

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| shipment_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | YES | MUL | NULL |  |
| train_id | varchar(20) | YES |  | NULL |  |
| departure_date | date | YES |  | NULL |  |
| arrival_date | date | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ truck_deliveries

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| delivery_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | YES | MUL | NULL |  |
| truck_id | varchar(20) | YES |  | NULL |  |
| delivery_date | date | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

## 📝 Usage Notes

### 🔐 Authentication Tables
- **admin**: Stores administrator accounts with hashed passwords
- **customer**: Stores customer accounts with profile information

### 🛍️ Product Management
- **product**: Catalog of available products with pricing and inventory

### 📦 Order System
- **orders**: Main order records with customer and delivery information
- **order_item**: Individual items within each order

### 🔧 Data Integrity
- Foreign key constraints ensure referential integrity
- Consider proper cascade handling for deletions

---

*This documentation is automatically generated and updated when database changes occur.*
