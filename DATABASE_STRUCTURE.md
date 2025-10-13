# 📊 KandyPack Database Documentation

Last Updated: 10/13/2025, 8:57:29 PM

## 🗄 Database Overview

*Database Name:* kandypack  
*Total Tables:* 18  
*Database Engine:* MySQL  

## 📋 Table Summary

- *admin*: 1 records
- *assistant*: 2 records
- *customer*: 3 records
- *driver*: 2 records
- *order_item*: 3 records
- *orders*: 3 records
- *product*: 3 records
- *store*: 4 records
- *train*: 2 records
- *train_route*: 2 records
- *train_shipment*: 0 records
- *train_trip*: 0 records
- *truck*: 2 records
- *truck_delivery*: 0 records
- *truck_route*: 3 records
- *truck_schedule*: 0 records
- *v_order_totals*: 3 records
- *v_quarterly_sales*: 0 records

## 📊 Detailed Table Information

### 🏷 admin

*Records:* 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| admin_id | varchar(20) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| password | varchar(255) | NO |  | NULL |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### 📄 Sample Data

| admin_id | name | password | created_at |
|---|---|---|---|
| ADM001 | System Administrator | admin123 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |

---

### 🏷 assistant

*Records:* 2

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

### 🏷 customer

*Records:* 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| customer_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(100) | NO |  | NULL |  |
| phone_no | varchar(20) | YES |  | NULL |  |
| city | varchar(80) | YES |  | NULL |  |
| address | varchar(255) | YES |  | NULL |  |
| user_name | varchar(50) | NO | UNI | NULL |  |
| password | varchar(255) | NO |  | NULL |  |
| created_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### 📄 Sample Data

| customer_id | name | phone_no | city | address | user_name | password | created_at |
|---|---|---|---|---|---|---|---|
| CUS001 | John Doe | +94771234567 | Colombo | 123 Galle Rd, Colombo 03 | john | hash1 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |
| CUS002 | Jane Smith | +94772345678 | Kandy | 456 Peradeniya Rd, Kandy | jane | hash2 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |
| CUS082651 | Dinuka | 0715311839 | Ranna | No,71 | dinuka | $2a$10$sAbSHN6nRnh5S08K1GLx... | Mon Oct 13 2025 19:48:02 GMT+0530 (India Standard Time) |

---

### 🏷 driver

*Records:* 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
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

### 🏷 order_item

*Records:* 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_item_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | NO | MUL | NULL |  |
| product_id | varchar(40) | NO | MUL | NULL |  |
| quantity | int | NO |  | NULL |  |
| unit_price | decimal(10,2) | NO |  | NULL |  |

#### 📄 Sample Data

| order_item_id | order_id | product_id | quantity | unit_price |
|---|---|---|---|---|
| OI_1760368488463_8edeusbko | ORD_1760368488448_80ccats95 | P002 | 1 | 450.00 |
| OI_1760368923530_i4dg2pccq | ORD_1760368923519_tkx46qchw | P002 | 1 | 450.00 |
| OI_1760369244601_evok4pqb8 | ORD_1760369244595_dvjwujt15 | P002 | 1 | 450.00 |

---

### 🏷 orders

*Records:* 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_id | varchar(40) | NO | PRI | NULL |  |
| customer_id | varchar(40) | NO | MUL | NULL |  |
| order_date | datetime | NO |  | NULL |  |
| destination_city | varchar(80) | NO | MUL | NULL |  |
| destination_address | varchar(255) | NO |  | NULL |  |
| status | enum('pending','confirmed','scheduled','in_transit','delivered','cancelled') | YES | MUL | pending |  |
| created_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

#### 📄 Sample Data

| order_id | customer_id | order_date | destination_city | destination_address | status | created_at | updated_at |
|---|---|---|---|---|---|---|---|
| ORD_1760368488448_80ccats95 | CUS082651 | Mon Oct 13 2025 20:44:48 GMT+0530 (India Standard Time) | galle | galle | pending | Mon Oct 13 2025 20:44:48 GMT+0530 (India Standard Time) | Mon Oct 13 2025 20:44:48 GMT+0530 (India Standard Time) |
| ORD_1760368923519_tkx46qchw | CUS082651 | Mon Oct 13 2025 20:52:03 GMT+0530 (India Standard Time) | Galle | Galle | pending | Mon Oct 13 2025 20:52:03 GMT+0530 (India Standard Time) | Mon Oct 13 2025 20:52:03 GMT+0530 (India Standard Time) |
| ORD_1760369244595_dvjwujt15 | CUS082651 | Mon Oct 13 2025 20:57:24 GMT+0530 (India Standard Time) | Matara | Matara Road,Matara,76543 | pending | Mon Oct 13 2025 20:57:24 GMT+0530 (India Standard Time) | Mon Oct 13 2025 20:57:24 GMT+0530 (India Standard Time) |

---

### 🏷 product

*Records:* 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| product_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(120) | NO |  | NULL |  |
| description | text | YES |  | NULL |  |
| price | decimal(10,2) | NO |  | NULL |  |
| space_consumption | decimal(10,4) | NO |  | NULL |  |
| category | varchar(60) | YES |  | NULL |  |
| available_quantity | int | NO |  | 0 |  |

#### 📄 Sample Data

| product_id | name | description | price | space_consumption | category | available_quantity |
|---|---|---|---|---|---|---|
| P001 | Detergent Box | 1kg box | 600.00 | 0.5000 | FMCG | 200 |
| P002 | Shampoo Pack | 500ml | 450.00 | 0.2000 | FMCG | 297 |
| P003 | Soap Carton | 20 bars | 1200.00 | 1.0000 | FMCG | 150 |

---

### 🏷 store

*Records:* 4

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| store_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(120) | NO |  | NULL |  |
| city | varchar(80) | NO | MUL | NULL |  |

#### 📄 Sample Data

| store_id | name | city |
|---|---|---|
| ST_COL | Colombo Central Store | Colombo |
| ST_GAL | Galle Station Store | Galle |
| ST_KAN | Kandy HQ Store | Kandy |

---

### 🏷 train

*Records:* 2

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

### 🏷 train_route

*Records:* 2

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

### 🏷 train_shipment

*Records:* 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| shipment_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | NO | MUL | NULL |  |
| trip_id | varchar(40) | NO | MUL | NULL |  |
| allocated_space | decimal(12,4) | NO |  | NULL |  |
| created_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

#### 📄 Sample Data

| route_id | start_city | end_city | destinations |
|---|---|---|---|
| R_KAN_COL | Kandy | Colombo | Kegalle,Ragama |
| R_KAN_GAL | Kandy | Galle | Aluthgama |

---

### 🏷 train_trip

*Records:* 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| trip_id | varchar(40) | NO | PRI | NULL |  |
| route_id | varchar(40) | NO | MUL | NULL |  |
| train_id | varchar(40) | NO | MUL | NULL |  |
| depart_time | datetime | NO | MUL | NULL |  |
| arrive_time | datetime | NO |  | NULL |  |
| capacity | decimal(12,4) | NO |  | NULL |  |
| capacity_used | decimal(12,4) | NO |  | 0.0000 |  |
| store_id | varchar(40) | NO | MUL | NULL |  |

#### 📄 Sample Data

No data available

---

### 🏷 truck

*Records:* 2

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

### 🏷 truck_delivery

*Records:* 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| delivery_id | varchar(40) | NO | PRI | NULL |  |
| truck_schedule_id | varchar(40) | NO | MUL | NULL |  |
| order_id | varchar(40) | NO | MUL | NULL |  |
| delivered_at | datetime | YES |  | NULL |  |

#### 📄 Sample Data

No data available

---

### 🏷 truck_route

*Records:* 3

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
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

### 🏷 truck_schedule

*Records:* 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| truck_schedule_id | varchar(40) | NO | PRI | NULL |  |
| route_id | varchar(40) | NO | MUL | NULL |  |
| truck_id | varchar(40) | NO | MUL | NULL |  |
| driver_id | varchar(40) | NO | MUL | NULL |  |
| assistant_id | varchar(40) | NO | MUL | NULL |  |
| start_time | datetime | NO | MUL | NULL |  |
| end_time | datetime | NO |  | NULL |  |

#### 📄 Sample Data

No data available

---

### 🏷 v_order_totals

*Records:* 3

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

### 🏷 v_quarterly_sales

*Records:* 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| quarter | varchar(8) | YES |  | NULL |  |
| total_value | decimal(64,2) | YES |  | NULL |  |
| total_space_units | decimal(64,4) | YES |  | NULL |  |
| orders | bigint | NO |  | 0 |  |

#### 📄 Sample Data

No data available

---

## 📝 Usage Notes

### 🔐 Authentication Tables
- *admin*: Stores administrator accounts with hashed passwords
- *customer*: Stores customer accounts with profile information

### 🛍 Product Management
- *product*: Catalog of available products with pricing and inventory

### 📦 Order System
- *orders*: Main order records with customer and delivery information
- *order_item*: Individual items within each order

### 🔧 Data Integrity
- Foreign key constraints ensure referential integrity
- Consider proper cascade handling for deletions

---

This documentation is automatically generated and updated when database changes occur.