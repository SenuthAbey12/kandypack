const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
  try {
    // Create connection using the same config as the app
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'hm$$mnmPP2003ML',
      database: process.env.DB_NAME || 'kandypack',
      port: Number(process.env.DB_PORT || 3306)
    });

    console.log('✅ Database connection successful');

    // Check if admin user exists
    const [adminRows] = await connection.execute(
      'SELECT admin_id, name FROM admin WHERE admin_id = ?',
      ['admin']
    );
    
    console.log('Admin user check:', adminRows.length > 0 ? 'Found' : 'NOT FOUND');
    if (adminRows.length > 0) {
      console.log('Admin data:', adminRows[0]);
    }

    // Check if customer john exists
    const [customerRows] = await connection.execute(
      'SELECT customer_id, name, user_name FROM customer WHERE user_name = ?',
      ['john']
    );
    
    console.log('Customer john check:', customerRows.length > 0 ? 'Found' : 'NOT FOUND');
    if (customerRows.length > 0) {
      console.log('Customer data:', customerRows[0]);
    }

    // List all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Available tables:', tables.map(t => Object.values(t)[0]));

    await connection.end();
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  }
}

testDatabase();