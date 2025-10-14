# 📊 KandyPack Database Documentation

*Last Updated: 10/14/2025, 10:07:10 AM*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** 18  
**Database Engine:** MySQL  

## 📋 Table Summary

- **admin**: 1 records
- **assistant**: 2 records
- **customer**: 3 records
- **driver**: 2 records
- **order_item**: 5 records
- **orders**: 4 records
- **product**: 13 records
- **store**: 4 records
- **train**: 2 records
- **train_route**: 2 records
- **train_shipment**: 0 records
- **train_trip**: 0 records
- **truck**: 2 records
- **truck_delivery**: 0 records
- **truck_route**: 3 records
- **truck_schedule**: 0 records
- **v_order_totals**: 4 records
- **v_quarterly_sales**: 0 records

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

| admin_id | name | password | created_at |
|---|---|---|---|
| ADM001 | System Administrator | admin123 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |

---

### 🏷️ assistant

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| assistant_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(120) | NO |  | NULL |  |
| address | text | YES |  | NULL |  |
| phone_no | varchar(20) | YES |  | NULL |  |
| email | varchar(120) | YES | UNI | NULL |  |

#### 📄 Sample Data

| assistant_id | name | address | phone_no | email |
|---|---|---|---|---|
| AST001 | Sarah Support | NULL | +94770000003 | NULL |
| AST002 | David Logistics | NULL | +94770000004 | NULL |

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

| customer_id | name | phone_no | city | address | user_name | password | created_at |
|---|---|---|---|---|---|---|---|
| CUS001 | John Doe | +94771234567 | Colombo | 123 Galle Rd, Colombo 03 | john | hash1 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |
| CUS002 | Jane Smith | +94772345678 | Kandy | 456 Peradeniya Rd, Kandy | jane | hash2 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |
| CUS082651 | Dinuka | 0715311839 | Ranna | No,71 | dinuka | $2a$10$sAbSHN6nRnh5S08K1GLx... | Mon Oct 13 2025 19:48:02 GMT+0530 (India Standard Time) |

---

### 🏷️ driver

**Records:** 2

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

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| train_id | varchar(40) | NO | PRI | NULL |  |
| capacity | decimal(12,4) | NO |  | NULL |  |
| notes | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| train_id | capacity | notes |
|---|---|---|
| TR100 | 200.0000 | Bulk cargo |
| TR200 | 150.0000 | Mixed cargo |

---

### 🏷️ train_route

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| route_id | varchar(40) | NO | PRI | NULL |  |
| start_city | varchar(80) | NO |  | NULL |  |
| end_city | varchar(80) | NO |  | NULL |  |
| destinations | text | YES |  | NULL |  |

#### 📄 Sample Data

| route_id | start_city | end_city | destinations |
|---|---|---|---|
| R_KAN_COL | Kandy | Colombo | Kegalle,Ragama |
| R_KAN_GAL | Kandy | Galle | Aluthgama |

---

### 🏷️ train_shipment
=======
| driver_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(120) | NO |  | NULL |  |
| address | text | YES |  | NULL |  |
| phone_no | varchar(20) | YES |  | NULL |  |
| email | varchar(120) | YES | UNI | NULL |  |

#### 📄 Sample Data

| driver_id | name | address | phone_no | email |
|---|---|---|---|---|
| DRV001 | John Driver | NULL | +94770000001 | NULL |
| DRV002 | Jane Transport | NULL | +94770000002 | NULL |

---

### 🏷️ order_item

**Records:** 5

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

**Records:** 4

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

**Records:** 13

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

### 🏷️ store

**Records:** 4

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

### 🏷️ train

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| train_id | varchar(40) | NO | PRI | NULL |  |
| capacity | decimal(12,4) | NO |  | NULL |  |
| notes | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| train_id | capacity | notes |
|---|---|---|
| TR100 | 200.0000 | Bulk cargo |
| TR200 | 150.0000 | Mixed cargo |

---

### 🏷️ train_route

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| route_id | varchar(40) | NO | PRI | NULL |  |
| start_city | varchar(80) | NO |  | NULL |  |
| end_city | varchar(80) | NO |  | NULL |  |
| destinations | text | YES |  | NULL |  |

#### 📄 Sample Data

| route_id | start_city | end_city | destinations |
|---|---|---|---|
| R_KAN_COL | Kandy | Colombo | Kegalle,Ragama |
| R_KAN_GAL | Kandy | Galle | Aluthgama |

---

### 🏷️ train_shipment

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

### 🏷️ train_trip

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
<<<<<<< HEAD
| delivery_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | YES | MUL | NULL |  |
| truck_id | varchar(20) | YES |  | NULL |  |
| delivery_date | date | YES |  | NULL |  |
=======
| trip_id | varchar(40) | NO | PRI | NULL |  |
| route_id | varchar(40) | NO | MUL | NULL |  |
| train_id | varchar(40) | NO | MUL | NULL |  |
| depart_time | datetime | NO | MUL | NULL |  |
| arrive_time | datetime | NO |  | NULL |  |
| capacity | decimal(12,4) | NO |  | NULL |  |
| capacity_used | decimal(12,4) | NO |  | 0.0000 |  |
| store_id | varchar(40) | NO | MUL | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ truck

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| truck_id | varchar(40) | NO | PRI | NULL |  |
| license_plate | varchar(40) | NO | UNI | NULL |  |
| capacity | decimal(12,4) | NO |  | NULL |  |

#### 📄 Sample Data

| truck_id | license_plate | capacity |
|---|---|---|
| TK01 | WP-1234 | 60.0000 |
| TK02 | WP-5678 | 60.0000 |

---

### 🏷️ truck_delivery

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
<<<<<<< HEAD
| quarter | varchar(9) | YES |  | NULL |  |
| total_value | decimal(64,2) | YES |  | NULL |  |
| total_space_units | decimal(64,4) | YES |  | NULL |  |
| orders | bigint | NO |  | 0 |  |
=======
| delivery_id | varchar(40) | NO | PRI | NULL |  |
| truck_schedule_id | varchar(40) | NO | MUL | NULL |  |
| order_id | varchar(40) | NO | MUL | NULL |  |
| delivered_at | datetime | YES |  | NULL |  |
>>>>>>> origin/Senuth

#### 📄 Sample Data

*No data available*

---

### 🏷️ truck_route

**Records:** 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
<<<<<<< HEAD
| truck_id | varchar(40) | NO |  | NULL |  |
| month | varchar(7) | YES |  | NULL |  |
| runs | bigint | NO |  | 0 |  |
| hours | decimal(46,4) | YES |  | NULL |  |

#### 📄 Sample Data

| truck_id | month | runs | hours |
|---|---|---|---|
| TK01 | 2025-10 | 1 | 4.0000 |

---

### 🏷️ v_worker_hours

**Records:** 2
=======
| route_id | varchar(40) | NO | PRI | NULL |  |
| store_id | varchar(40) | NO | MUL | NULL |  |
| route_name | varchar(120) | NO |  | NULL |  |
| max_minutes | int | NO |  | 240 |  |

#### 📄 Sample Data

| route_id | store_id | route_name | max_minutes |
|---|---|---|---|
| TR_COL_01 | ST_COL | Colombo City North | 240 |
| TR_COL_02 | ST_COL | Colombo City South | 240 |
| TR_GAL_01 | ST_GAL | Galle Town | 240 |

---

### 🏷️ truck_schedule

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
<<<<<<< HEAD
| role | varchar(9) | NO |  | NULL |  |
| worker_id | varchar(40) | NO |  | NULL |  |
| week | varchar(7) | YES |  | NULL |  |
| hours | decimal(46,4) | YES |  | NULL |  |

#### 📄 Sample Data

| role | worker_id | week | hours |
|---|---|---|---|
| driver | DRV001 | 2025-42 | 4.0000 |
| assistant | AST001 | 2025-42 | 4.0000 |
=======
| truck_schedule_id | varchar(40) | NO | PRI | NULL |  |
| route_id | varchar(40) | NO | MUL | NULL |  |
| truck_id | varchar(40) | NO | MUL | NULL |  |
| driver_id | varchar(40) | NO | MUL | NULL |  |
| assistant_id | varchar(40) | NO | MUL | NULL |  |
| start_time | datetime | NO | MUL | NULL |  |
| end_time | datetime | NO |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ v_order_totals

**Records:** 4

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_id | varchar(40) | NO |  | NULL |  |
| order_amount | decimal(42,2) | YES |  | NULL |  |
| required_space | decimal(42,4) | YES |  | NULL |  |

#### 📄 Sample Data

| order_id | order_amount | required_space |
|---|---|---|
| ORD_1760368488448_80ccats95 | 450.00 | 0.2000 |
| ORD_1760368923519_tkx46qchw | 450.00 | 0.2000 |
| ORD_1760369244595_dvjwujt15 | 450.00 | 0.2000 |

---

### 🏷️ v_quarterly_sales

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| quarter | varchar(8) | YES |  | NULL |  |
| total_value | decimal(64,2) | YES |  | NULL |  |
| total_space_units | decimal(64,4) | YES |  | NULL |  |
| orders | bigint | NO |  | 0 |  |
>>>>>>> 839093197224840ce584a3f62c720d350ac29475

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
