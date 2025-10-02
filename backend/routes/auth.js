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
    let usernameField = '';

    // Determine table and fields based on role
    switch (role) {
      case 'customer':
        table = 'customer';
        userIdField = 'customer_id';
        usernameField = 'user_name';
        break;
      case 'admin':
        table = 'admin';
        userIdField = 'admin_id';
        usernameField = 'admin_id'; // admin uses admin_id as username
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
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    try {
      // Query database for user
      const [userRecord] = await database.query(
        `SELECT ${userIdField} as id, name, ${usernameField} as username, password FROM ${table} WHERE ${usernameField} = ?`,
        [username]
      );

      if (!userRecord) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password using bcrypt
      const isValidPassword = await bcrypt.compare(password, userRecord.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      user = userRecord;
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

    // Generate token
    const token = generateToken({
      [userIdField]: user.id,
      user_name: user.username,
      name: user.name,
      role: role
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: { 
        ...userWithoutPassword, 
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
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;