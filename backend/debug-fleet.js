const mysql = require('mysql2/promise');
require('dotenv').config();

async function testFleetQuery() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('🧪 Testing fleet query...');

        // Test the fleet query from dashboard.js
        const query = `
            SELECT 
                d.driver_id,
                d.name,
                d.status,
                d.current_location as location,
                t.plate_no as vehicle,
                (SELECT COUNT(*) FROM orders WHERE customer_id = d.driver_id) as orders,
                d.rating,
                'driver' as role
            FROM driver d 
            LEFT JOIN truck t ON d.assigned_vehicle_id = t.truck_id
        `;

        const [result] = await connection.execute(query);
        console.log('✅ Fleet query result:', JSON.stringify(result, null, 2));

        await connection.end();
        
    } catch (error) {
        console.error('❌ Fleet query error:', error.message);
    }
}

testFleetQuery();