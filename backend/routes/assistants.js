const express = require('express');
const router = express.Router();
const database = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all assistants
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [assistants] = await database.query('SELECT * FROM assistant ORDER BY name');
    res.json(assistants);
  } catch (error) {
    console.error('Error fetching assistants:', error);
    res.status(500).json({ error: 'Failed to fetch assistants' });
  }
});

// Get single assistant
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [assistant] = await database.query('SELECT * FROM assistant WHERE assistant_id = ?', [req.params.id]);
    if (assistant.length === 0) {
      return res.status(404).json({ error: 'Assistant not found' });
    }
    res.json(assistant[0]);
  } catch (error) {
    console.error('Error fetching assistant:', error);
    res.status(500).json({ error: 'Failed to fetch assistant' });
  }
});

// Assistant signup
router.post('/signup', async (req, res) => {
  const { name, address, phone_no, email, password } = req.body;
  
  try {
    // Check if email already exists
    const [existingAssistant] = await database.query('SELECT * FROM assistant WHERE email = ?', [email]);
    if (existingAssistant.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate unique assistant ID
    const assistant_id = 'AST' + Date.now().toString().slice(-6);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new assistant
    await database.query(
      'INSERT INTO assistant (assistant_id, name, address, phone_no, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [assistant_id, name, address, phone_no, email, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: assistant_id, role: 'assistant', email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Assistant account created successfully',
      token,
      user: {
        id: assistant_id,
        name,
        email,
        role: 'assistant'
      }
    });
  } catch (error) {
    console.error('Error creating assistant account:', error);
    res.status(500).json({ error: 'Failed to create assistant account' });
  }
});

// Create new assistant (admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { assistant_id, name, address, phone_no, email } = req.body;
  try {
    await database.query(
      'INSERT INTO assistant (assistant_id, name, address, phone_no, email) VALUES (?, ?, ?, ?, ?)',
      [assistant_id, name, address, phone_no, email]
    );
    res.status(201).json({ message: 'Assistant created successfully' });
  } catch (error) {
    console.error('Error creating assistant:', error);
    res.status(500).json({ error: 'Failed to create assistant' });
  }
});

// Update assistant
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, address, phone_no, email } = req.body;
  try {
    const result = await database.query(
      'UPDATE assistant SET name = ?, address = ?, phone_no = ?, email = ? WHERE assistant_id = ?',
      [name, address, phone_no, email, req.params.id]
    );
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Assistant not found' });
    }
    res.json({ message: 'Assistant updated successfully' });
  } catch (error) {
    console.error('Error updating assistant:', error);
    res.status(500).json({ error: 'Failed to update assistant' });
  }
});

// Delete assistant
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await database.query('DELETE FROM assistant WHERE assistant_id = ?', [req.params.id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Assistant not found' });
    }
    res.json({ message: 'Assistant deleted successfully' });
  } catch (error) {
    console.error('Error deleting assistant:', error);
    res.status(500).json({ error: 'Failed to delete assistant' });
  }
});

module.exports = router;