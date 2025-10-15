const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
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
        name: [rules.required('Name is required'), rules.minLen(2)],
        user_name: [rules.required('Username is required'), rules.minLen(3)],
        password: [rules.required('Password is required'), rules.minLen(6)]
      }
    );

    if (errors.length) return res.status(400).json({ error: errors[0], errors });

    const existingUser = await database.query(
      'SELECT user_name FROM customer WHERE user_name = ?',
      [user_name]
    );

    if (existingUser.length > 0) return res.status(409).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer_id = `CUS${Date.now().toString().slice(-6)}`;

    await database.query(
      `INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, name, phone_no, city, address, user_name, hashedPassword]
    );

    const [newUser] = await database.query(
      'SELECT customer_id, name, phone_no, city, address, user_name FROM customer WHERE customer_id = ?',
      [customer_id]
    );

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

// Universal Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role, portalType } = req.body;

    const errors = validate(
      { username, password, role },
      {
        username: [rules.required(), rules.minLen(3)],
        password: [rules.required(), rules.minLen(6)],
        role: [rules.required(), rules.oneOf(['customer','admin','driver','assistant'])]
      }
    );
    if (errors.length) return res.status(400).json({ error: errors[0], errors });

    let table, userIdField;
    switch (role) {
      case 'customer': table = 'customer'; userIdField = 'customer_id'; break;
      case 'admin': table = 'admin'; userIdField = 'admin_id'; break;
      case 'driver': table = 'driver'; userIdField = 'driver_id'; break;
      case 'assistant': table = 'assistant'; userIdField = 'assistant_id'; break;
      default: return res.status(400).json({ error: 'Invalid role' });
    }

    let query, params;
    if (role === 'admin') {
      query = `SELECT ${userIdField} as id, name, ${userIdField} as username, password FROM ${table} WHERE name = ?`;
      params = [username];
    } else if (role === 'driver' || role === 'assistant') {
      query = `SELECT ${userIdField} as id, name, user_name, email, password FROM ${table} WHERE ${userIdField} = ? OR user_name = ? OR email = ?`;
      params = [username, username, username];
    } else {
      query = `SELECT ${userIdField} as id, name, user_name as username, password FROM ${table} WHERE user_name = ?`;
      params = [username];
    }

    const [userRecord] = await database.query(query, params);
    if (!userRecord || !userRecord.password) return res.status(401).json({ error: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, userRecord.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const finalPortalType = portalType === 'auto' ? (role === 'customer' ? 'customer' : 'employee') : (portalType || (role === 'customer' ? 'customer' : 'employee'));
    const tokenUsername = role === 'customer' ? userRecord.username : (userRecord.user_name || userRecord.username || userIdField);
    const token = generateToken({ [userIdField]: userRecord.id, user_name: tokenUsername, name: userRecord.name, role });

    const { password: _, ...userWithoutPassword } = userRecord;
    res.json({
      message: 'Login successful',
      user: { ...userWithoutPassword, username: tokenUsername, role, portalType: finalPortalType, isAdmin: role === 'admin', isCustomer: role === 'customer', isDriver: role === 'driver', isAssistant: role === 'assistant', isEmployee: finalPortalType === 'employee' },
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
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'Server configuration error' });

    const decoded = jwt.verify(token, secret);

    let table, userIdField, usernameField;
    switch (decoded.role) {
      case 'customer': table = 'customer'; userIdField = 'customer_id'; usernameField = 'user_name'; break;
      case 'admin': table = 'admin'; userIdField = 'admin_id'; usernameField = 'admin_id'; break;
      case 'driver': table = 'driver'; userIdField = 'driver_id'; usernameField = 'user_name'; break;
      case 'assistant': table = 'assistant'; userIdField = 'assistant_id'; usernameField = 'user_name'; break;
      default: return res.status(401).json({ error: 'Invalid role in token' });
    }

    const [user] = await database.query(`SELECT ${userIdField} as id, name, ${usernameField} as username FROM ${table} WHERE ${userIdField} = ?`, [decoded.id]);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const portalType = decoded.role === 'customer' ? 'customer' : 'employee';
    res.json({ user: { ...user, role: decoded.role, portalType, isAdmin: decoded.role === 'admin', isCustomer: decoded.role === 'customer', isDriver: decoded.role === 'driver', isAssistant: decoded.role === 'assistant', isEmployee: portalType === 'employee' }, valid: true });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
