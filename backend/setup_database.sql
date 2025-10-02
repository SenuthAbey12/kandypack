-- =========================================================
-- KANDYPACK - UNIFIED SCHEMA (MySQL 8.0+)
-- =========================================================

-- Safety & defaults
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_safe_updates = 0;

-- ---------------------------------------------------------
-- 1) Database
-- ---------------------------------------------------------
DROP DATABASE IF EXISTS kandypack
CREATE DATABASE IF NOT EXISTS kandypack
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE kandypack;

-- ---------------------------------------------------------
-- 2) Core Reference Tables
-- ---------------------------------------------------------

-- Admin (with portal_type)
CREATE TABLE IF NOT EXISTS admin (
  admin_id   VARCHAR(8)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  password   VARCHAR(255) NOT NULL,
  portal_type ENUM('employee') DEFAULT 'employee',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Customers (with portal_type)
CREATE TABLE IF NOT EXISTS customer (
  customer_id VARCHAR(40) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  phone_no    VARCHAR(15),
  city        VARCHAR(50),
  address     VARCHAR(200),
  user_name   VARCHAR(50) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  portal_type ENUM('customer') DEFAULT 'customer',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Product catalog
CREATE TABLE IF NOT EXISTS product (
  product_id       VARCHAR(40) PRIMARY KEY,
  product_name     VARCHAR(100) NOT NULL,
  description      TEXT,
  price            DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  weight_per_item  DECIMAL(10,3) NOT NULL CHECK (weight_per_item > 0),
  volume_per_item  DECIMAL(10,4) NOT NULL CHECK (volume_per_item > 0),
  category         VARCHAR(50),
  available_quantity INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0)
) ENGINE=InnoDB;

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  order_id           VARCHAR(40) PRIMARY KEY,
  customer_id        VARCHAR(40) NOT NULL,
  order_date         DATETIME NOT NULL,
  destination_city   VARCHAR(50),
  destination_address VARCHAR(200),
  total_weight       DECIMAL(10,3) DEFAULT 0 CHECK (total_weight >= 0),
  total_volume       DECIMAL(10,4) DEFAULT 0 CHECK (total_volume >= 0),
  order_status ENUM('pending','confirmed','in_transit','delivered','cancelled') DEFAULT 'pending',
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status   ON orders(order_status);

-- Order items (unit_price semantics)
CREATE TABLE IF NOT EXISTS order_item (
  order_item_id VARCHAR(40) PRIMARY KEY,
  order_id      VARCHAR(40) NOT NULL,
  product_id    VARCHAR(40) NOT NULL,
  quantity      INT NOT NULL CHECK (quantity > 0),
  unit_price    DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  CONSTRAINT fk_order_item_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_order_item_order   ON order_item(order_id);
CREATE INDEX idx_order_item_product ON order_item(product_id);

-- Optional logistics legs (train/truck)
CREATE TABLE IF NOT EXISTS train_shipments (
  shipment_id   VARCHAR(40) PRIMARY KEY,
  order_id      VARCHAR(40) NOT NULL,
  train_id      VARCHAR(20),
  departure_date DATE,
  arrival_date   DATE,
  CONSTRAINT fk_train_shipments_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_train_shipments_order ON train_shipments(order_id);

CREATE TABLE IF NOT EXISTS truck_deliveries (
  delivery_id   VARCHAR(40) PRIMARY KEY,
  order_id      VARCHAR(40) NOT NULL,
  truck_id      VARCHAR(20),
  delivery_date DATE,
  CONSTRAINT fk_truck_deliveries_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_truck_deliveries_order ON truck_deliveries(order_id);

-- ---------------------------------------------------------
-- 3) Employees (Unified, pluralized) + Ops Tables
-- ---------------------------------------------------------

-- Drivers (source of truth; replaces legacy singular `driver`)
CREATE TABLE IF NOT EXISTS drivers (
  driver_id    VARCHAR(40) PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE NOT NULL,
  phone        VARCHAR(15),
  password     VARCHAR(255) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  vehicle_assigned VARCHAR(50),
  status       ENUM('active','inactive','on_break') DEFAULT 'active',
  hire_date    DATE NOT NULL,
  performance_rating DECIMAL(2,1) DEFAULT 5.0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Assistants (source of truth; replaces legacy singular `assistant`)
CREATE TABLE IF NOT EXISTS assistants (
  assistant_id  VARCHAR(40) PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  phone         VARCHAR(15),
  password      VARCHAR(255) NOT NULL,
  department    ENUM('logistics','customer_service','inventory','maintenance') DEFAULT 'logistics',
  shift_schedule VARCHAR(50),
  status        ENUM('active','inactive','on_break') DEFAULT 'active',
  hire_date     DATE NOT NULL,
  performance_rating DECIMAL(2,1) DEFAULT 5.0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Driver Assignments (link orders to drivers)
CREATE TABLE IF NOT EXISTS driver_assignments (
  assignment_id         VARCHAR(40) PRIMARY KEY,
  driver_id             VARCHAR(40),
  order_id              VARCHAR(40),
  assignment_date       DATE NOT NULL,
  status ENUM('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  estimated_delivery_time DATETIME,
  actual_delivery_time  DATETIME,
  route_details         TEXT,
  special_instructions  TEXT,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_da_driver FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
  CONSTRAINT fk_da_order  FOREIGN KEY (order_id)  REFERENCES orders(order_id)   ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_driver_assignments_driver_id ON driver_assignments(driver_id);
CREATE INDEX idx_driver_assignments_order_id  ON driver_assignments(order_id);
CREATE INDEX idx_driver_assignments_status    ON driver_assignments(status);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  ticket_id    VARCHAR(40) PRIMARY KEY,
  customer_id  VARCHAR(40) NULL,
  assistant_id VARCHAR(40) NULL,
  driver_id    VARCHAR(40) NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT NOT NULL,
  priority     ENUM('low','medium','high','urgent') DEFAULT 'medium',
  status       ENUM('open','in_progress','resolved','closed') DEFAULT 'open',
  category     ENUM('delivery','billing','technical','general') DEFAULT 'general',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at  DATETIME NULL,
  CONSTRAINT fk_st_customer  FOREIGN KEY (customer_id)  REFERENCES customer(customer_id)   ON DELETE SET NULL,
  CONSTRAINT fk_st_assistant FOREIGN KEY (assistant_id) REFERENCES assistants(assistant_id) ON DELETE SET NULL,
  CONSTRAINT fk_st_driver    FOREIGN KEY (driver_id)    REFERENCES drivers(driver_id)      ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_assistant_id ON support_tickets(assistant_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- Driver Requests
CREATE TABLE IF NOT EXISTS driver_requests (
  request_id    VARCHAR(40) PRIMARY KEY,
  driver_id     VARCHAR(40) NOT NULL,
  assistant_id  VARCHAR(40) NULL,
  request_type  ENUM('route_change','vehicle_issue','schedule_change','emergency','break_request') NOT NULL,
  description   TEXT NOT NULL,
  status        ENUM('pending','approved','denied','resolved') DEFAULT 'pending',
  priority      ENUM('low','medium','high','urgent') DEFAULT 'medium',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at   DATETIME NULL,
  resolution_notes TEXT,
  CONSTRAINT fk_dr_driver    FOREIGN KEY (driver_id)    REFERENCES drivers(driver_id)    ON DELETE CASCADE,
  CONSTRAINT fk_dr_assistant FOREIGN KEY (assistant_id) REFERENCES assistants(assistant_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_driver_requests_driver_id ON driver_requests(driver_id);
CREATE INDEX idx_driver_requests_status    ON driver_requests(status);

-- Inventory (Ops)
CREATE TABLE IF NOT EXISTS inventory_items (
  item_id        VARCHAR(40) PRIMARY KEY,
  item_name      VARCHAR(150) NOT NULL,
  category       ENUM('packaging','supplies','equipment','safety') DEFAULT 'packaging',
  current_stock  INT DEFAULT 0,
  minimum_stock  INT DEFAULT 10,
  unit_price     DECIMAL(10,2) CHECK (unit_price >= 0),
  supplier       VARCHAR(100),
  last_restocked DATE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_inventory_items_category      ON inventory_items(category);
CREATE INDEX idx_inventory_items_current_stock ON inventory_items(current_stock);

-- ---------------------------------------------------------
-- 4) Integrity "Functions" (Triggers) and Views
-- ---------------------------------------------------------

DELIMITER //

-- Prevent oversell and maintain stock on INSERT to order_item
CREATE TRIGGER trg_order_item_before_insert
BEFORE INSERT ON order_item
FOR EACH ROW
BEGIN
  DECLARE stock INT;
  SELECT available_quantity INTO stock
  FROM product
  WHERE product_id = NEW.product_id
  FOR UPDATE;

  IF stock IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found';
  END IF;

  IF stock < NEW.quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock';
  END IF;

  UPDATE product
     SET available_quantity = available_quantity - NEW.quantity
   WHERE product_id = NEW.product_id;
END;
//

-- Adjust stock when an order_item is UPDATED (quantity or product change)
CREATE TRIGGER trg_order_item_before_update
BEFORE UPDATE ON order_item
FOR EACH ROW
BEGIN
  -- If product changed, give back old qty to old product, take new qty from new product
  IF OLD.product_id <> NEW.product_id THEN
    -- return old qty to old product
    UPDATE product
       SET available_quantity = available_quantity + OLD.quantity
     WHERE product_id = OLD.product_id;

    -- check new product stock
    DECLARE new_stock INT;
    SELECT available_quantity INTO new_stock
      FROM product
     WHERE product_id = NEW.product_id
     FOR UPDATE;

    IF new_stock IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'New product not found';
    END IF;

    IF new_stock < NEW.quantity THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for new product';
    END IF;

    -- take new qty from new product
    UPDATE product
       SET available_quantity = available_quantity - NEW.quantity
     WHERE product_id = NEW.product_id;

  ELSE
    -- same product; adjust by delta
    DECLARE delta INT;
    SET delta = NEW.quantity - OLD.quantity;

    IF delta > 0 THEN
      -- need more stock
      DECLARE cur_stock INT;
      SELECT available_quantity INTO cur_stock
        FROM product
       WHERE product_id = NEW.product_id
       FOR UPDATE;
      IF cur_stock < delta THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for increased quantity';
      END IF;
      UPDATE product
         SET available_quantity = available_quantity - delta
       WHERE product_id = NEW.product_id;
    ELSEIF delta < 0 THEN
      -- return stock
      UPDATE product
         SET available_quantity = available_quantity - delta  -- delta is negative
       WHERE product_id = NEW.product_id;
    END IF;
  END IF;
END;
//

-- Return stock on DELETE of order_item
CREATE TRIGGER trg_order_item_before_delete
BEFORE DELETE ON order_item
FOR EACH ROW
BEGIN
  UPDATE product
     SET available_quantity = available_quantity + OLD.quantity
   WHERE product_id = OLD.product_id;
END;
//

DELIMITER ;

-- View: roll-up order totals (amount, calc weight/volume)
CREATE OR REPLACE VIEW v_order_totals AS
SELECT
  oi.order_id,
  SUM(oi.quantity * oi.unit_price)                          AS order_amount,
  SUM(oi.quantity * p.weight_per_item)                      AS calc_weight,
  SUM(oi.quantity * p.volume_per_item)                      AS calc_volume
FROM order_item oi
JOIN product p ON p.product_id = oi.product_id
GROUP BY oi.order_id;

-- Compatibility views for legacy code expecting singular table names
CREATE OR REPLACE VIEW driver AS
SELECT
  d.driver_id,
  d.name,
  d.phone AS phone_no,
  NULL    AS address,
  SUBSTRING_INDEX(d.email,'@',1) AS user_name,
  d.password,
  d.license_number,
  d.vehicle_assigned,
  d.hire_date,
  CASE d.status
    WHEN 'active' THEN 'active'
    ELSE 'inactive' -- map 'on_break' to inactive for legacy enum
  END AS status
FROM drivers d;

CREATE OR REPLACE VIEW assistant AS
SELECT
  a.assistant_id,
  a.name,
  a.phone AS phone_no,
  NULL    AS address,
  SUBSTRING_INDEX(a.email,'@',1) AS user_name,
  a.password,
  a.department,
  a.shift_schedule,
  a.hire_date,
  CASE a.status
    WHEN 'active' THEN 'active'
    ELSE 'inactive'
  END AS status
FROM assistants a;

-- ---------------------------------------------------------
-- 5) Seed Data (matches your examples; adjust as needed)
-- ---------------------------------------------------------

-- Admin (bcrypt for 'admin123')
INSERT INTO admin (admin_id, name, password)
VALUES ('ADM001', 'System Administrator', 'admin123')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Customers (bcrypts from your sample)
INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) VALUES
('CUS001', 'John Doe', '+94771234567', 'Colombo', '123 Galle Road, Colombo 03', 'john',  '$2a$10$GDfD4ty0/PI6bOXZEBJFfO8fU15o9J4z/MAH6JKQAl2jXx22xAn96'),
('CUS002', 'Jane Smith', '+94772345678', 'Kandy',   '456 Peradeniya Road, Kandy',        'jane',  '$2a$10$wTtGQeiM2SbCvjBjrg/s1.uFhk4dMnpwPP4v.MWMdNcagJ3lmQmhi'),
('CUS003', 'Bob Wilson', '+94773456789', 'Galle',   '789 Main Street, Galle',            'bob',   '$2a$10$r5Ll57mRWa0FEqKIzv42VO61itOkG/7UwFJjp.LUrW7kLozeFbDlK'),
('CUS004', 'Alice Brown','+94774567890', 'Negombo', '321 Beach Road, Negombo',           'alice', '$2a$10$42AptMHnqYuYgf68ztO97ezJ.RMSPI1.YRQfxIkbxH21821ooA/Y2')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Products
INSERT INTO product (product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity) VALUES
('PROD_001', 'Electronics Item', 'High-quality electronics', 299.99, 2.500, 0.0200, 'Electronics', 50),
('PROD_002', 'Fashion Item',     'Trendy fashion accessories', 79.99, 0.500, 0.0050, 'Fashion',    100),
('PROD_003', 'Home & Garden Item','Essential home goods',     149.99, 5.000, 0.1000, 'Home & Garden', 25),
('PROD_004', 'Books & Media',    'Educational materials',      29.99, 0.800, 0.0030, 'Books',      75),
('PROD_005', 'Sports Equipment', 'Quality sports gear',       199.99, 3.200, 0.0500, 'Sports',     30)
ON DUPLICATE KEY UPDATE product_name=VALUES(product_name);

-- Drivers (bcrypt placeholder hash)
INSERT INTO drivers (driver_id, name, email, phone, password, license_number, vehicle_assigned, hire_date, status) VALUES
('DRV001', 'John Driver',   'john.driver@kandypack.com',  '+94771234567', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL123456789', 'VAN-001',  '2024-01-15', 'active'),
('DRV002', 'Jane Transport','jane.transport@kandypack.com','+94772345678', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL987654321', 'TRUCK-002','2024-02-20', 'active'),
('DRV003', 'Mike Delivery', 'mike.delivery@kandypack.com', '+94773456789', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL456789123', 'VAN-003',  '2024-03-10', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Assistants
INSERT INTO assistants (assistant_id, name, email, phone, password, department, shift_schedule, hire_date, status) VALUES
('AST001', 'Sarah Support',  'sarah.support@kandypack.com', '+94774567890', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer_service', 'Day Shift (8AM-5PM)',    '2024-01-20', 'active'),
('AST002', 'David Logistics','david.logistics@kandypack.com','+94775678901', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'logistics',        'Evening Shift (2PM-11PM)','2024-02-15', 'active'),
('AST003', 'Lisa Inventory', 'lisa.inventory@kandypack.com', '+94776789012', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'inventory',        'Day Shift (8AM-5PM)',    '2024-03-05', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Sample Orders that match assignment references
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, order_status)
VALUES
('ORD001', 'CUS001', NOW(), 'Mount Lavinia', '12 Beach Rd, Mount Lavinia', 'in_transit'),
('ORD002', 'CUS002', NOW(), 'Nuwara Eliya',  '45 Gregory Rd, Nuwara Eliya','pending'),
('ORD003', 'CUS003', NOW(), 'Airport',       'BIA Access Rd',              'delivered')
ON DUPLICATE KEY UPDATE destination_city=VALUES(destination_city);

-- Optional: sample order_items (uses stock triggers)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI_0001', 'ORD001', 'PROD_001', 1, 299.99),
('OI_0002', 'ORD001', 'PROD_004', 2, 29.99),
('OI_0003', 'ORD002', 'PROD_002', 3, 79.99)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

-- Driver Assignments
INSERT INTO driver_assignments (assignment_id, driver_id, order_id, assignment_date, status, estimated_delivery_time, route_details)
VALUES
('ASGN001', 'DRV001', 'ORD001', CURDATE(), 'in_progress', DATE_ADD(NOW(), INTERVAL 2 HOUR), 'Colombo to Mount Lavinia via Galle Road'),
('ASGN002', 'DRV002', 'ORD002', CURDATE(), 'pending',     DATE_ADD(NOW(), INTERVAL 4 HOUR), 'Kandy to Nuwara Eliya via A5 Highway'),
('ASGN003', 'DRV003', 'ORD003', CURDATE(), 'completed',   NOW(),                             'Negombo to Airport via Highway')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Support Tickets
INSERT INTO support_tickets (ticket_id, customer_id, assistant_id, driver_id, title, description, priority, status, category)
VALUES
('TKT001', 'CUS001', 'AST001', NULL, 'Package Delivery Delay',
 'Customer reports package should have arrived yesterday but still not delivered', 'high', 'open', 'delivery'),
('TKT002', 'CUS002', 'AST001', NULL, 'Wrong Delivery Address',
 'Package delivered to wrong address, customer needs redelivery', 'medium', 'in_progress', 'delivery'),
('TKT003', 'CUS003', 'AST002', NULL, 'Billing Inquiry',
 'Customer questions additional charges on recent order', 'low', 'resolved', 'billing')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Driver Requests
INSERT INTO driver_requests (request_id, driver_id, request_type, description, priority, status)
VALUES
('REQ001', 'DRV001', 'route_change',  'Heavy traffic on main route, requesting alternate path', 'medium', 'pending'),
('REQ002', 'DRV002', 'vehicle_issue', 'Tire pressure warning light on dashboard',               'high',   'resolved'),
('REQ003', 'DRV003', 'break_request', 'Requesting 30-minute break after 4 hours of driving',   'low',    'approved')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Inventory Items
INSERT INTO inventory_items (item_id, item_name, category, current_stock, minimum_stock, unit_price, supplier, last_restocked)
VALUES
('INV001', 'Large Packaging Box (40x30x25cm)', 'packaging', 150, 50, 120.00, 'BoxMaster Supplies',       CURDATE()),
('INV002', 'Bubble Wrap Roll (1.5m x 100m)',   'packaging',  25, 30, 850.00, 'Protective Packaging Ltd', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
('INV003', 'Shipping Labels (A4 Sheet)',       'supplies',  500,100,  25.00, 'PrintPro Solutions',       CURDATE()),
('INV004', 'Packing Tape (48mm x 100m)',       'supplies',   80, 20, 180.00, 'Adhesive Experts',         DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
('INV005', 'Safety Vest (High Visibility)',    'safety',     15, 10, 450.00, 'WorkSafe Equipment',       DATE_SUB(CURDATE(), INTERVAL 10 DAY))
ON DUPLICATE KEY UPDATE current_stock=VALUES(current_stock);

