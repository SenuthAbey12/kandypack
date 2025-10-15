const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/database');
const router = express.Router();

// Helper function to determine user table based on portal type and role
const getUserTable = (role) => {
  switch (role) {
    case 'admin': return 'admin';
    case 'customer': return 'customer';
    case 'driver': return 'drivers';
    case 'assistant': return 'assistants';
    default: return null;
  }
};

// Helper function to get ID field name based on role
const getIdField = (role) => {
  switch (role) {
    case 'admin': return 'admin_id';
    case 'customer': return 'customer_id';
    case 'driver': return 'driver_id';
    case 'assistant': return 'assistant_id';
    default: return 'id';
  }
};

// Portal-aware login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password, role, portalType } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and role are required'
      });
    }

    const tableName = getUserTable(role);
    const idField = getIdField(role);

    if (!tableName) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const db = await getDB();
    
    // For admin, look up by admin_id; for others, use email or username
    let query, params;
    if (role === 'admin') {
      query = `SELECT * FROM admin WHERE admin_id = ?`;
      params = [username];
    } else {
      query = `SELECT * FROM ${tableName} WHERE email = ? OR ${idField} = ?`;
      params = [username, username];
    }

    const [users] = await db.execute(query, params);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Determine portal type based on role if not specified
    const finalPortalType = portalType || (role === 'customer' ? 'customer' : 'employee');

    // Create JWT token
    const token = jwt.sign(
      {
        id: user[idField],
        role: role,
        portalType: finalPortalType,
        email: user.email || null
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    const userData = {
      ...userWithoutPassword,
      role: role,
      portalType: finalPortalType
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token: token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Token verification endpoint
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { id, role, portalType } = decoded;

    const tableName = getUserTable(role);
    const idField = getIdField(role);

    if (!tableName) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const db = await getDB();
    const [users] = await db.execute(
      `SELECT * FROM ${tableName} WHERE ${idField} = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    const { password: _, ...userWithoutPassword } = user;
    const userData = {
      ...userWithoutPassword,
      role: role,
      portalType: portalType
    };

    res.json({
      success: true,
      data: {
        user: userData
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Customer registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const db = await getDB();

    // Check if customer already exists
    const [existingUsers] = await db.execute(
      'SELECT customer_id FROM customer WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Generate customer ID
    const [lastCustomer] = await db.execute(
      'SELECT customer_id FROM customer ORDER BY customer_id DESC LIMIT 1'
    );
    
    let nextId = 1;
    if (lastCustomer.length > 0) {
      const lastId = parseInt(lastCustomer[0].customer_id.substring(3));
      nextId = lastId + 1;
    }
    
    const customerId = `CUS${nextId.toString().padStart(3, '0')}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new customer
    await db.execute(
      'INSERT INTO customer (customer_id, name, email, phone, password, address, portal_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customerId, name, email, phone || null, hashedPassword, address || null, 'customer']
    );

    // Create JWT token
    const token = jwt.sign(
      {
        id: customerId,
        role: 'customer',
        portalType: 'customer',
        email: email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userData = {
      customer_id: customerId,
      name,
      email,
      phone,
      address,
      role: 'customer',
      portalType: 'customer'
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: userData,
        token: token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // For JWT, logout is mainly handled on the client side
  // Here we could implement token blacklisting if needed
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;