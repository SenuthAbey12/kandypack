# 📊 KandyPack Database Documentation

*Last Updated: 9/22/2025, 11:48:39 AM*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** 14  
**Database Engine:** MySQL  

## 📋 Table Summary

- **admin**: 1 records
- **assistant**: 4 records
- **customer**: 10 records
- **driver**: 4 records
- **inventory**: 6 records
- **inventory_turnover**: 6 records
- **order_item**: 0 records
- **orders**: 0 records
- **product**: 5 records
- **routes**: 6 records
- **train_shipments**: 0 records
- **truck**: 6 records
- **truck_deliveries**: 0 records
- **warehouses**: 4 records

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
| city | varchar(50) | YES |  | NULL |  |
| user_name | varchar(50) | NO | UNI | NULL |  |
| password | varchar(255) | NO |  | NULL |  |

#### 📄 Sample Data

| assistant_id | name | phone_no | city | user_name | password |
|---|---|---|---|---|---|
| AST001 | Priya Jayasinghe | 0779012345 | Colombo | priya | $2a$10$WHwwjJc4xmJG6Ihi72oc... |
| AST002 | Chamara Wijesekara | 0770123456 | Kandy | chamara | $2a$10$90YH8KRy/n2Sag.DDgVZ... |
| AST003 | Sanduni Mendis | 0771234568 | Galle | sanduni | $2a$10$M2ZQKu5cMll7JvC/OrDm... |

---

### 🏷️ customer

**Records:** 10

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
| CUS069492 | chalani | 0715311839 | Ranna | No,71 | chalani | $2a$10$jyxDd471l.a/bssFZ4YE... |
| CUS185077 | tharuu | 0715311839 | Ranna | No,71 | tharuu | $2a$10$/chsztdmYcMYGH/LTdDf... |
| CUS444163 | Test User | 0771234567 | Test City | Test Address | testuser | $2a$10$z.tKSWVlBE12Uc.Njfyr... |

---

### 🏷️ driver

**Records:** 4

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| driver_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| phone_no | varchar(15) | YES |  | NULL |  |
| city | varchar(50) | YES |  | NULL |  |
| user_name | varchar(50) | NO | UNI | NULL |  |
| password | varchar(255) | NO |  | NULL |  |
| status | enum('available','on-duty','en-route','offline') | YES |  | available |  |
| assigned_vehicle_id | int | YES |  | NULL |  |
| current_location | varchar(100) | YES |  | Depot |  |
| rating | decimal(3,2) | YES |  | 4.50 |  |

#### 📄 Sample Data

| driver_id | name | phone_no | city | user_name | password | status | assigned_vehicle_id | current_location | rating |
|---|---|---|---|---|---|---|---|---|---|
| DRV001 | Saman Perera | 0775678901 | Colombo | saman | $2a$10$lguTZJwPKVL9gzc5l6fL... | on-duty | 1 | Colombo 03 | 4.90 |
| DRV002 | Kamal Silva | 0776789012 | Kandy | kamal | $2a$10$Jwd3JRh1Q1SGCmSWilrI... | en-route | 2 | Kandy | 4.70 |
| DRV003 | Nimal Fernando | 0777890123 | Galle | nimal | $2a$10$UgVGn3vs.hAofJng7EyV... | available | 3 | Depot | 4.80 |

---

### 🏷️ inventory

**Records:** 6

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| item_id | int | NO | PRI | NULL | auto_increment |
| sku | varchar(50) | NO | UNI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| category | varchar(50) | YES |  | NULL |  |
| stock_level | int | YES |  | 0 |  |
| status | enum('in-stock','low-stock','out-of-stock') | YES |  | in-stock |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### 📄 Sample Data

| item_id | sku | name | category | stock_level | status | created_at |
|---|---|---|---|---|---|---|
| 1 | SKU001 | Heavy Duty Boxes | Packaging | 150 | in-stock | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 2 | SKU002 | Bubble Wrap Roll | Packaging | 45 | low-stock | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 3 | SKU003 | Electronics Crate | Containers | 75 | in-stock | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |

---

### 🏷️ inventory_turnover

**Records:** 6

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| id | int | NO | PRI | NULL | auto_increment |
| item_id | int | YES | MUL | NULL |  |
| turnover_rate | decimal(10,2) | YES |  | 0.00 |  |
| period_start | date | YES |  | NULL |  |
| period_end | date | YES |  | NULL |  |

#### 📄 Sample Data

| id | item_id | turnover_rate | period_start | period_end |
|---|---|---|---|---|
| 1 | 1 | 8.50 | Mon Jan 01 2024 00:00:00 GMT+0530 (India Standard Time) | Wed Jan 31 2024 00:00:00 GMT+0530 (India Standard Time) |
| 2 | 2 | 6.20 | Mon Jan 01 2024 00:00:00 GMT+0530 (India Standard Time) | Wed Jan 31 2024 00:00:00 GMT+0530 (India Standard Time) |
| 3 | 3 | 9.10 | Mon Jan 01 2024 00:00:00 GMT+0530 (India Standard Time) | Wed Jan 31 2024 00:00:00 GMT+0530 (India Standard Time) |

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
| image_url | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| product_id | product_name | description | price | weight_per_item | volume_per_item | category | available_quantity | image_url |
|---|---|---|---|---|---|---|---|---|
| PROD_001 | Electronics Item | High-quality electronics | 299.99 | 2.50 | 0.02 | Electronics | 50 | https://picsum.photos/seed/... |
| PROD_002 | Fashion Item | Trendy fashion accessories | 79.99 | 0.50 | 0.01 | Fashion | 100 | https://picsum.photos/seed/... |
| PROD_003 | Home & Garden Item | Essential home goods | 149.99 | 5.00 | 0.10 | Home & Garden | 25 | https://picsum.photos/seed/... |

---

### 🏷️ routes

**Records:** 6

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| route_id | int | NO | PRI | NULL | auto_increment |
| name | varchar(100) | NO |  | NULL |  |
| start_location | varchar(100) | NO |  | NULL |  |
| end_location | varchar(100) | NO |  | NULL |  |
| distance | varchar(20) | YES |  | NULL |  |
| type | enum('road','rail') | YES |  | road |  |
| status | enum('active','inactive','issue') | YES |  | active |  |
| on_time_performance | int | YES |  | 85 |  |
| cost_per_mile | decimal(10,2) | YES |  | 2.50 |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### 📄 Sample Data

| route_id | name | start_location | end_location | distance | type | status | on_time_performance | cost_per_mile | created_at |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Colombo-Kandy | Colombo | Kandy | 115 km | road | active | 94 | 2.35 | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 2 | Kandy-Galle | Kandy | Galle | 220 km | road | active | 85 | 2.45 | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 3 | Colombo-Jaffna | Colombo | Jaffna | 400 km | road | issue | 72 | 2.65 | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |

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

### 🏷️ truck

**Records:** 6

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| truck_id | int | NO | PRI | NULL | auto_increment |
| plate_no | varchar(20) | NO | UNI | NULL |  |
| type | enum('road','rail') | YES |  | road |  |
| capacity | int | YES |  | NULL |  |
| fuel_level | int | YES |  | 100 |  |
| last_maintenance | date | YES |  | NULL |  |
| status | enum('active','inactive','maintenance') | YES |  | active |  |
| speed | varchar(20) | YES |  | 0 km/h |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### 📄 Sample Data

| truck_id | plate_no | type | capacity | fuel_level | last_maintenance | status | speed | created_at |
|---|---|---|---|---|---|---|---|---|
| 1 | CAB-1234 | road | 5000 | 85 | Mon Jan 15 2024 00:00:00 GMT+0530 (India Standard Time) | active | 45 km/h | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 2 | CAC-5678 | road | 3000 | 60 | Wed Jan 10 2024 00:00:00 GMT+0530 (India Standard Time) | active | 60 km/h | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 3 | CAE-9101 | road | 7000 | 95 | Sat Jan 20 2024 00:00:00 GMT+0530 (India Standard Time) | active | 0 km/h | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |

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

### 🏷️ warehouses

**Records:** 4

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| warehouse_id | int | NO | PRI | NULL | auto_increment |
| name | varchar(100) | NO |  | NULL |  |
| location | varchar(100) | NO |  | NULL |  |
| capacity | int | NO |  | NULL |  |
| utilization | decimal(5,2) | YES |  | 0.00 |  |
| status | enum('active','inactive') | YES |  | active |  |
| created_at | timestamp | YES |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### 📄 Sample Data

| warehouse_id | name | location | capacity | utilization | status | created_at |
|---|---|---|---|---|---|---|
| 1 | Colombo Main | Colombo | 10000 | 87.50 | active | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 2 | Kandy Hub | Kandy | 7500 | 82.70 | active | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |
| 3 | Galle Depot | Galle | 5000 | 76.00 | inactive | Mon Sep 22 2025 10:00:52 GMT+0530 (India Standard Time) |

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
