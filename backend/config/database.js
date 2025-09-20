const mysql = require('mysql2/promise');
const DatabaseTracker = require('../utils/databaseTracker');
require('dotenv').config();

// Helper to safely read env vars with trimming and fallback
const env = (val, fallback) => {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return trimmed.length ? trimmed : fallback;
  }
  return val ?? fallback;
};

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: env(process.env.DB_HOST, 'localhost'),
      user: env(process.env.DB_USER, 'root'),
      password: env(process.env.DB_PASSWORD, 'hm$$mnmPP2003ML'),
      database: env(process.env.DB_NAME, 'kandypack'),
      port: Number(env(process.env.DB_PORT, 3306)),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async query(sql, params = []) {
    let connection;
    try {
      connection = await this.getConnection();
      const [rows] = await connection.execute(sql, params);
      
      // Track database operations for automatic documentation updates
      const sqlUpper = sql.trim().toUpperCase();
      const isModifyingOperation = 
        sqlUpper.startsWith('INSERT') ||
        sqlUpper.startsWith('UPDATE') ||
        sqlUpper.startsWith('DELETE') ||
        sqlUpper.startsWith('ALTER') ||
        sqlUpper.startsWith('CREATE') ||
        sqlUpper.startsWith('DROP');
      
      if (isModifyingOperation) {
        const operation = sqlUpper.split(' ')[0].toLowerCase();
        const tableName = this.extractTableName(sql);
        DatabaseTracker.triggerUpdate(operation, tableName, 'auto-detected');
      }
      
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Extracts table name from SQL query
   */
  extractTableName(sql) {
    const sqlUpper = sql.trim().toUpperCase();
    
    if (sqlUpper.startsWith('INSERT INTO')) {
      const match = sql.match(/INSERT\s+INTO\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('UPDATE')) {
      const match = sql.match(/UPDATE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('DELETE FROM')) {
      const match = sql.match(/DELETE\s+FROM\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('ALTER TABLE')) {
      const match = sql.match(/ALTER\s+TABLE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('CREATE TABLE')) {
      const match = sql.match(/CREATE\s+TABLE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('DROP TABLE')) {
      const match = sql.match(/DROP\s+TABLE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    return 'unknown';
  }

  async testConnection() {
    try {
      const connection = await this.getConnection();
      await connection.execute('SELECT 1');
      connection.release();
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new Database();