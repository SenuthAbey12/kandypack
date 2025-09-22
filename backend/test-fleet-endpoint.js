const mysql = require('mysql2/promise');
require('dotenv').config();

async function testFleetEndpoint() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('🧪 Testing exact fleet endpoint queries...');

        // Test the exact queries from the fleet endpoint
        try {
            const [drivers] = await connection.execute(`
                SELECT 
                    d.driver_id as id, 
                    d.name, 
                    d.phone_no as license, 
                    t.plate_no as vehicle, 
                    t.type, 
                    d.status, 
                    d.current_location as location, 
                    d.rating,
                    0 as orders,
                    t.fuel_level as fuelLevel,
                    t.last_maintenance as lastMaintenance
                FROM driver d 
                LEFT JOIN truck t ON d.assigned_vehicle_id = t.truck_id
            `);
            console.log('✅ Drivers query successful:', drivers.length, 'drivers');

            const [[totalVehicles]] = await connection.execute("SELECT COUNT(*) as count FROM truck");
            console.log('✅ Total vehicles query successful:', totalVehicles);

            const [[totalDrivers]] = await connection.execute("SELECT COUNT(*) as count FROM driver");
            console.log('✅ Total drivers query successful:', totalDrivers);

            const result = {
                drivers,
                stats: {
                    totalVehicles: totalVehicles.count,
                    totalDrivers: totalDrivers.count,
                }
            };

            console.log('🎉 Fleet endpoint would return:', JSON.stringify(result, null, 2));

        } catch (queryError) {
            console.error('❌ Query error:', queryError.message);
        }

        await connection.end();
        
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
}

testFleetEndpoint();