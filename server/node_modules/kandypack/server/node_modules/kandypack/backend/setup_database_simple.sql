-- KandyPack Simplified Database Setup
-- This script creates a simplified database with easy-to-use passwords

CREATE DATABASE IF NOT EXISTS `project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `project`;

-- Disable foreign key checks during setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS `truck_schedule`;
DROP TABLE IF EXISTS `order_item`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `customer`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `driver`;
DROP TABLE IF EXISTS `assistant`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `truck`;
DROP TABLE IF EXISTS `truck_routes`;
DROP TABLE IF EXISTS `train_schedule`;
DROP TABLE IF EXISTS `train_routes`;
DROP TABLE IF EXISTS `train`;

-- Create Admin table with simple passwords
CREATE TABLE `admin` (
  `admin_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Customer table with simple passwords
CREATE TABLE `customer` (
  `customer_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_no` varchar(50) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `address` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Driver table with login credentials
CREATE TABLE `driver` (
  `driver_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_no` varchar(50) DEFAULT NULL,
  `address` text,
  `license_number` varchar(100) DEFAULT NULL,
  `vehicle_assigned` varchar(100) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` enum('active','inactive','on_leave') DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`driver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Assistant table with login credentials
CREATE TABLE `assistant` (
  `assistant_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_no` varchar(50) DEFAULT NULL,
  `address` text,
  `department` varchar(100) DEFAULT NULL,
  `shift_schedule` varchar(200) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` enum('active','inactive','on_leave') DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assistant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Product table
CREATE TABLE `product` (
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `weight_per_item` decimal(8,2) DEFAULT NULL,
  `volume_per_item` decimal(8,4) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `available_quantity` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Orders table
CREATE TABLE `orders` (
  `order_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` text,
  `delivery_date` date DEFAULT NULL,
  `assigned_driver_id` varchar(255) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`order_id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_driver_id` (`assigned_driver_id`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_driver` FOREIGN KEY (`assigned_driver_id`) REFERENCES `driver` (`driver_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Order Items table
CREATE TABLE `order_item` (
  `order_item_id` varchar(255) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) GENERATED ALWAYS AS (`quantity` * `unit_price`) STORED,
  PRIMARY KEY (`order_item_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Sample Admins with simple passwords
INSERT INTO admin (admin_id, name, username, password, email, phone) VALUES 
('ADM001', 'System Admin', 'admin', 'admin123', 'admin@kandypack.com', '+94701234567'),
('ADM002', 'Manager', 'manager', 'manager123', 'manager@kandypack.com', '+94701234568'),
('ADM003', 'Supervisor', 'supervisor', 'super123', 'supervisor@kandypack.com', '+94701234569');

-- Insert Sample Customers with simple passwords
INSERT INTO customer (customer_id, name, username, password, email, phone_no, city, address) VALUES 
('CUS001', 'John Doe', 'john', 'john123', 'john@email.com', '+94771234567', 'Colombo', '123 Galle Road, Colombo 03'),
('CUS002', 'Jane Smith', 'jane', 'jane123', 'jane@email.com', '+94772345678', 'Kandy', '456 Peradeniya Road, Kandy'),
('CUS003', 'Bob Wilson', 'bob', 'bob123', 'bob@email.com', '+94773456789', 'Galle', '789 Main Street, Galle'),
('CUS004', 'Alice Brown', 'alice', 'alice123', 'alice@email.com', '+94774567890', 'Negombo', '321 Beach Road, Negombo'),
('CUS005', 'Mike Davis', 'mike', 'mike123', 'mike@email.com', '+94775678901', 'Matara', '654 Matara Road, Matara');

-- Insert Sample Drivers with simple passwords
INSERT INTO driver (driver_id, name, username, password, email, phone_no, address, license_number, vehicle_assigned, hire_date, status) VALUES 
('DRV001', 'Saman Perera', 'saman', 'saman123', 'saman@kandypack.com', '+94711234567', '12 Temple Road, Colombo', 'DL001234', 'VAN-001', '2024-01-15', 'active'),
('DRV002', 'Kamal Silva', 'kamal', 'kamal123', 'kamal@kandypack.com', '+94712345678', '34 Lake Road, Kandy', 'DL002345', 'TRUCK-001', '2024-02-20', 'active'),
('DRV003', 'Nimal Fernando', 'nimal', 'nimal123', 'nimal@kandypack.com', '+94713456789', '56 Sea View, Galle', 'DL003456', 'VAN-002', '2024-03-10', 'active'),
('DRV004', 'Sunil Rathnayake', 'sunil', 'sunil123', 'sunil@kandypack.com', '+94714567890', '78 Hill Street, Matara', 'DL004567', 'TRUCK-002', '2024-04-05', 'active');

-- Insert Sample Assistants with simple passwords
INSERT INTO assistant (assistant_id, name, username, password, email, phone_no, address, department, shift_schedule, hire_date, status) VALUES 
('AST001', 'Priya Jayasinghe', 'priya', 'priya123', 'priya@kandypack.com', '+94721234567', '90 Park Road, Colombo', 'Customer Service', 'Day Shift (8AM-5PM)', '2024-01-20', 'active'),
('AST002', 'Chamara Wijesekara', 'chamara', 'chamara123', 'chamara@kandypack.com', '+94722345678', '12 School Lane, Kandy', 'Logistics', 'Evening Shift (2PM-11PM)', '2024-02-15', 'active'),
('AST003', 'Sanduni Mendis', 'sanduni', 'sanduni123', 'sanduni@kandypack.com', '+94723456789', '34 Church Street, Galle', 'Inventory', 'Day Shift (8AM-5PM)', '2024-03-05', 'active'),
('AST004', 'Thilaka Kumari', 'thilaka', 'thilaka123', 'thilaka@kandypack.com', '+94724567890', '56 Market Road, Negombo', 'Support', 'Night Shift (11PM-8AM)', '2024-04-10', 'active');

-- Insert Sample Products
INSERT INTO product (product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity) VALUES
('PROD_001', 'Laptop Computer', 'High-performance laptop for business', 125000.00, 2.5, 0.008, 'Electronics', 25),
('PROD_002', 'Smartphone', 'Latest Android smartphone', 45000.00, 0.2, 0.0002, 'Electronics', 50),
('PROD_003', 'Casual T-Shirt', 'Comfortable cotton t-shirt', 2500.00, 0.2, 0.001, 'Fashion', 100),
('PROD_004', 'Running Shoes', 'Professional running shoes', 8500.00, 0.8, 0.005, 'Sports', 40),
('PROD_005', 'Coffee Maker', 'Automatic coffee brewing machine', 15000.00, 3.2, 0.02, 'Home & Kitchen', 20),
('PROD_006', 'Programming Book', 'Learn web development', 3500.00, 0.5, 0.002, 'Books', 75),
('PROD_007', 'Yoga Mat', 'Premium exercise yoga mat', 4200.00, 1.5, 0.015, 'Sports', 35),
('PROD_008', 'Bluetooth Speaker', 'Portable wireless speaker', 7500.00, 0.6, 0.003, 'Electronics', 30);

-- Insert Sample Orders
INSERT INTO orders (order_id, customer_id, total_amount, status, shipping_address, delivery_date, assigned_driver_id, notes) VALUES
('ORD001', 'CUS001', 125000.00, 'processing', '123 Galle Road, Colombo 03', '2024-09-25', 'DRV001', 'Handle with care - Electronics'),
('ORD002', 'CUS002', 53500.00, 'shipped', '456 Peradeniya Road, Kandy', '2024-09-26', 'DRV002', 'Multiple items - check inventory'),
('ORD003', 'CUS003', 15000.00, 'delivered', '789 Main Street, Galle', '2024-09-22', 'DRV003', 'Delivered successfully'),
('ORD004', 'CUS004', 32000.00, 'pending', '321 Beach Road, Negombo', '2024-09-27', NULL, 'Awaiting driver assignment'),
('ORD005', 'CUS005', 8500.00, 'processing', '654 Matara Road, Matara', '2024-09-28', 'DRV004', 'Express delivery requested');

-- Insert Sample Order Items
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI001', 'ORD001', 'PROD_001', 1, 125000.00),
('OI002', 'ORD002', 'PROD_002', 1, 45000.00),
('OI003', 'ORD002', 'PROD_004', 1, 8500.00),
('OI004', 'ORD003', 'PROD_005', 1, 15000.00),
('OI005', 'ORD004', 'PROD_003', 8, 2500.00),
('OI006', 'ORD004', 'PROD_007', 2, 4200.00),
('OI007', 'ORD005', 'PROD_004', 1, 8500.00);

-- Display success message
SELECT 'Database setup completed successfully!' as Status;
SELECT 'Simple login credentials created for all user types' as Info;

-- Show sample credentials
SELECT 'ADMIN LOGINS:' as 'User Type', username, password FROM admin
UNION ALL
SELECT 'CUSTOMER LOGINS:', username, password FROM customer LIMIT 3
UNION ALL  
SELECT 'DRIVER LOGINS:', username, password FROM driver LIMIT 3
UNION ALL
SELECT 'ASSISTANT LOGINS:', username, password FROM assistant LIMIT 3;