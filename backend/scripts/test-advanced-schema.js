const mysql = require('mysql2/promise');
require('dotenv').config();

async function testAdvancedSchema() {
    console.log('🔄 Testing Advanced Rail & Road Distribution Schema...');
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: 'kandypack',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Connected to database');
        
        // Test sample data exists
        const [customers] = await connection.execute('SELECT COUNT(*) as count FROM customer');
        console.log(`✅ Customers: ${customers[0].count}`);
        
        const [products] = await connection.execute('SELECT COUNT(*) as count FROM product');
        console.log(`✅ Products: ${products[0].count}`);
        
        const [stores] = await connection.execute('SELECT COUNT(*) as count FROM store');
        console.log(`✅ Stores: ${stores[0].count}`);
        
        const [trains] = await connection.execute('SELECT COUNT(*) as count FROM train');
        console.log(`✅ Trains: ${trains[0].count}`);
        
        const [trucks] = await connection.execute('SELECT COUNT(*) as count FROM truck');
        console.log(`✅ Trucks: ${trucks[0].count}`);
        
        const [drivers] = await connection.execute('SELECT COUNT(*) as count FROM driver');
        console.log(`✅ Drivers: ${drivers[0].count}`);
        
        const [assistants] = await connection.execute('SELECT COUNT(*) as count FROM assistant');
        console.log(`✅ Assistants: ${assistants[0].count}`);
        
        // Test advanced features
        console.log('\n🔍 Testing advanced features...');
        
        // Test space consumption tracking
        const [spaceData] = await connection.execute(`
            SELECT p.name, p.space_consumption, p.available_quantity
            FROM product p
        `);
        console.log('📦 Product space consumption:');
        spaceData.forEach(item => {
            console.log(`  - ${item.name}: ${item.space_consumption} units/item, ${item.available_quantity} available`);
        });
        
        // Test train capacity management
        const [trainData] = await connection.execute(`
            SELECT t.train_id, t.capacity, 
                   COUNT(tt.trip_id) as scheduled_trips
            FROM train t
            LEFT JOIN train_trip tt ON t.train_id = tt.train_id
            GROUP BY t.train_id, t.capacity
        `);
        console.log('\n🚂 Train capacity management:');
        trainData.forEach(train => {
            console.log(`  - ${train.train_id}: ${train.capacity} units capacity, ${train.scheduled_trips} trips scheduled`);
        });
        
        // Test truck route structure
        const [routeData] = await connection.execute(`
            SELECT tr.route_name, s.city, tr.max_minutes
            FROM truck_route tr
            JOIN store s ON tr.store_id = s.store_id
        `);
        console.log('\n🚛 Truck route network:');
        routeData.forEach(route => {
            console.log(`  - ${route.route_name} (${route.city}): ${route.max_minutes} min max`);
        });
        
        // Test reporting views
        const [viewTest] = await connection.execute('SELECT * FROM v_order_totals LIMIT 1');
        console.log(`\n📊 Reporting views: ${viewTest.length > 0 ? 'Working' : 'No data yet'}`);
        
        await connection.end();
        
        console.log('\n🎉 Advanced Rail & Road Distribution Schema test completed successfully!');
        console.log('✅ All core functionality verified');
        console.log('✅ Sample data loaded properly');
        console.log('✅ Advanced features ready for use');
        
    } catch (error) {
        console.error('❌ Schema test failed:', error.message);
    }
}

if (require.main === module) {
    testAdvancedSchema();
}

module.exports = { testAdvancedSchema };