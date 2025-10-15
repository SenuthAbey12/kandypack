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

-- Driver table
CREATE TABLE driver (
    driver_id VARCHAR(40) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15),
    address VARCHAR(200),
    user_name VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    license_number VARCHAR(50),
    vehicle_assigned VARCHAR(50),
    hire_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Assistant table
CREATE TABLE assistant (
    assistant_id VARCHAR(40) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15),
    address VARCHAR(200),
    user_name VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(50),
    shift_schedule VARCHAR(100),
    hire_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active'
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

-- Insert sample admin with simple password (admin123)
INSERT INTO admin (admin_id, name, password) VALUES 
('ADM001', 'System Administrator', '$2a$10$f/cYEXjz.SqTJxbyzcvyC.amHl6BTEbFpNiM/qH56W52paAuRU9qm'); -- password: admin123

-- Insert sample customers with simple passwords
INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) VALUES
('CUS001', 'John Doe', '+94771234567', 'Colombo', '123 Galle Road, Colombo 03', 'john', '$2a$10$GDfD4ty0/PI6bOXZEBJFfO8fU15o9J4z/MAH6JKQAl2jXx22xAn96'), -- password: john123
('CUS002', 'Jane Smith', '+94772345678', 'Kandy', '456 Peradeniya Road, Kandy', 'jane', '$2a$10$wTtGQeiM2SbCvjBjrg/s1.uFhk4dMnpwPP4v.MWMdNcagJ3lmQmhi'), -- password: jane123
('CUS003', 'Bob Wilson', '+94773456789', 'Galle', '789 Main Street, Galle', 'bob', '$2a$10$r5Ll57mRWa0FEqKIzv42VO61itOkG/7UwFJjp.LUrW7kLozeFbDlK'), -- password: bob123
('CUS004', 'Alice Brown', '+94774567890', 'Negombo', '321 Beach Road, Negombo', 'alice', '$2a$10$42AptMHnqYuYgf68ztO97ezJ.RMSPI1.YRQfxIkbxH21821ooA/Y2'); -- password: alice123

-- Insert sample drivers with simple passwords
INSERT INTO driver (driver_id, name, phone_no, address, user_name, password, license_number, vehicle_assigned, hire_date, status) VALUES
('DRV001', 'Saman Perera', '+94711234567', '12 Temple Road, Colombo', 'saman', '$2a$10$lWYBVtSTsVuMwkK8jSQed.fKRFvKfnsZnC.3SBIqBfbi0DiAmS2eq', 'DL001234', 'VAN-001', '2024-01-15', 'active'), -- password: saman123
('DRV002', 'Kamal Silva', '+94712345678', '34 Lake Road, Kandy', 'kamal', '$2a$10$j5.gwbYlOF5CLxle1w5vhe65kWzoqPWqtN9lwELVY9YhVQt/Bjh7O', 'DL002345', 'TRUCK-001', '2024-02-20', 'active'), -- password: kamal123
('DRV003', 'Nimal Fernando', '+94713456789', '56 Sea View, Galle', 'nimal', '$2a$10$6VfgX2M40xgC95itfGas0.Ogw/Gwk6empYJSZTxUAdcqVQ2S.QkWW', 'DL003456', 'VAN-002', '2024-03-10', 'active'), -- password: nimal123
('DRV004', 'Sunil Rathnayake', '+94714567890', '78 Hill Street, Matara', 'sunil', '$2a$10$qD7.RJa.4herF8zkGQ4C4.ItIyjbvsJ6gL/W1die.MEh8O2V968ay', 'DL004567', 'TRUCK-002', '2024-04-05', 'active'); -- password: sunil123

-- Insert sample assistants with simple passwords
INSERT INTO assistant (assistant_id, name, phone_no, address, user_name, password, department, shift_schedule, hire_date, status) VALUES
('AST001', 'Priya Jayasinghe', '+94721234567', '90 Park Road, Colombo', 'priya', '$2a$10$ZwDPIdB00P3g/R5Yru3.S.s/S4.uYID7mwyA.D3AFiZUBxjzvVlF2', 'Customer Service', 'Day Shift (8AM-5PM)', '2024-01-20', 'active'), -- password: priya123
('AST002', 'Chamara Wijesekara', '+94722345678', '12 School Lane, Kandy', 'chamara', '$2a$10$h0ccCAerilRuk2jumDZB8eAAiW6evy66xNru8uWzT8oRIIQA1PTHG', 'Logistics', 'Evening Shift (2PM-11PM)', '2024-02-15', 'active'), -- password: chamara123
('AST003', 'Sanduni Mendis', '+94723456789', '34 Church Street, Galle', 'sanduni', '$2a$10$YNbJcDw5we1blGXLYOXMvO.PANhJ.F985unKptnSdRTlGLIPUsfh6', 'Inventory', 'Day Shift (8AM-5PM)', '2024-03-05', 'active'), -- password: sanduni123
('AST004', 'Thilaka Kumari', '+94724567890', '56 Market Road, Negombo', 'thilaka', '$2a$10$.FGLF1DlwluFj3/ehlr8m.OfXbglanwSI1ZGEkAq9Mp/gnUbChT4S', 'Support', 'Night Shift (11PM-8AM)', '2024-04-10', 'active'); -- password: thilaka123

-- Insert sample products
INSERT INTO product (product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity) VALUES
('PROD_001', 'Electronics Item', 'High-quality electronics', 299.99, 2.5, 0.02, 'Electronics', 50),
('PROD_002', 'Fashion Item', 'Trendy fashion accessories', 79.99, 0.5, 0.005, 'Fashion', 100),
('PROD_003', 'Home & Garden Item', 'Essential home goods', 149.99, 5.0, 0.1, 'Home & Garden', 25),
('PROD_004', 'Books & Media', 'Educational materials', 29.99, 0.8, 0.003, 'Books', 75),
('PROD_005', 'Sports Equipment', 'Quality sports gear', 199.99, 3.2, 0.05, 'Sports', 30);