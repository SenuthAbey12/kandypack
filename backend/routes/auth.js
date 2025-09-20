const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.customer_id || user.admin_id, 
      username: user.user_name || user.admin_id,
      role: user.role || (user.admin_id ? 'admin' : 'customer'),
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Customer Registration
router.post('/register', async (req, res) => {
  try {
    const { name, phone_no, city, address, user_name, password } = req.body;

    // Validate required fields
    if (!name || !user_name || !password) {
      return res.status(400).json({ 
        error: 'Name, username, and password are required' 
      });
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate customer ID
    const customer_id = `CUST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
    const token = generateToken({ ...newUser, role: 'customer' });

    res.status(201).json({
      message: 'Customer registered successfully',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Customer/Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ 
        error: 'Username, password, and role are required' 
      });
    }

    let user = null;
    let table = '';
    let userIdField = '';
    let usernameField = '';

    if (role === 'customer') {
      table = 'customer';
      userIdField = 'customer_id';
      usernameField = 'user_name';
    } else if (role === 'admin') {
      table = 'admin';
      userIdField = 'admin_id';
      usernameField = 'admin_id'; // admin uses admin_id as username
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    try {
      // Try database query first
      const [userRecord] = await database.query(
        `SELECT ${userIdField} as id, name, password, ${usernameField} as username FROM ${table} WHERE ${usernameField} = ?`,
        [username]
      );

      if (!userRecord) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userRecord.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      user = userRecord;
    } catch (dbError) {
      // Fallback to mock authentication for development
      console.log('Database unavailable, using mock authentication');
      
      if (role === 'admin' && username === 'admin' && password === 'password') {
        user = {
          id: 'ADM001',
          username: 'admin',
          name: 'System Administrator'
        };
      } else if (role === 'customer' && username === 'customer' && password === 'customer123') {
        user = {
          id: 'CUST_MOCK_001',
          username: 'customer',
          name: 'John Doe'
        };
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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
      user: { ...userWithoutPassword, role },
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get fresh user data
    let user = null;
    if (decoded.role === 'customer') {
      [user] = await database.query(
        'SELECT customer_id as id, name, phone_no, city, address, user_name as username FROM customer WHERE customer_id = ?',
        [decoded.id]
      );
    } else if (decoded.role === 'admin') {
      [user] = await database.query(
        'SELECT admin_id as id, name, admin_id as username FROM admin WHERE admin_id = ?',
        [decoded.id]
      );
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ 
      user: { ...user, role: decoded.role },
      valid: true 
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;