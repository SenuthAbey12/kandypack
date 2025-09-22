const mysql = require('mysql2/promise');
require('dotenv').config();

async function addDriverColumns() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('📊 Adding missing columns to driver table...');

        // Add status column
        try {
            await connection.execute('ALTER TABLE driver ADD COLUMN status ENUM("available", "on-duty", "en-route", "offline") DEFAULT "available"');
            console.log('✅ Added status column');
        } catch(e) {
            console.log('ℹ️ Status column already exists');
        }

        // Add assigned_vehicle_id column
        try {
            await connection.execute('ALTER TABLE driver ADD COLUMN assigned_vehicle_id INT');
            console.log('✅ Added assigned_vehicle_id column');
        } catch(e) {
            console.log('ℹ️ assigned_vehicle_id column already exists');
        }

        // Add current_location column
        try {
            await connection.execute('ALTER TABLE driver ADD COLUMN current_location VARCHAR(100) DEFAULT "Depot"');
            console.log('✅ Added current_location column');
        } catch(e) {
            console.log('ℹ️ current_location column already exists');
        }

        // Add rating column
        try {
            await connection.execute('ALTER TABLE driver ADD COLUMN rating DECIMAL(3,2) DEFAULT 4.5');
            console.log('✅ Added rating column');
        } catch(e) {
            console.log('ℹ️ rating column already exists');
        }

        // Update some sample data
        await connection.execute('UPDATE driver SET status = "on-duty", assigned_vehicle_id = 1, current_location = "Colombo 03", rating = 4.9 WHERE driver_id = "DRV001"');
        await connection.execute('UPDATE driver SET status = "en-route", assigned_vehicle_id = 2, current_location = "Kandy", rating = 4.7 WHERE driver_id = "DRV002"');
        await connection.execute('UPDATE driver SET status = "available", assigned_vehicle_id = 3, current_location = "Depot", rating = 4.8 WHERE driver_id = "DRV003"');
        await connection.execute('UPDATE driver SET status = "offline", assigned_vehicle_id = 4, current_location = "Rest Area", rating = 4.6 WHERE driver_id = "DRV004"');
        
        console.log('✅ Updated driver sample data');

        await connection.end();
        console.log('🎉 Driver table updated successfully!');
        
    } catch (error) {
        console.error('❌ Error updating driver table:', error.message);
    }
}

addDriverColumns();