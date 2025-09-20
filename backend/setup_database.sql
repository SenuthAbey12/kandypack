-- Create database
CREATE DATABASE IF NOT EXISTS kandypack;
USE kandypack;

-- Admin table
CREATE TABLE admin (
    admin_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Customer table
CREATE TABLE customer (
    customer_id VARCHAR(40) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15),
    city VARCHAR(50),
    address VARCHAR(200),
    user_name VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Product table
CREATE TABLE product (
    product_id VARCHAR(40) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    weight_per_item DECIMAL(8,2) NOT NULL,
    volume_per_item DECIMAL(8,2) NOT NULL,
    category VARCHAR(50),
    available_quantity INT DEFAULT 0
);

-- Orders table
CREATE TABLE orders (
    order_id VARCHAR(40) PRIMARY KEY,
    customer_id VARCHAR(40),
    order_date DATETIME NOT NULL,
    destination_city VARCHAR(50),
    destination_address VARCHAR(200),
    total_weight DECIMAL(8,2),
    total_volume DECIMAL(8,2),
    order_status ENUM('Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

-- Order items table
CREATE TABLE order_item (
    order_item_id VARCHAR(40) PRIMARY KEY,
    order_id VARCHAR(40),
    product_id VARCHAR(40),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Train shipments table
CREATE TABLE train_shipments (
    shipment_id VARCHAR(40) PRIMARY KEY,
    order_id VARCHAR(40),
    train_id VARCHAR(20),
    departure_date DATE,
    arrival_date DATE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Truck deliveries table
CREATE TABLE truck_deliveries (
    delivery_id VARCHAR(40) PRIMARY KEY,
    order_id VARCHAR(40),
    truck_id VARCHAR(20),
    delivery_date DATE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Insert sample admin
INSERT INTO admin (admin_id, name, password) VALUES 
('ADM001', 'System Administrator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: password

-- Insert sample products
INSERT INTO product (product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity) VALUES
('PROD_001', 'Electronics Item', 'High-quality electronics', 299.99, 2.5, 0.02, 'Electronics', 50),
('PROD_002', 'Fashion Item', 'Trendy fashion accessories', 79.99, 0.5, 0.005, 'Fashion', 100),
('PROD_003', 'Home & Garden Item', 'Essential home goods', 149.99, 5.0, 0.1, 'Home & Garden', 25),
('PROD_004', 'Books & Media', 'Educational materials', 29.99, 0.8, 0.003, 'Books', 75),
('PROD_005', 'Sports Equipment', 'Quality sports gear', 199.99, 3.2, 0.05, 'Sports', 30);