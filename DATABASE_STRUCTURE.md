# 📊 KandyPack Database Documentation

<<<<<<< HEAD
*Last Updated: 10/11/2025, 9:40:49 AM*
=======
Last Updated: 10/13/2025, 8:57:29 PM
>>>>>>> origin/Senuth

## 🗄 Database Overview

<<<<<<< HEAD
**Database Name:** kandypack  
**Total Tables:** 24  
**Database Engine:** MySQL  

## 📋 Table Summary

- **admin**: 1 records
- **assistant**: 2 records
- **customer**: 3 records
- **driver**: 2 records
- **order_item**: 2 records
- **orders**: 1 records
- **product**: 3 records
- **store**: 4 records
- **train**: 2 records
- **train_route**: 2 records
- **train_shipment**: 0 records
- **train_trip**: 3 records
- **truck**: 2 records
- **truck_delivery**: 1 records
- **truck_route**: 3 records
- **truck_schedule**: 1 records
- **v_city_route_sales**: 1 records
- **v_customer_order_history**: 1 records
- **v_order_totals**: 1 records
- **v_orders_enriched**: 1 records
- **v_quarter_top_items**: 2 records
- **v_quarterly_sales**: 0 records
- **v_truck_usage**: 1 records
- **v_worker_hours**: 2 records
=======
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
>>>>>>> origin/Senuth

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
<<<<<<< HEAD
| ADM001 | System Administrator | admin123 | Thu Oct 09 2025 00:02:10 GMT+0530 (India Standard Time) |
=======
| ADM001 | System Administrator | admin123 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |
>>>>>>> origin/Senuth

---

### 🏷 assistant

<<<<<<< HEAD
**Records:** 2
=======
*Records:* 2
>>>>>>> origin/Senuth

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| assistant_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(120) | NO |  | NULL |  |
| address | text | YES |  | NULL |  |
| phone_no | varchar(20) | YES |  | NULL |  |
| email | varchar(120) | YES | UNI | NULL |  |
<<<<<<< HEAD
| password | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| assistant_id | name | address | phone_no | email | password |
|---|---|---|---|---|---|
| AST001 | Sarah Support | NULL | +94770000003 | NULL | NULL |
| AST002 | David Logistics | NULL | +94770000004 | NULL | NULL |
=======

#### 📄 Sample Data

| assistant_id | name | address | phone_no | email |
|---|---|---|---|---|
| AST001 | Sarah Support | NULL | +94770000003 | NULL |
| AST002 | David Logistics | NULL | +94770000004 | NULL |
>>>>>>> origin/Senuth

---

### 🏷 customer

<<<<<<< HEAD
**Records:** 3
=======
*Records:* 3
>>>>>>> origin/Senuth

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
<<<<<<< HEAD
| CUS001 | John Doe | +94771234567 | Colombo | 123 Galle Rd, Colombo 03 | john | hash1 | Thu Oct 09 2025 00:02:10 GMT+0530 (India Standard Time) |
| CUS002 | Jane Smith | +94772345678 | Kandy | 456 Peradeniya Rd, Kandy | jane | hash2 | Thu Oct 09 2025 00:02:10 GMT+0530 (India Standard Time) |
| CUS843999 | Abdul Rafi | 0726490432 | Matara | 83,edjhbdhbch,matara | RafiMAA | $2a$10$ezJk4UUCpq3dsXMbXH0s... | Sat Oct 11 2025 09:40:44 GMT+0530 (India Standard Time) |
=======
| CUS001 | John Doe | +94771234567 | Colombo | 123 Galle Rd, Colombo 03 | john | hash1 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |
| CUS002 | Jane Smith | +94772345678 | Kandy | 456 Peradeniya Rd, Kandy | jane | hash2 | Thu Oct 02 2025 13:50:29 GMT+0530 (India Standard Time) |
| CUS082651 | Dinuka | 0715311839 | Ranna | No,71 | dinuka | $2a$10$sAbSHN6nRnh5S08K1GLx... | Mon Oct 13 2025 19:48:02 GMT+0530 (India Standard Time) |
>>>>>>> origin/Senuth

---

### 🏷 driver

<<<<<<< HEAD
**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| driver_id | varchar(40) | NO | PRI | NULL |  |
| name | varchar(120) | NO |  | NULL |  |
| address | text | YES |  | NULL |  |
| phone_no | varchar(20) | YES |  | NULL |  |
| email | varchar(120) | YES | UNI | NULL |  |
| password | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| driver_id | name | address | phone_no | email | password |
|---|---|---|---|---|---|
| DRV001 | John Driver | NULL | +94770000001 | NULL | 12341234 |
| DRV002 | Jane Transport | NULL | +94770000002 | NULL | NULL |

---

### 🏷️ order_item

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_item_id | varchar(40) | NO | PRI | NULL |  |
| order_id | varchar(40) | NO | MUL | NULL |  |
| product_id | varchar(40) | NO | MUL | NULL |  |
| quantity | int | NO |  | NULL |  |

#### 📄 Sample Data

| order_item_id | order_id | product_id | quantity |
|---|---|---|---|
| OI1 | ORD001 | P001 | 20 |
| OI2 | ORD001 | P002 | 10 |

---

### 🏷️ orders

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_id | varchar(40) | NO | PRI | NULL |  |
| customer_id | varchar(40) | NO | MUL | NULL |  |
| order_date | datetime | NO |  | NULL |  |
| status | enum('pending','confirmed','scheduled','in_transit','delivered','cancelled') | YES | MUL | pending |  |
| created_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

#### 📄 Sample Data

| order_id | customer_id | order_date | status | created_at | updated_at |
|---|---|---|---|---|---|
| ORD001 | CUS001 | Fri Oct 17 2025 00:00:00 GMT+0530 (India Standard Time) | confirmed | Thu Oct 09 2025 00:02:10 GMT+0530 (India Standard Time) | Thu Oct 09 2025 00:02:10 GMT+0530 (India Standard Time) |

---

### 🏷️ product

**Records:** 3

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
| P001 | Detergent Box | 1kg box | 600.00 | 0.5000 | FMCG | 180 |
| P002 | Shampoo Pack | 500ml | 450.00 | 0.2000 | FMCG | 290 |
| P003 | Soap Carton | 20 bars | 1200.00 | 1.0000 | FMCG | 150 |

---

### 🏷️ store

**Records:** 4
=======
*Records:* 2
>>>>>>> origin/Senuth

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
<<<<<<< HEAD
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
>>>>>>> origin/Senuth

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

<<<<<<< HEAD
### 🏷️ train_trip

**Records:** 3
=======
### 🏷 train_trip

*Records:* 0
>>>>>>> origin/Senuth

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

<<<<<<< HEAD
| trip_id | route_id | train_id | depart_time | arrive_time | capacity | capacity_used | store_id |
|---|---|---|---|---|---|---|---|
| TT001 | R_KAN_COL | TR100 | Fri Oct 17 2025 00:00:00 GMT+0530 (India Standard Time) | Fri Oct 17 2025 06:00:00 GMT+0530 (India Standard Time) | 200.0000 | 0.0000 | ST_COL |
| TT002 | R_KAN_COL | TR100 | Sat Oct 18 2025 00:00:00 GMT+0530 (India Standard Time) | Sat Oct 18 2025 06:00:00 GMT+0530 (India Standard Time) | 200.0000 | 0.0000 | ST_COL |
| TT003 | R_KAN_GAL | TR200 | Fri Oct 17 2025 00:00:00 GMT+0530 (India Standard Time) | Fri Oct 17 2025 07:00:00 GMT+0530 (India Standard Time) | 150.0000 | 0.0000 | ST_GAL |

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

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| delivery_id | varchar(40) | NO | PRI | NULL |  |
| truck_schedule_id | varchar(40) | NO | MUL | NULL |  |
| order_id | varchar(40) | NO | MUL | NULL |  |
| delivered_at | datetime | YES |  | NULL |  |

#### 📄 Sample Data

| delivery_id | truck_schedule_id | order_id | delivered_at |
|---|---|---|---|
| DELIV001 | TS001 | ORD001 | NULL |

---

### 🏷️ truck_route

**Records:** 3

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

### 🏷️ truck_schedule

**Records:** 1

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

| truck_schedule_id | route_id | truck_id | driver_id | assistant_id | start_time | end_time |
|---|---|---|---|---|---|---|
| TS001 | TR_COL_01 | TK01 | DRV001 | AST001 | Sat Oct 18 2025 09:00:00 GMT+0530 (India Standard Time) | Sat Oct 18 2025 13:00:00 GMT+0530 (India Standard Time) |

---

### 🏷️ v_city_route_sales

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| destination_city | varchar(80) | YES |  | NULL |  |
| route_name | varchar(120) | YES |  | NULL |  |
| total_value | decimal(64,2) | YES |  | NULL |  |
| orders | bigint | NO |  | 0 |  |

#### 📄 Sample Data

| destination_city | route_name | total_value | orders |
|---|---|---|---|
| Colombo | Colombo City North | 16500.00 | 1 |

---

### 🏷️ v_customer_order_history

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| customer_id | varchar(40) | NO |  | NULL |  |
| customer_name | varchar(100) | NO |  | NULL |  |
| order_id | varchar(40) | NO |  | NULL |  |
| order_date | datetime | NO |  | NULL |  |
| status | enum('pending','confirmed','scheduled','in_transit','delivered','cancelled') | YES |  | pending |  |
| order_amount | decimal(42,2) | YES |  | NULL |  |
| truck_routes_used | text | YES |  | NULL |  |
| first_out_for_delivery | datetime | YES |  | NULL |  |
| delivered_at | datetime | YES |  | NULL |  |
| destination_city | varchar(80) | YES |  | NULL |  |
| destination_address | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| customer_id | customer_name | order_id | order_date | status | order_amount | truck_routes_used | first_out_for_delivery | delivered_at | destination_city | destination_address |
|---|---|---|---|---|---|---|---|---|---|---|
| CUS001 | John Doe | ORD001 | Fri Oct 17 2025 00:00:00 GMT+0530 (India Standard Time) | confirmed | 16500.00 | Colombo City North | Sat Oct 18 2025 09:00:00 GMT+0530 (India Standard Time) | NULL | Colombo | 123 Galle Rd, Colombo 03 |

---

### 🏷️ v_order_totals

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_id | varchar(40) | NO |  | NULL |  |
| order_amount | decimal(42,2) | YES |  | NULL |  |
| required_space | decimal(42,4) | YES |  | NULL |  |

#### 📄 Sample Data

| order_id | order_amount | required_space |
|---|---|---|
| ORD001 | 16500.00 | 12.0000 |

---

### 🏷️ v_orders_enriched

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_id | varchar(40) | NO |  | NULL |  |
| customer_id | varchar(40) | NO |  | NULL |  |
| order_date | datetime | NO |  | NULL |  |
| status | enum('pending','confirmed','scheduled','in_transit','delivered','cancelled') | YES |  | pending |  |
| created_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | datetime | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| destination_city | varchar(80) | YES |  | NULL |  |
| destination_address | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| order_id | customer_id | order_date | status | created_at | updated_at | destination_city | destination_address |
|---|---|---|---|---|---|---|---|
| ORD001 | CUS001 | Fri Oct 17 2025 00:00:00 GMT+0530 (India Standard Time) | confirmed | Thu Oct 09 2025 00:02:10 GMT+0530 (India Standard Time) | Thu Oct 09 2025 00:02:10 GMT+0530 (India Standard Time) | Colombo | 123 Galle Rd, Colombo 03 |

---

### 🏷️ v_quarter_top_items

**Records:** 2

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| year | int | YES |  | NULL |  |
| quarter | int | YES |  | NULL |  |
| product_id | varchar(40) | NO |  | NULL |  |
| product_name | varchar(120) | NO |  | NULL |  |
| total_qty | decimal(32,0) | YES |  | NULL |  |

#### 📄 Sample Data

| year | quarter | product_id | product_name | total_qty |
|---|---|---|---|---|
| 2025 | 4 | P001 | Detergent Box | 20 |
| 2025 | 4 | P002 | Shampoo Pack | 10 |

---

### 🏷️ v_quarterly_sales
=======
No data available

---

### 🏷 truck
>>>>>>> origin/Senuth

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

No data available

---

<<<<<<< HEAD
### 🏷️ v_truck_usage

**Records:** 1
=======
### 🏷 truck_route

*Records:* 3
>>>>>>> origin/Senuth

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

### 🏷 truck_schedule

*Records:* 0
>>>>>>> origin/Senuth

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
>>>>>>> origin/Senuth

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