const express = require('express');
const router = express.Router();
const database = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all drivers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [drivers] = await database.query('SELECT * FROM driver ORDER BY name');
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get single driver
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [driver] = await database.query('SELECT * FROM driver WHERE driver_id = ?', [req.params.id]);
    if (driver.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver[0]);
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

// Driver signup
router.post('/signup', async (req, res) => {
  const { name, address, phone_no, email, password } = req.body;
  
  try {
    // Input validation
    if (!name || !email || !password || !phone_no) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if email already exists
    const [existingDriver] = await database.query('SELECT * FROM driver WHERE email = ?', [email]);
    if (existingDriver.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate unique driver ID
    const driver_id = 'DRV' + Date.now().toString().slice(-6);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new driver
    await database.query(
      'INSERT INTO driver (driver_id, name, email, password, phone_no, address) VALUES (?, ?, ?, ?, ?, ?)',
      [driver_id, name, email, hashedPassword, phone_no, address]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: driver_id, role: 'driver', email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Driver registered successfully',
      token,
      user: {
        id: driver_id,
        name,
        email,
        role: 'driver'
      }
    });
    
    // Insert the new driver
    await database.query(
      'INSERT INTO driver (driver_id, name, address, phone_no, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [driver_id, name, address, phone_no, email, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: driver_id, role: 'driver', email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Driver account created successfully',
      token,
      user: {
        id: driver_id,
        name,
        email,
        role: 'driver'
      }
    });
  } catch (error) {
    console.error('Error creating driver account:', error);
    res.status(500).json({ error: 'Failed to create driver account' });
  }
});

// Create new driver (admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { driver_id, name, address, phone_no, email } = req.body;
  try {
    await db.query(
      'INSERT INTO driver (driver_id, name, address, phone_no, email) VALUES (?, ?, ?, ?, ?)',
      [driver_id, name, address, phone_no, email]
    );
    res.status(201).json({ message: 'Driver created successfully' });
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ message: 'Error creating driver' });
  }
});

// Update driver
// Update driver
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, address, phone_no, email } = req.body;
  try {
    const result = await db.query(
      'UPDATE driver SET name = ?, address = ?, phone_no = ?, email = ? WHERE driver_id = ?',
      [name, address, phone_no, email, req.params.id]
    );
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json({ message: 'Driver updated successfully' });
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ message: 'Error updating driver' });
  }
});

// Delete driver
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM driver WHERE driver_id = ?', [req.params.id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ message: 'Error deleting driver' });
  }
});

module.exports = router;