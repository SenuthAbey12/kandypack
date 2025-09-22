const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdditionalTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('📊 Creating additional tables for dashboard...');

        // Create train_shipments table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS train_shipments (
                shipment_id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                operator_id INT,
                train_number VARCHAR(50),
                departure_station VARCHAR(100),
                arrival_station VARCHAR(100),
                departure_time DATETIME,
                arrival_time DATETIME,
                status ENUM('scheduled', 'in-transit', 'delivered', 'delayed') DEFAULT 'scheduled',
                cargo_weight DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
                FOREIGN KEY (operator_id) REFERENCES driver(driver_id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Created train_shipments table');

        // Create truck_deliveries table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS truck_deliveries (
                delivery_id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                driver_id INT,
                truck_id INT,
                pickup_address TEXT,
                delivery_address TEXT,
                pickup_time DATETIME,
                delivery_time DATETIME,
                status ENUM('assigned', 'pickup', 'in-transit', 'delivered', 'failed') DEFAULT 'assigned',
                distance_km DECIMAL(8,2),
                fuel_cost DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
                FOREIGN KEY (driver_id) REFERENCES driver(driver_id) ON DELETE SET NULL,
                FOREIGN KEY (truck_id) REFERENCES truck(truck_id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Created truck_deliveries table');

        // Insert sample data for train_shipments
        const trainData = [
            [1, 1, 'T001', 'Colombo Fort', 'Kandy', '2024-01-25 08:00:00', '2024-01-25 11:30:00', 'delivered', 5000.00],
            [2, 2, 'T002', 'Kandy', 'Badulla', '2024-01-25 14:00:00', '2024-01-25 18:45:00', 'in-transit', 3500.00],
            [3, 1, 'T003', 'Colombo Fort', 'Matara', '2024-01-26 09:30:00', '2024-01-26 13:15:00', 'scheduled', 4200.00]
        ];

        for (const train of trainData) {
            try {
                await connection.execute(
                    'INSERT INTO train_shipments (order_id, operator_id, train_number, departure_station, arrival_station, departure_time, arrival_time, status, cargo_weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    train
                );
            } catch (error) {
                console.log('⚠️ Skipping train shipment (may reference non-existent order/operator)');
            }
        }
        console.log('✅ Inserted train shipments data');

        // Insert sample data for truck_deliveries  
        const truckDeliveryData = [
            [1, 1, 1, '123 Main St, Colombo', '456 Park Ave, Kandy', '2024-01-25 09:00:00', '2024-01-25 14:30:00', 'delivered', 115.5, 2500.00],
            [2, 2, 2, '789 Business Rd, Kandy', '321 Ocean View, Galle', '2024-01-25 10:30:00', null, 'in-transit', 220.8, 3200.00],
            [3, 3, 3, '555 Industrial Zone, Colombo', '777 Highland Rd, Nuwara Eliya', '2024-01-26 08:00:00', null, 'assigned', 180.2, 2800.00]
        ];

        for (const delivery of truckDeliveryData) {
            try {
                await connection.execute(
                    'INSERT INTO truck_deliveries (order_id, driver_id, truck_id, pickup_address, delivery_address, pickup_time, delivery_time, status, distance_km, fuel_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    delivery
                );
            } catch (error) {
                console.log('⚠️ Skipping truck delivery (may reference non-existent order/driver/truck)');
            }
        }
        console.log('✅ Inserted truck deliveries data');

        await connection.end();
        console.log('🎉 All additional tables created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating additional tables:', error.message);
    }
}

createAdditionalTables();