// setupUsers.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function insertDefaultUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kandypack',
  });

  try {
    // ===== ADMIN =====
    const adminName = 'admin';
    const adminPassword = 'admin123';
    const [adminRows] = await connection.execute(
      `SELECT admin_id FROM admin WHERE name = ?`,
      [adminName]
    );
    if (adminRows.length === 0) {
      const hashedAdminPw = await bcrypt.hash(adminPassword, 10);
      const adminId = uuidv4().slice(0, 20);
      await connection.execute(
        `INSERT INTO admin (admin_id, name, password) VALUES (?, ?, ?)`,
        [adminId, adminName, hashedAdminPw]
      );
      console.log(`✅ Admin "${adminName}" inserted successfully`);
    } else {
      console.log(`⚠️ Admin "${adminName}" already exists`);
    }

    // ===== DRIVER =====
    const driverUserName = 'driver';
    const driverEmail = 'driver1@example.com';
    const driverPassword = 'driver123';
    const [driverRows] = await connection.execute(
      `SELECT driver_id FROM driver WHERE user_name = ? OR email = ?`,
      [driverUserName, driverEmail]
    );
    if (driverRows.length === 0) {
      const hashedDriverPw = await bcrypt.hash(driverPassword, 10);
      const driverId = uuidv4().slice(0, 20);
      await connection.execute(
        `INSERT INTO driver (driver_id, name, address, phone_no, email, user_name, password)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          driverId,
          'driver',
          'N/A',
          '0770000000',
          driverEmail,
          driverUserName,
          hashedDriverPw
        ]
      );
      console.log(`✅ Driver "${driverUserName}" inserted successfully`);
    } else {
      console.log(`⚠️ Driver "${driverUserName}" already exists`);
    }

    // ===== ASSISTANT =====
    const assistantUserName = 'assistant';
    const assistantEmail = 'assistant1@example.com';
    const assistantPassword = 'assistant123';
    const [assistantRows] = await connection.execute(
      `SELECT assistant_id FROM assistant WHERE user_name = ? OR email = ?`,
      [assistantUserName, assistantEmail]
    );
    if (assistantRows.length === 0) {
      const hashedAssistantPw = await bcrypt.hash(assistantPassword, 10);
      const assistantId = uuidv4().slice(0, 20);
      await connection.execute(
        `INSERT INTO assistant (assistant_id, name, address, phone_no, email, user_name, password)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          assistantId,
          'assistant',
          'N/A',
          '0710000000',
          assistantEmail,
          assistantUserName,
          hashedAssistantPw
        ]
      );
      console.log(`✅ Assistant "${assistantUserName}" inserted successfully`);
    } else {
      console.log(`⚠️ Assistant "${assistantUserName}" already exists`);
    }

  } catch (err) {
    console.error('❌ Error inserting default users:', err);
  } finally {
    await connection.end();
  }
}
module.exports = insertDefaultUsers;

