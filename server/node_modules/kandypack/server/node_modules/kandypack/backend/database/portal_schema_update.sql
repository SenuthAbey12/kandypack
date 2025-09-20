-- KandyPack Database Schema Update
-- Adding Employee Tables for Portal Separation

-- Create Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    driver_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_assigned VARCHAR(50),
    status ENUM('active', 'inactive', 'on_break') DEFAULT 'active',
    hire_date DATE NOT NULL,
    performance_rating DECIMAL(2,1) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Assistants Table
CREATE TABLE IF NOT EXISTS assistants (
    assistant_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    department ENUM('logistics', 'customer_service', 'inventory', 'maintenance') DEFAULT 'logistics',
    shift_schedule VARCHAR(50),
    status ENUM('active', 'inactive', 'on_break') DEFAULT 'active',
    hire_date DATE NOT NULL,
    performance_rating DECIMAL(2,1) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Driver Assignments Table
CREATE TABLE IF NOT EXISTS driver_assignments (
    assignment_id VARCHAR(10) PRIMARY KEY,
    driver_id VARCHAR(8),
    order_id VARCHAR(8),
    assignment_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    route_details TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Create Support Tickets Table for Assistant Management
CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(8),
    assistant_id VARCHAR(8),
    driver_id VARCHAR(8) NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    category ENUM('delivery', 'billing', 'technical', 'general') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE SET NULL,
    FOREIGN KEY (assistant_id) REFERENCES assistants(assistant_id) ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL
);

-- Create Driver Requests Table
CREATE TABLE IF NOT EXISTS driver_requests (
    request_id VARCHAR(10) PRIMARY KEY,
    driver_id VARCHAR(8),
    assistant_id VARCHAR(8) NULL,
    request_type ENUM('route_change', 'vehicle_issue', 'schedule_change', 'emergency', 'break_request') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'approved', 'denied', 'resolved') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    resolution_notes TEXT,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (assistant_id) REFERENCES assistants(assistant_id) ON DELETE SET NULL
);

-- Create Inventory Items Table for Assistant Management
CREATE TABLE IF NOT EXISTS inventory_items (
    item_id VARCHAR(10) PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    category ENUM('packaging', 'supplies', 'equipment', 'safety') DEFAULT 'packaging',
    current_stock INT DEFAULT 0,
    minimum_stock INT DEFAULT 10,
    unit_price DECIMAL(10,2),
    supplier VARCHAR(100),
    last_restocked DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Sample Drivers
INSERT INTO drivers (driver_id, name, email, phone, password, license_number, vehicle_assigned, hire_date) VALUES
('DRV001', 'John Driver', 'john.driver@kandypack.com', '+94771234567', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL123456789', 'VAN-001', '2024-01-15'),
('DRV002', 'Jane Transport', 'jane.transport@kandypack.com', '+94772345678', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL987654321', 'TRUCK-002', '2024-02-20'),
('DRV003', 'Mike Delivery', 'mike.delivery@kandypack.com', '+94773456789', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL456789123', 'VAN-003', '2024-03-10');

-- Insert Sample Assistants
INSERT INTO assistants (assistant_id, name, email, phone, password, department, shift_schedule, hire_date) VALUES
('AST001', 'Sarah Support', 'sarah.support@kandypack.com', '+94774567890', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer_service', 'Day Shift (8AM-5PM)', '2024-01-20'),
('AST002', 'David Logistics', 'david.logistics@kandypack.com', '+94775678901', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'logistics', 'Evening Shift (2PM-11PM)', '2024-02-15'),
('AST003', 'Lisa Inventory', 'lisa.inventory@kandypack.com', '+94776789012', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'inventory', 'Day Shift (8AM-5PM)', '2024-03-05');

-- Insert Sample Driver Assignments
INSERT INTO driver_assignments (assignment_id, driver_id, order_id, assignment_date, status, estimated_delivery_time, route_details) VALUES
('ASGN001', 'DRV001', 'ORD001', CURDATE(), 'in_progress', DATE_ADD(NOW(), INTERVAL 2 HOUR), 'Colombo to Mount Lavinia via Galle Road'),
('ASGN002', 'DRV002', 'ORD002', CURDATE(), 'pending', DATE_ADD(NOW(), INTERVAL 4 HOUR), 'Kandy to Nuwara Eliya via A5 Highway'),
('ASGN003', 'DRV003', 'ORD003', CURDATE(), 'completed', NOW(), 'Negombo to Airport via Highway');

-- Insert Sample Support Tickets
INSERT INTO support_tickets (ticket_id, customer_id, assistant_id, title, description, priority, status, category) VALUES
('TKT001', 'CUS001', 'AST001', 'Package Delivery Delay', 'Customer reports package should have arrived yesterday but still not delivered', 'high', 'open', 'delivery'),
('TKT002', 'CUS002', 'AST001', 'Wrong Delivery Address', 'Package delivered to wrong address, customer needs redelivery', 'medium', 'in_progress', 'delivery'),
('TKT003', 'CUS003', 'AST002', 'Billing Inquiry', 'Customer questions additional charges on recent order', 'low', 'resolved', 'billing');

-- Insert Sample Driver Requests
INSERT INTO driver_requests (request_id, driver_id, request_type, description, priority, status) VALUES
('REQ001', 'DRV001', 'route_change', 'Heavy traffic on main route, requesting alternate path', 'medium', 'pending'),
('REQ002', 'DRV002', 'vehicle_issue', 'Tire pressure warning light on dashboard', 'high', 'resolved'),
('REQ003', 'DRV003', 'break_request', 'Requesting 30-minute break after 4 hours of driving', 'low', 'approved');

-- Insert Sample Inventory Items
INSERT INTO inventory_items (item_id, item_name, category, current_stock, minimum_stock, unit_price, supplier, last_restocked) VALUES
('INV001', 'Large Packaging Box (40x30x25cm)', 'packaging', 150, 50, 120.00, 'BoxMaster Supplies', CURDATE()),
('INV002', 'Bubble Wrap Roll (1.5m x 100m)', 'packaging', 25, 30, 850.00, 'Protective Packaging Ltd', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
('INV003', 'Shipping Labels (A4 Sheet)', 'supplies', 500, 100, 25.00, 'PrintPro Solutions', CURDATE()),
('INV004', 'Packing Tape (48mm x 100m)', 'supplies', 80, 20, 180.00, 'Adhesive Experts', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
('INV005', 'Safety Vest (High Visibility)', 'safety', 15, 10, 450.00, 'WorkSafe Equipment', DATE_SUB(CURDATE(), INTERVAL 10 DAY));

-- Update Admin table to support portal type (if needed)
ALTER TABLE admin ADD COLUMN IF NOT EXISTS portal_type ENUM('employee') DEFAULT 'employee';

-- Update Customer table to support portal type (if needed)  
ALTER TABLE customer ADD COLUMN IF NOT EXISTS portal_type ENUM('customer') DEFAULT 'customer';

-- Create indexes for better performance
CREATE INDEX idx_driver_assignments_driver_id ON driver_assignments(driver_id);
CREATE INDEX idx_driver_assignments_order_id ON driver_assignments(order_id);
CREATE INDEX idx_driver_assignments_status ON driver_assignments(status);
CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_assistant_id ON support_tickets(assistant_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_driver_requests_driver_id ON driver_requests(driver_id);
CREATE INDEX idx_driver_requests_status ON driver_requests(status);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_current_stock ON inventory_items(current_stock);