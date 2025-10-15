// adminSetup.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function insertAdminIfNotExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kandypack',
  });

  const name = 'Super Admin';       // admin name
  const plainPassword = 'admin123'; // admin password

  try {
    const [rows] = await connection.execute(
      `SELECT admin_id FROM admin WHERE name = ?`,
      [name]
    );

    if (rows.length > 0) {
      console.log(`⚠️ Admin "${name}" already exists`);
      await connection.end();
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const adminId = uuidv4().slice(0, 20);

    await connection.execute(
      `INSERT INTO admin (admin_id, name, password) VALUES (?, ?, ?)`,
      [adminId, name, hashedPassword]
    );

    console.log(`✅ Admin "${name}" inserted successfully`);
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

// Export the function
module.exports = insertAdminIfNotExists;
