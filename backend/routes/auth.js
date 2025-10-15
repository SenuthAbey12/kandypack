const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');
const { updateCredentialsFile } = require('../utils/credentialsManager');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(
    {
      id: user.customer_id || user.admin_id || user.driver_id || user.assistant_id,
      username: user.user_name || user.username,
      role: user.role,
      name: user.name,
      portalType: user.role === 'customer' ? 'customer' : 'employee'
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const { validate, rules } = require('../middleware/validation');

// Customer Registration
router.post('/register', async (req, res) => {
  try {
    const { name, phone_no, city, address, user_name, password } = req.body;

    const errors = validate(
      { name, user_name, password },
      {
        name: [rules.required('Name is required'), rules.minLen(2, 'Name must be at least 2 characters')],
        user_name: [rules.required('Username is required'), rules.minLen(3, 'Username must be at least 3 characters')],
        password: [rules.required('Password is required'), rules.minLen(6, 'Password must be at least 6 characters')]
      }
    );

    if (errors.length) {
      return res.status(400).json({ error: errors[0], errors });
    }

    // Check if username already exists
    const existingUser = await database.query(
      'SELECT user_name FROM customer WHERE user_name = ?',
      [user_name]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate customer ID
    const customer_id = `CUS${Date.now().toString().slice(-6)}`;

    // Insert new customer
    await database.query(
      `INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, name, phone_no, city, address, user_name, hashedPassword]
    );

    // Get the created user (without password)
    const [newUser] = await database.query(
      'SELECT customer_id, name, phone_no, city, address, user_name FROM customer WHERE customer_id = ?',
      [customer_id]
    );

    // Generate token
    const token = generateToken({ 
      customer_id: newUser.customer_id,
      user_name: newUser.user_name,
      name: newUser.name,
      role: 'customer'
    });

    res.status(201).json({
      message: 'Customer registered successfully',
      user: { ...newUser, role: 'customer', portalType: 'customer' },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Universal Login for all user types (customer, admin, driver, assistant)
router.post('/login', async (req, res) => {
  try {
    const { username, password, role, portalType } = req.body;
    const errors = validate(
      { username, password, role },
      {
        username: [rules.required('Username is required'), rules.minLen(3, 'Username must be at least 3 characters')],
        password: [rules.required('Password is required'), rules.minLen(6, 'Password must be at least 6 characters')],
        role: [rules.required('Role is required'), rules.oneOf(['customer','admin','driver','assistant'], 'Invalid role')]
      }
    );
    if (errors.length) {
      return res.status(400).json({ error: errors[0], errors });
    }

    let user = null;
    let table = '';
    let userIdField = '';

    // Determine table and fields based on role
    switch (role) {
      case 'customer':
        table = 'customer';
        userIdField = 'customer_id';
        break;
      case 'admin':
        table = 'admin';
        userIdField = 'admin_id';
        break;
      case 'driver':
        table = 'driver';
        userIdField = 'driver_id';
        break;
      case 'assistant':
        table = 'assistant';
        userIdField = 'assistant_id';
        break;
      default:
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    try {
      // Build query based on role - check multiple fields for flexibility
      let query, params;
      
      if (role === 'admin') {
        // Admin logs in with admin_id only
        query = `SELECT ${userIdField} as id, name, ${userIdField} as username, password FROM ${table} WHERE ${userIdField} = ?`;
        params = [username];
      } else if (role === 'driver') {
        // Driver can login with: driver_id, user_name (full name), or email
        query = `SELECT ${userIdField} as id, name, user_name, email, password FROM ${table} WHERE ${userIdField} = ? OR user_name = ? OR email = ?`;
        params = [username, username, username];
      } else if (role === 'assistant') {
        // Assistant can login with: assistant_id, user_name, or email
        query = `SELECT ${userIdField} as id, name, user_name, email, password FROM ${table} WHERE ${userIdField} = ? OR user_name = ? OR email = ?`;
        params = [username, username, username];
      } else if (role === 'customer') {
        // Customer logs in with user_name only
        query = `SELECT ${userIdField} as id, name, user_name as username, password FROM ${table} WHERE user_name = ?`;
        params = [username];
      }

      console.log(`[AUTH] Login attempt - Role: ${role}, Username: ${username}, Table: ${table}`);
      console.log(`[AUTH] Query params:`, params);
      
      const [userRecord] = await database.query(query, params);

      if (!userRecord) {
        console.log(`[AUTH] User not found in ${table} table`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if password field exists
      if (!userRecord.password) {
        console.error(`[AUTH] Password field missing for user ${username} in ${table} table`);
        return res.status(500).json({ error: 'Authentication configuration error. Please contact administrator.' });
      }

      // Verify password using bcrypt
      const isValidPassword = await bcrypt.compare(password, userRecord.password);
      if (!isValidPassword) {
        console.log(`[AUTH] Invalid password for user ${username}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      user = userRecord;
      console.log(`[AUTH] Login successful - User ID: ${user.id}, Name: ${user.name}, Role: ${role}`);
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Determine portal type
    const finalPortalType = portalType === 'auto' 
      ? (role === 'customer' ? 'customer' : 'employee')
      : (portalType || (role === 'customer' ? 'customer' : 'employee'));

    // Generate token with appropriate username field
    const tokenUsername = role === 'customer' ? user.username : (user.user_name || user.username || userIdField);
    
    const token = generateToken({
      [userIdField]: user.id,
      user_name: tokenUsername,
      name: user.name,
      role: role
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: { 
        ...userWithoutPassword,
        username: tokenUsername,
        role: role, 
        portalType: finalPortalType,
        isAdmin: role === 'admin',
        isCustomer: role === 'customer',
        isDriver: role === 'driver',
        isAssistant: role === 'assistant',
        isEmployee: finalPortalType === 'employee'
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, secret);
    
    // Get fresh user data based on role
    let user = null;
    let table = '';
    let userIdField = '';
    let usernameField = '';

    switch (decoded.role) {
      case 'customer':
        table = 'customer';
        userIdField = 'customer_id';
        usernameField = 'user_name';
        break;
      case 'admin':
        table = 'admin';
        userIdField = 'admin_id';
        usernameField = 'admin_id';
        break;
      case 'driver':
        table = 'driver';
        userIdField = 'driver_id';
        usernameField = 'user_name';
        break;
      case 'assistant':
        table = 'assistant';
        userIdField = 'assistant_id';
        usernameField = 'user_name';
        break;
      default:
        return res.status(401).json({ error: 'Invalid user role in token' });
    }

    try {
      [user] = await database.query(
        `SELECT ${userIdField} as id, name, ${usernameField} as username FROM ${table} WHERE ${userIdField} = ?`,
        [decoded.id]
      );
    } catch (dbError) {
      console.error('Database error during verification:', dbError);
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const portalType = decoded.role === 'customer' ? 'customer' : 'employee';

    res.json({ 
      user: { 
        ...user, 
        role: decoded.role,
        portalType: portalType,
        isAdmin: decoded.role === 'admin',
        isCustomer: decoded.role === 'customer',
        isDriver: decoded.role === 'driver',
        isAssistant: decoded.role === 'assistant',
        isEmployee: portalType === 'employee'
      },
      valid: true 
    });

  } catch (error) {
    console.error('Token verification error:', error);
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Fix Driver Usernames - Admin Route
router.post('/admin/fix-driver-usernames', async (req, res) => {
  try {
    console.log('Fixing driver usernames...\n');
    
    // Get all drivers
    const drivers = await database.query('SELECT driver_id, name, user_name FROM driver');
    console.log('Current driver data:');
    console.table(drivers);
    
    // Update each driver's user_name to match driver_id
    for (const driver of drivers) {
      if (driver.user_name !== driver.driver_id) {
        console.log(`Updating ${driver.driver_id}: "${driver.user_name}" → "${driver.driver_id}"`);
        await database.query(
          'UPDATE driver SET user_name = ? WHERE driver_id = ?',
          [driver.driver_id, driver.driver_id]
        );
      }
    }
    
    // Also ensure passwords are set (default: driver123)
    const defaultPassword = await bcrypt.hash('driver123', 10);
    await database.query(
      `UPDATE driver SET password = ? WHERE password IS NULL OR password = ''`,
      [defaultPassword]
    );
    
    console.log('\n✓ Driver usernames fixed!\n');
    
    // Show final result
    const updatedDrivers = await database.query(
      `SELECT driver_id, name, user_name, email, 
              CASE WHEN password IS NOT NULL AND password != '' THEN 'SET' ELSE 'NULL' END as password_status 
       FROM driver`
    );
    console.log('Updated driver data:');
    console.table(updatedDrivers);
    
    console.log('\n📝 Login credentials:');
    updatedDrivers.forEach(d => {
      console.log(`   Username: ${d.user_name} | Password: driver123`);
    });
    
    res.json({ message: 'Driver usernames fixed', updatedDrivers });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fix driver usernames' });
  }
});

// Reset Driver Password - Admin Route
router.post('/admin/reset-driver-password', async (req, res) => {
  try {
    const { driverId, newPassword } = req.body;

    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    // Check if driver exists
    const [driver] = await database.query(
      'SELECT driver_id, name FROM driver WHERE driver_id = ?',
      [driverId]
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await database.query(
      'UPDATE driver SET password = ? WHERE driver_id = ?',
      [hashedPassword, driverId]
    );

    res.json({ message: 'Password reset successful', driverId });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;