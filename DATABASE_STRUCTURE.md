# 📊 KandyPack Database Documentation

*Last Updated: 10/15/2025, 4:29:23 PM*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** 15  
**Database Engine:** MySQL  

## 📋 Table Summary

- **admin**: 0 records
- **assistant**: 0 records
- **customer**: 1 records
- **driver**: 0 records
- **order_item**: 0 records
- **orders**: 0 records
- **product**: 0 records
- **store**: 0 records
- **train_route**: 0 records
- **train_shipments**: 0 records
- **trains**: 0 records
- **truck**: 0 records
- **truck_deliveries**: 0 records
- **truck_routes**: 0 records
- **truck_schedule**: 0 records

## 📊 Detailed Table Information

### 🏷️ admin

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| admin_id | varchar(255) | NO | PRI | NULL |  |
| name | varchar(255) | NO |  | NULL |  |
| password | varchar(255) | NO |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ assistant

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| assistant_id | varchar(255) | NO | PRI | NULL |  |
| name | varchar(255) | NO |  | NULL |  |
| address | text | YES |  | NULL |  |
| phone_no | varchar(50) | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ customer

**Records:** 1

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| customer_id | varchar(255) | NO | PRI | NULL |  |
| name | varchar(255) | NO |  | NULL |  |
| phone_no | varchar(50) | YES |  | NULL |  |
| city | varchar(255) | YES |  | NULL |  |
| address | text | YES |  | NULL |  |
| user_name | varchar(255) | YES | UNI | NULL |  |
| password | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

| customer_id | name | phone_no | city | address | user_name | password |
|---|---|---|---|---|---|---|
| CUS958088 | Thadshakan Jegatheeswaran | 0766741120 | Batticaloa | Aelvangar east ,Arayampthy_02 | thadshakanj.23 | $2a$10$BivyKFTPGa1118B98YWK... |

---

### 🏷️ driver

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| driver_id | varchar(255) | NO | PRI | NULL |  |
| name | varchar(255) | NO |  | NULL |  |
| address | text | YES |  | NULL |  |
| phone_no | varchar(50) | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ order_item

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_item_id | varchar(255) | NO | PRI | NULL |  |
| order_id | varchar(255) | NO | MUL | NULL |  |
| product_id | varchar(255) | NO | MUL | NULL |  |
| quantity | int | NO |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ orders

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| order_id | varchar(255) | NO | PRI | NULL |  |
| customer_id | varchar(255) | NO | MUL | NULL |  |
| order_date | date | NO |  | NULL |  |
| status | varchar(255) | YES |  | NULL |  |
| updated_at | datetime | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ product

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| product_id | varchar(255) | NO | PRI | NULL |  |
| name | varchar(255) | NO |  | NULL |  |
| space_consumption | decimal(10,2) | NO |  | NULL |  |
| price | decimal(10,2) | NO |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ store

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| store_id | varchar(255) | NO | PRI | NULL |  |
| name | varchar(255) | NO |  | NULL |  |
| city | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ train_route

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| route_id | varchar(255) | NO | PRI | NULL |  |
| start_point | varchar(255) | NO |  | NULL |  |
| end_point | varchar(255) | NO |  | NULL |  |
| destinations | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ train_shipments

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| shipment_id | varchar(255) | NO | PRI | NULL |  |
| order_id | varchar(255) | NO | MUL | NULL |  |
| train_id | varchar(255) | NO | MUL | NULL |  |
| order_capacity | decimal(10,2) | NO |  | NULL |  |
| shipment_date | datetime | NO |  | NULL |  |
| store_id | varchar(255) | NO | MUL | NULL |  |
| destination | varchar(255) | YES |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ trains

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| train_id | varchar(255) | NO | PRI | NULL |  |
| capacity | decimal(10,2) | NO |  | NULL |  |
| start_time | time | NO |  | NULL |  |
| end_time | time | NO |  | NULL |  |
| route_id | varchar(255) | NO | MUL | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ truck

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| truck_id | varchar(255) | NO | PRI | NULL |  |
| license_plate | varchar(64) | NO | UNI | NULL |  |
| capacity | decimal(10,2) | NO |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ truck_deliveries

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| delivery_id | varchar(255) | NO | PRI | NULL |  |
| truck_schedule_id | varchar(255) | NO | MUL | NULL |  |
| order_id | varchar(255) | NO | MUL | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ truck_routes

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| route_id | varchar(255) | NO | PRI | NULL |  |
| store_id | varchar(255) | NO | MUL | NULL |  |
| route_name | varchar(255) | NO |  | NULL |  |

#### 📄 Sample Data

*No data available*

---

### 🏷️ truck_schedule

**Records:** 0

#### 📐 Table Structure

| Column | Type | Null | Key | Default | Extra |
|--------|------|------|-----|---------|-------|
| truck_schedule_id | varchar(255) | NO | PRI | NULL |  |
| route_id | varchar(255) | NO | MUL | NULL |  |
| truck_id | varchar(255) | NO | MUL | NULL |  |
| driver_id | varchar(255) | NO | MUL | NULL |  |
| assistant_id | varchar(255) | NO | MUL | NULL |  |
| start_time | datetime | NO |  | NULL |  |
| end_time | datetime | NO |  | NULL |  |

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
