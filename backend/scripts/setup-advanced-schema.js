const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdvancedSchema() {
    console.log('🔄 Creating Advanced Rail & Road Distribution Schema...');
    
    try {
        // Connect to MySQL without database first
        let connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Drop and recreate database
        await connection.execute('DROP DATABASE IF EXISTS kandypack');
        await connection.execute('CREATE DATABASE kandypack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        await connection.end();
        
        // Reconnect to the new database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: 'kandypack',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Database recreated');
        
        // Create core reference tables
        console.log('🔄 Creating core tables...');
        
        // Admin table
        await connection.execute(`
            CREATE TABLE admin (
                admin_id VARCHAR(20) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table admin created');
        
        // Customer table
        await connection.execute(`
            CREATE TABLE customer (
                customer_id VARCHAR(40) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone_no VARCHAR(20),
                city VARCHAR(80),
                address VARCHAR(255),
                user_name VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table customer created');
        
        // Product table
        await connection.execute(`
            CREATE TABLE product (
                product_id VARCHAR(40) PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
                space_consumption DECIMAL(10,4) NOT NULL CHECK (space_consumption > 0),
                category VARCHAR(60),
                available_quantity INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0)
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table product created');
        
        // Store table
        await connection.execute(`
            CREATE TABLE store (
                store_id VARCHAR(40) PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                city VARCHAR(80) NOT NULL
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_store_city ON store(city)');
        console.log('✅ Table store created');
        
        // Orders table (simplified)
        await connection.execute(`
            CREATE TABLE orders (
                order_id VARCHAR(40) PRIMARY KEY,
                customer_id VARCHAR(40) NOT NULL,
                order_date DATETIME NOT NULL,
                destination_city VARCHAR(80) NOT NULL,
                destination_address VARCHAR(255) NOT NULL,
                status ENUM('pending','confirmed','scheduled','in_transit','delivered','cancelled') DEFAULT 'pending',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_orders_customer
                    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
                    ON UPDATE CASCADE ON DELETE RESTRICT
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_orders_customer ON orders(customer_id)');
        await connection.execute('CREATE INDEX idx_orders_status ON orders(status)');
        await connection.execute('CREATE INDEX idx_orders_city ON orders(destination_city)');
        console.log('✅ Table orders created');
        
        // Order item table
        await connection.execute(`
            CREATE TABLE order_item (
                order_item_id VARCHAR(40) PRIMARY KEY,
                order_id VARCHAR(40) NOT NULL,
                product_id VARCHAR(40) NOT NULL,
                quantity INT NOT NULL CHECK (quantity > 0),
                unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
                CONSTRAINT fk_order_item_order
                    FOREIGN KEY (order_id) REFERENCES orders(order_id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                CONSTRAINT fk_order_item_product
                    FOREIGN KEY (product_id) REFERENCES product(product_id)
                    ON UPDATE CASCADE ON DELETE RESTRICT
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_order_item_order ON order_item(order_id)');
        await connection.execute('CREATE INDEX idx_order_item_product ON order_item(product_id)');
        console.log('✅ Table order_item created');
        
        // Rail layer tables
        console.log('🔄 Creating rail layer tables...');
        
        // Train route table
        await connection.execute(`
            CREATE TABLE train_route (
                route_id VARCHAR(40) PRIMARY KEY,
                start_city VARCHAR(80) NOT NULL,
                end_city VARCHAR(80) NOT NULL,
                destinations TEXT
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table train_route created');
        
        // Train table
        await connection.execute(`
            CREATE TABLE train (
                train_id VARCHAR(40) PRIMARY KEY,
                capacity DECIMAL(12,4) NOT NULL CHECK (capacity > 0),
                notes VARCHAR(255)
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table train created');
        
        // Train trip table
        await connection.execute(`
            CREATE TABLE train_trip (
                trip_id VARCHAR(40) PRIMARY KEY,
                route_id VARCHAR(40) NOT NULL,
                train_id VARCHAR(40) NOT NULL,
                depart_time DATETIME NOT NULL,
                arrive_time DATETIME NOT NULL,
                capacity DECIMAL(12,4) NOT NULL CHECK (capacity > 0),
                capacity_used DECIMAL(12,4) NOT NULL DEFAULT 0 CHECK (capacity_used >= 0),
                store_id VARCHAR(40) NOT NULL,
                CONSTRAINT fk_tt_route FOREIGN KEY (route_id) REFERENCES train_route(route_id) ON DELETE RESTRICT,
                CONSTRAINT fk_tt_train FOREIGN KEY (train_id) REFERENCES train(train_id) ON DELETE RESTRICT,
                CONSTRAINT fk_tt_store FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE RESTRICT
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_train_trip_times ON train_trip(depart_time, arrive_time)');
        await connection.execute('CREATE INDEX idx_train_trip_route ON train_trip(route_id)');
        console.log('✅ Table train_trip created');
        
        // Train shipment table
        await connection.execute(`
            CREATE TABLE train_shipment (
                shipment_id VARCHAR(40) PRIMARY KEY,
                order_id VARCHAR(40) NOT NULL,
                trip_id VARCHAR(40) NOT NULL,
                allocated_space DECIMAL(12,4) NOT NULL CHECK (allocated_space > 0),
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_ts_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                CONSTRAINT fk_ts_trip FOREIGN KEY (trip_id) REFERENCES train_trip(trip_id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_train_shipment_order ON train_shipment(order_id)');
        await connection.execute('CREATE INDEX idx_train_shipment_trip ON train_shipment(trip_id)');
        console.log('✅ Table train_shipment created');
        
        // Road layer tables
        console.log('🔄 Creating road layer tables...');
        
        // Truck table
        await connection.execute(`
            CREATE TABLE truck (
                truck_id VARCHAR(40) PRIMARY KEY,
                license_plate VARCHAR(40) UNIQUE NOT NULL,
                capacity DECIMAL(12,4) NOT NULL CHECK (capacity > 0)
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table truck created');
        
        // Truck route table
        await connection.execute(`
            CREATE TABLE truck_route (
                route_id VARCHAR(40) PRIMARY KEY,
                store_id VARCHAR(40) NOT NULL,
                route_name VARCHAR(120) NOT NULL,
                max_minutes INT NOT NULL DEFAULT 240 CHECK (max_minutes > 0),
                CONSTRAINT fk_tr_store FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE RESTRICT
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_truck_route_store ON truck_route(store_id)');
        console.log('✅ Table truck_route created');
        
        // Driver table
        await connection.execute(`
            CREATE TABLE driver (
                driver_id VARCHAR(40) PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                address TEXT,
                phone_no VARCHAR(20),
                email VARCHAR(120) UNIQUE
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table driver created');
        
        // Assistant table
        await connection.execute(`
            CREATE TABLE assistant (
                assistant_id VARCHAR(40) PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                address TEXT,
                phone_no VARCHAR(20),
                email VARCHAR(120) UNIQUE
            ) ENGINE=InnoDB
        `);
        console.log('✅ Table assistant created');
        
        // Truck schedule table
        await connection.execute(`
            CREATE TABLE truck_schedule (
                truck_schedule_id VARCHAR(40) PRIMARY KEY,
                route_id VARCHAR(40) NOT NULL,
                truck_id VARCHAR(40) NOT NULL,
                driver_id VARCHAR(40) NOT NULL,
                assistant_id VARCHAR(40) NOT NULL,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                CONSTRAINT fk_ts_route FOREIGN KEY (route_id) REFERENCES truck_route(route_id) ON DELETE RESTRICT,
                CONSTRAINT fk_ts_truck FOREIGN KEY (truck_id) REFERENCES truck(truck_id) ON DELETE RESTRICT,
                CONSTRAINT fk_ts_driver FOREIGN KEY (driver_id) REFERENCES driver(driver_id) ON DELETE RESTRICT,
                CONSTRAINT fk_ts_assistant FOREIGN KEY (assistant_id) REFERENCES assistant(assistant_id) ON DELETE RESTRICT,
                CONSTRAINT chk_ts_time CHECK (end_time > start_time)
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_truck_schedule_time ON truck_schedule(start_time, end_time)');
        await connection.execute('CREATE INDEX idx_truck_schedule_truck ON truck_schedule(truck_id)');
        await connection.execute('CREATE INDEX idx_truck_schedule_driver ON truck_schedule(driver_id)');
        await connection.execute('CREATE INDEX idx_truck_schedule_assistant ON truck_schedule(assistant_id)');
        console.log('✅ Table truck_schedule created');
        
        // Truck delivery table
        await connection.execute(`
            CREATE TABLE truck_delivery (
                delivery_id VARCHAR(40) PRIMARY KEY,
                truck_schedule_id VARCHAR(40) NOT NULL,
                order_id VARCHAR(40) NOT NULL,
                delivered_at DATETIME NULL,
                CONSTRAINT fk_td_ts FOREIGN KEY (truck_schedule_id) REFERENCES truck_schedule(truck_schedule_id) ON DELETE CASCADE,
                CONSTRAINT fk_td_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        await connection.execute('CREATE INDEX idx_truck_delivery_order ON truck_delivery(order_id)');
        console.log('✅ Table truck_delivery created');
        
        // Insert sample data
        console.log('🔄 Inserting sample data...');
        
        // Admin data
        await connection.execute(`
            INSERT INTO admin (admin_id, name, password) VALUES 
            ('ADM001', 'System Administrator', 'admin123')
        `);
        
        // Store data
        await connection.execute(`
            INSERT INTO store (store_id, name, city) VALUES
            ('ST_COL', 'Colombo Central Store', 'Colombo'),
            ('ST_NEG', 'Negombo Station Store', 'Negombo'),
            ('ST_GAL', 'Galle Station Store', 'Galle'),
            ('ST_KAN', 'Kandy HQ Store', 'Kandy')
        `);
        
        // Customer data
        await connection.execute(`
            INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) VALUES
            ('CUS001','John Doe', '+94771234567','Colombo','123 Galle Rd, Colombo 03','john', 'hash1'),
            ('CUS002','Jane Smith', '+94772345678','Kandy', '456 Peradeniya Rd, Kandy','jane', 'hash2')
        `);
        
        // Product data
        await connection.execute(`
            INSERT INTO product (product_id, name, description, price, space_consumption, category, available_quantity) VALUES
            ('P001','Detergent Box','1kg box', 600.00, 0.50, 'FMCG', 200),
            ('P002','Shampoo Pack','500ml', 450.00, 0.20, 'FMCG', 300),
            ('P003','Soap Carton','20 bars', 1200.00, 1.00, 'FMCG', 150)
        `);
        
        // Train infrastructure
        await connection.execute(`
            INSERT INTO train_route (route_id, start_city, end_city, destinations) VALUES
            ('R_KAN_COL','Kandy','Colombo','Kegalle,Ragama'),
            ('R_KAN_GAL','Kandy','Galle','Aluthgama')
        `);
        
        await connection.execute(`
            INSERT INTO train (train_id, capacity, notes) VALUES
            ('TR100', 200.0000, 'Bulk cargo'),
            ('TR200', 150.0000, 'Mixed cargo')
        `);
        
        // Truck infrastructure
        await connection.execute(`
            INSERT INTO truck (truck_id, license_plate, capacity) VALUES
            ('TK01', 'WP-1234', 60.0),
            ('TK02', 'WP-5678', 60.0)
        `);
        
        await connection.execute(`
            INSERT INTO driver (driver_id, name, phone_no) VALUES
            ('DRV001','John Driver','+94770000001'),
            ('DRV002','Jane Transport','+94770000002')
        `);
        
        await connection.execute(`
            INSERT INTO assistant (assistant_id, name, phone_no) VALUES
            ('AST001','Sarah Support','+94770000003'),
            ('AST002','David Logistics','+94770000004')
        `);
        
        await connection.execute(`
            INSERT INTO truck_route (route_id, store_id, route_name, max_minutes) VALUES
            ('TR_COL_01','ST_COL','Colombo City North', 240),
            ('TR_COL_02','ST_COL','Colombo City South', 240),
            ('TR_GAL_01','ST_GAL','Galle Town', 240)
        `);
        
        console.log('✅ Sample data inserted');
        
        // Create basic views for reporting
        console.log('🔄 Creating reporting views...');
        
        await connection.execute(`
            CREATE VIEW v_order_totals AS
            SELECT
                oi.order_id,
                SUM(oi.quantity * oi.unit_price) AS order_amount,
                SUM(oi.quantity * p.space_consumption) AS required_space
            FROM order_item oi
            JOIN product p ON p.product_id = oi.product_id
            GROUP BY oi.order_id
        `);
        console.log('✅ View v_order_totals created');
        
        await connection.execute(`
            CREATE VIEW v_quarterly_sales AS
            SELECT
                CONCAT(YEAR(o.order_date), '-Q', QUARTER(o.order_date)) AS quarter,
                SUM(ot.order_amount) AS total_value,
                SUM(ot.required_space) AS total_space_units,
                COUNT(DISTINCT o.order_id) AS orders
            FROM orders o
            JOIN v_order_totals ot ON ot.order_id = o.order_id
            GROUP BY YEAR(o.order_date), QUARTER(o.order_date)
        `);
        console.log('✅ View v_quarterly_sales created');
        
        // Verify the new schema
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('\n📋 Advanced schema tables created:');
        tables.forEach(table => {
            console.log(`  ✅ ${Object.values(table)[0]}`);
        });
        
        await connection.end();
        
        console.log('\n🎉 Advanced Rail & Road Distribution Schema created successfully!');
        console.log('✅ Features included:');
        console.log('  - Comprehensive train route and trip management');
        console.log('  - Capacity-aware train shipment allocation');
        console.log('  - Detailed truck scheduling infrastructure');
        console.log('  - Driver and assistant management');
        console.log('  - Space consumption tracking for products');
        console.log('  - Basic reporting views');
        console.log('\n📝 Note: Complex stored procedures and triggers were simplified for compatibility');
        
    } catch (error) {
        console.error('❌ Schema creation failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    createAdvancedSchema();
}

module.exports = { createAdvancedSchema };