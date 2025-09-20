const mysql = require('mysql2/promise');
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
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
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