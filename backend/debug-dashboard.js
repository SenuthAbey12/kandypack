const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDashboardQueries() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('🧪 Testing individual dashboard queries...');

        // Test each query from the stats endpoint
        const queries = [
            ["SELECT COUNT(*) as count FROM orders", "totalOrders"],
            ["SELECT COUNT(*) as count FROM driver", "totalDrivers"],
            ["SELECT COUNT(*) as count FROM assistant", "totalAssistants"],
            ["SELECT COUNT(*) as count FROM customer", "totalCustomers"],
            ["SELECT COUNT(*) as count FROM orders WHERE order_status = 'Pending'", "pendingOrders"],
            ["SELECT COUNT(*) as count FROM orders WHERE order_status = 'Delivered' AND DATE(order_date) = CURDATE()", "completedToday"],
            ["SELECT COUNT(*) as count FROM truck", "totalVehicles"],
            ["SELECT COUNT(*) as count FROM train_shipments", "railShipments"],
            ["SELECT COUNT(*) as count FROM truck_deliveries", "roadShipments"]
        ];

        for (const [query, name] of queries) {
            try {
                const [result] = await connection.execute(query);
                console.log(`✅ ${name}:`, result[0]);
            } catch (error) {
                console.error(`❌ ${name}:`, error.message);
            }
        }

        await connection.end();
        
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
    }
}

testDashboardQueries();