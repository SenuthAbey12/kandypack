const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertSampleData() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('📊 Inserting sample data...');

        // Insert sample trucks
        const truckData = [
            ['CAB-1234', 'road', 5000, 85, '2024-01-15', 'active', '45 km/h'],
            ['CAC-5678', 'road', 3000, 60, '2024-01-10', 'active', '60 km/h'],
            ['CAE-9101', 'road', 7000, 95, '2024-01-20', 'active', '0 km/h'],
            ['CAF-1122', 'road', 2500, 40, '2024-01-08', 'active', '35 km/h'],
            ['TE-001', 'rail', 15000, 90, '2024-01-22', 'active', '80 km/h'],
            ['TE-002', 'rail', 15000, 75, '2024-01-19', 'active', '85 km/h']
        ];

        for (const truck of truckData) {
            await connection.execute(
                'INSERT INTO truck (plate_no, type, capacity, fuel_level, last_maintenance, status, speed) VALUES (?, ?, ?, ?, ?, ?, ?)',
                truck
            );
        }
        console.log('✅ Inserted truck data');

        // Insert sample routes
        const routeData = [
            ['Colombo-Kandy', 'Colombo', 'Kandy', '115 km', 'road', 'active', 94, 2.35],
            ['Kandy-Galle', 'Kandy', 'Galle', '220 km', 'road', 'active', 85, 2.45],
            ['Colombo-Jaffna', 'Colombo', 'Jaffna', '400 km', 'road', 'issue', 72, 2.65],
            ['Main Railway Line', 'Colombo', 'Badulla', '290 km', 'rail', 'active', 96, 1.85],
            ['Coastal Line', 'Colombo', 'Matara', '160 km', 'rail', 'active', 92, 1.95],
            ['Local Delivery Zone 1', 'Depot A', 'Zone 1', '45 km', 'road', 'active', 98, 3.10]
        ];

        for (const route of routeData) {
            await connection.execute(
                'INSERT INTO routes (name, start_location, end_location, distance, type, status, on_time_performance, cost_per_mile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                route
            );
        }
        console.log('✅ Inserted routes data');

        // Insert sample warehouses
        const warehouseData = [
            ['Colombo Main', 'Colombo', 10000, 87.5, 'active'],
            ['Kandy Hub', 'Kandy', 7500, 82.7, 'active'],
            ['Galle Depot', 'Galle', 5000, 76.0, 'inactive'],
            ['Jaffna Logistics', 'Jaffna', 6000, 95.2, 'active']
        ];

        for (const warehouse of warehouseData) {
            await connection.execute(
                'INSERT INTO warehouses (name, location, capacity, utilization, status) VALUES (?, ?, ?, ?, ?)',
                warehouse
            );
        }
        console.log('✅ Inserted warehouses data');

        // Insert sample inventory
        const inventoryData = [
            ['SKU001', 'Heavy Duty Boxes', 'Packaging', 150, 'in-stock'],
            ['SKU002', 'Bubble Wrap Roll', 'Packaging', 45, 'low-stock'],
            ['SKU003', 'Electronics Crate', 'Containers', 75, 'in-stock'],
            ['SKU004', 'Wooden Pallets', 'Logistics', 0, 'out-of-stock'],
            ['SKU005', 'Packing Tape', 'Supplies', 250, 'in-stock'],
            ['SKU006', 'Fragile Stickers', 'Supplies', 30, 'low-stock']
        ];

        for (const item of inventoryData) {
            await connection.execute(
                'INSERT INTO inventory (sku, name, category, stock_level, status) VALUES (?, ?, ?, ?, ?)',
                item
            );
        }
        console.log('✅ Inserted inventory data');

        // Insert sample inventory turnover data
        const turnoverData = [
            [1, 8.5, '2024-01-01', '2024-01-31'],
            [2, 6.2, '2024-01-01', '2024-01-31'],
            [3, 9.1, '2024-01-01', '2024-01-31'],
            [4, 4.3, '2024-01-01', '2024-01-31'],
            [5, 12.7, '2024-01-01', '2024-01-31'],
            [6, 7.8, '2024-01-01', '2024-01-31']
        ];

        for (const turnover of turnoverData) {
            await connection.execute(
                'INSERT INTO inventory_turnover (item_id, turnover_rate, period_start, period_end) VALUES (?, ?, ?, ?)',
                turnover
            );
        }
        console.log('✅ Inserted inventory turnover data');

        // Update driver table to add assigned_vehicle_id and other missing fields
        try {
            await connection.execute('ALTER TABLE driver ADD COLUMN IF NOT EXISTS assigned_vehicle_id INT');
            await connection.execute('ALTER TABLE driver ADD COLUMN IF NOT EXISTS current_location VARCHAR(100) DEFAULT "Depot"');
            await connection.execute('ALTER TABLE driver ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 4.5');
            await connection.execute('ALTER TABLE driver ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT "driver"');
            console.log('✅ Updated driver table structure');

            // Assign vehicles to drivers
            await connection.execute('UPDATE driver SET assigned_vehicle_id = 1, current_location = "Colombo 03", rating = 4.9 WHERE driver_id = 1');
            await connection.execute('UPDATE driver SET assigned_vehicle_id = 2, current_location = "Kandy", rating = 4.7 WHERE driver_id = 2');
            await connection.execute('UPDATE driver SET assigned_vehicle_id = 3, current_location = "Depot", rating = 4.8 WHERE driver_id = 3');
            await connection.execute('UPDATE driver SET assigned_vehicle_id = 4, current_location = "Rest Area", rating = 4.6 WHERE driver_id = 4');
            console.log('✅ Updated driver assignments');
        } catch (error) {
            console.log('⚠️ Driver table updates (might already exist):', error.message);
        }

        await connection.end();
        console.log('🎉 All sample data inserted successfully!');
        
    } catch (error) {
        console.error('❌ Error inserting sample data:', error.message);
    }
}

insertSampleData();