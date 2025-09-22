const db = require('./config/database');

async function testDatabaseQuery() {
    try {
        console.log('🧪 Testing db.query (exactly like Express route)...');
        
        // Test the exact same query as in the route
        const drivers = await db.query(`
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
        
        console.log('✅ db.query drivers result:', JSON.stringify(drivers, null, 2));

        const totalVehicles = await db.query("SELECT COUNT(*) as count FROM truck");
        console.log('✅ db.query totalVehicles result:', totalVehicles);

        const totalDrivers = await db.query("SELECT COUNT(*) as count FROM driver");  
        console.log('✅ db.query totalDrivers result:', totalDrivers);

        console.log('🎉 All db.query tests successful!');
        
    } catch (error) {
        console.error('❌ db.query error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testDatabaseQuery();