const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 3306,
};

const createDatabase = async () => {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL server...');
    
    // Connect without database
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to MySQL server');
    
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'kandypack'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'kandypack'}' created or verified`);
    
    // Use the database
    await connection.execute(`USE ${process.env.DB_NAME || 'kandypack'}`);
    console.log(`✅ Using database '${process.env.DB_NAME || 'kandypack'}'`);
    
    // Create tables
    console.log('🔄 Creating tables...');
    
    // Admin table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        admin_id VARCHAR(8) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    
    // Customer table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customer (
        customer_id VARCHAR(40) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone_no VARCHAR(15),
        city VARCHAR(50),
        address VARCHAR(200),
        user_name VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    
    // Product table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product (
        product_id VARCHAR(40) PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        weight_per_item DECIMAL(8,2) NOT NULL,
        volume_per_item DECIMAL(8,2) NOT NULL,
        category VARCHAR(50),
        available_quantity INT DEFAULT 0
      )
    `);
    
    // Orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(40) PRIMARY KEY,
        customer_id VARCHAR(40),
        order_date DATETIME NOT NULL,
        destination_city VARCHAR(50),
        destination_address VARCHAR(200),
        total_weight DECIMAL(8,2),
        total_volume DECIMAL(8,2),
        order_status ENUM('Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
      )
    `);
    
    // Order items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_item (
        order_item_id VARCHAR(40) PRIMARY KEY,
        order_id VARCHAR(40),
        product_id VARCHAR(40),
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES product(product_id)
      )
    `);
    
    console.log('✅ Tables created successfully');
    
    // Insert sample data
    console.log('🔄 Inserting sample data...');
    
    // Check if admin exists
    const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM admin');
    if (adminRows[0].count === 0) {
      await connection.execute(`
        INSERT INTO admin (admin_id, name, password) VALUES 
        ('ADM001', 'System Administrator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
      `);
      console.log('✅ Sample admin created (username: admin, password: password)');
    }
    
    // Check if products exist
    const [productRows] = await connection.execute('SELECT COUNT(*) as count FROM product');
    if (productRows[0].count === 0) {
      await connection.execute(`
        INSERT INTO product (product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity) VALUES
        ('PROD_001', 'Premium Electronics Package', 'High-quality electronics with fast delivery', 299.99, 2.5, 0.02, 'Electronics', 50),
        ('PROD_002', 'Fashion Essentials', 'Trendy fashion accessories and clothing', 79.99, 0.5, 0.005, 'Fashion', 100),
        ('PROD_003', 'Home & Garden Supplies', 'Essential home improvement and garden items', 149.99, 5.0, 0.1, 'Home & Garden', 25),
        ('PROD_004', 'Books & Educational Media', 'Books, courses, and educational materials', 29.99, 0.8, 0.003, 'Books', 75),
        ('PROD_005', 'Sports Equipment', 'Quality sports gear and accessories', 199.99, 3.2, 0.05, 'Sports', 30)
      `);
      console.log('✅ Sample products created');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Demo Credentials:');
    console.log('👨‍💼 Admin Login: username=admin, password=password');
    console.log('👤 Customer Registration: Create new account or use API');
    console.log('');
    console.log('🚀 You can now start the backend server with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run setup
createDatabase();