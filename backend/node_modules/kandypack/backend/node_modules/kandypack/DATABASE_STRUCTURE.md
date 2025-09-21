# 📊 KandyPack Database Documentation

*Last Updated: 9/21/2025, 2:01:55 PM*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** 9  
**Database Engine:** MySQL  

## 📋 Table Summary

- **admin**: 1 records
- **assistant**: 4 records
- **customer**: 10 records
- **driver**: 4 records
- **order_item**: 0 records
- **orders**: 0 records
- **product**: 5 records
- **train_shipments**: 0 records
- **truck_deliveries**: 0 records

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

#### 📄 Sample Data

| driver_id | name | phone_no | city | user_name | password |
|---|---|---|---|---|---|
| DRV001 | Saman Perera | 0775678901 | Colombo | saman | $2a$10$lguTZJwPKVL9gzc5l6fL... |
| DRV002 | Kamal Silva | 0776789012 | Kandy | kamal | $2a$10$Jwd3JRh1Q1SGCmSWilrI... |
| DRV003 | Nimal Fernando | 0777890123 | Galle | nimal | $2a$10$UgVGn3vs.hAofJng7EyV... |

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
| PROD_002 | Fashion Item | Trendy fashion accessories | 79.99 | 0.50 | 0.01 | Fashion | 100 |
| PROD_003 | Home & Garden Item | Essential home goods | 149.99 | 5.00 | 0.10 | Home & Garden | 25 |

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
