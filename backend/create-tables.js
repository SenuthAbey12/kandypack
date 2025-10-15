const mysql = require('mysql2/promise');
require('dotenv').config();

async function createMissingTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('🔧 Creating missing tables...');

        // Create truck table
        const createTruckTable = `
            CREATE TABLE IF NOT EXISTS truck (
                truck_id INT PRIMARY KEY AUTO_INCREMENT,
                plate_no VARCHAR(20) UNIQUE NOT NULL,
                type ENUM('road', 'rail') DEFAULT 'road',
                capacity INT,
                fuel_level INT DEFAULT 100,
                last_maintenance DATE,
                status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
                speed VARCHAR(20) DEFAULT '0 km/h',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create routes table  
        const createRoutesTable = `
            CREATE TABLE IF NOT EXISTS routes (
                route_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                start_location VARCHAR(100) NOT NULL,
                end_location VARCHAR(100) NOT NULL,
                distance VARCHAR(20),
                type ENUM('road', 'rail') DEFAULT 'road',
                status ENUM('active', 'inactive', 'issue') DEFAULT 'active',
                on_time_performance INT DEFAULT 85,
                cost_per_mile DECIMAL(10,2) DEFAULT 2.50,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create warehouses table
        const createWarehousesTable = `
            CREATE TABLE IF NOT EXISTS warehouses (
                warehouse_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                location VARCHAR(100) NOT NULL,
                capacity INT NOT NULL,
                utilization DECIMAL(5,2) DEFAULT 0.00,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create inventory table
        const createInventoryTable = `
            CREATE TABLE IF NOT EXISTS inventory (
                item_id INT PRIMARY KEY AUTO_INCREMENT,
                sku VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(50),
                stock_level INT DEFAULT 0,
                status ENUM('in-stock', 'low-stock', 'out-of-stock') DEFAULT 'in-stock',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create inventory_turnover table for analytics
        const createInventoryTurnoverTable = `
            CREATE TABLE IF NOT EXISTS inventory_turnover (
                id INT PRIMARY KEY AUTO_INCREMENT,
                item_id INT,
                turnover_rate DECIMAL(10,2) DEFAULT 0.00,
                period_start DATE,
                period_end DATE,
                FOREIGN KEY (item_id) REFERENCES inventory(item_id)
            )
        `;

        // Execute all CREATE TABLE statements
        await connection.execute(createTruckTable);
        console.log('✅ Created truck table');

        await connection.execute(createRoutesTable);
        console.log('✅ Created routes table');

        await connection.execute(createWarehousesTable);
        console.log('✅ Created warehouses table');

        await connection.execute(createInventoryTable);
        console.log('✅ Created inventory table');

        await connection.execute(createInventoryTurnoverTable);
        console.log('✅ Created inventory_turnover table');

        await connection.end();
        console.log('🎉 All missing tables created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
    }
}

createMissingTables();