const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDashboardTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('🔍 Checking tables required for dashboard...');

        // Check each table we're using in dashboard routes
        const requiredTables = [
            'orders', 'driver', 'assistant', 'customer', 'truck', 
            'train_shipments', 'truck_deliveries', 'routes', 
            'warehouses', 'inventory'
        ];

        for (const table of requiredTables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`✅ ${table}: ${rows[0].count} records`);
            } catch (error) {
                console.log(`❌ ${table}: Table does not exist or error - ${error.message}`);
            }
        }

        await connection.end();
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

checkDashboardTables();