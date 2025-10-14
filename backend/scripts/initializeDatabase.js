const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Create initial connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created or verified`);

    // Switch to the database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Read and execute the SQL setup file
    const fs = require('fs').promises;
    const setupSQL = await fs.readFile('./setup_database.sql', 'utf8');
    
    // Split and execute SQL commands
    const commands = setupSQL.split(';').filter(cmd => cmd.trim());
    for (let command of commands) {
      if (command.trim()) {
        await connection.query(command);
      }
    }

    console.log('Database schema and initial structure created successfully');
    
    // Close connection
    await connection.end();
    console.log('Database initialization completed');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();