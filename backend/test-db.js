const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
    console.log('🔍 Testing database connection...');
    console.log('🔑 DB_HOST:', process.env.DB_HOST);
    console.log('👤 DB_USER:', process.env.DB_USER);
    console.log('📂 DB_NAME:', process.env.DB_NAME);
    console.log('🌐 DB_PORT:', process.env.DB_PORT);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'kandypack',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Database connection successful!');
        
        // Test a simple query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Simple query successful:', rows);

        // Test if our tables exist
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));

        await connection.end();
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('🔴 Full error:', error);
    }
}


testDatabaseConnection();