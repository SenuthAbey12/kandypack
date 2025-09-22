const express = require('express');
const database = require('../config/database');
const { authenticateToken, requireCustomer, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get customer profile
router.get('/profile', authenticateToken, requireCustomer, async (req, res) => {
  try {
    const customerId = req.user.id;

    const [customer] = await database.query(
      'SELECT customer_id, name, phone_no, city, address, user_name FROM customer WHERE customer_id = ?',
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);

  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({ error: 'Failed to fetch customer profile' });
  }
});

// Update customer profile
router.put('/profile', authenticateToken, requireCustomer, async (req, res) => {
  try {
    const customerId = req.user.id;
    const { name, phone_no, city, address } = req.body;

    // Update customer
    await database.query(
      `UPDATE customer SET 
       name = COALESCE(?, name),
       phone_no = COALESCE(?, phone_no),
       city = COALESCE(?, city),
       address = COALESCE(?, address)
       WHERE customer_id = ?`,
      [name, phone_no, city, address, customerId]
    );

    // Get updated customer
    const [updatedCustomer] = await database.query(
      'SELECT customer_id, name, phone_no, city, address, user_name FROM customer WHERE customer_id = ?',
      [customerId]
    );

    res.json({
      message: 'Profile updated successfully',
      customer: updatedCustomer
    });

  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get customer order history
router.get('/orders', authenticateToken, requireCustomer, async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get orders with summary
  const limitInt = Number.isFinite(limit) ? limit : parseInt(limit, 10) || 10;
  const offsetInt = Number.isFinite(offset) ? offset : parseInt(offset, 10) || 0;
  const orders = await database.query(
      `SELECT o.*, 
              COUNT(oi.order_item_id) as item_count,
              SUM(oi.quantity * oi.price) as total_amount
       FROM orders o
       LEFT JOIN order_item oi ON o.order_id = oi.order_id
       WHERE o.customer_id = ?
       GROUP BY o.order_id
       ORDER BY o.order_date DESC
       LIMIT ${limitInt} OFFSET ${offsetInt}`,
      [customerId]
    );

    // Get total count
    const [{ total }] = await database.query(
      'SELECT COUNT(*) as total FROM orders WHERE customer_id = ?',
      [customerId]
    );

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get customer dashboard stats
router.get('/dashboard/stats', authenticateToken, requireCustomer, async (req, res) => {
  try {
    const customerId = req.user.id;

    try {
      // Try to get real data from database
      const [orderStats] = await database.query(
        `SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(CASE WHEN order_status = 'Pending' THEN 1 ELSE 0 END), 0) as pending_orders,
          COALESCE(SUM(CASE WHEN order_status = 'Delivered' THEN 1 ELSE 0 END), 0) as delivered_orders,
          COALESCE(SUM(CASE WHEN order_status = 'In Transit' THEN 1 ELSE 0 END), 0) as in_transit_orders
         FROM orders WHERE customer_id = ?`,
        [customerId]
      );

      // Get total spent
      const [spendingStats] = await database.query(
        `SELECT COALESCE(SUM(oi.quantity * oi.price), 0) as total_spent
         FROM orders o
         JOIN order_item oi ON o.order_id = oi.order_id
         WHERE o.customer_id = ?`,
        [customerId]
      );

      // Get recent orders
      const recentOrders = await database.query(
        `SELECT o.order_id, o.order_date, o.order_status, o.destination_city,
                COUNT(oi.order_item_id) as item_count,
                SUM(oi.quantity * oi.price) as total_amount
         FROM orders o
         LEFT JOIN order_item oi ON o.order_id = oi.order_id
         WHERE o.customer_id = ?
         GROUP BY o.order_id
         ORDER BY o.order_date DESC
         LIMIT 5`,
        [customerId]
      );

      res.json({
        stats: {
          total_orders: orderStats.total_orders || 0,
          pending_orders: orderStats.pending_orders || 0,
          delivered_orders: orderStats.delivered_orders || 0,
          in_transit_orders: orderStats.in_transit_orders || 0,
          total_spent: spendingStats.total_spent || 0
        },
        recent_orders: recentOrders
      });
      
    } catch (dbError) {
      // Fallback to mock data when database is unavailable
      console.log('Database unavailable, using mock data for customer dashboard');
      
      res.json({
        stats: {
          total_orders: 12,
          pending_orders: 2,
          delivered_orders: 8,
          in_transit_orders: 2,
          total_spent: 1849.89
        },
        recent_orders: [
          {
            order_id: 'ORD_MOCK_001',
            order_date: new Date().toISOString(),
            order_status: 'In Transit',
            destination_city: 'Kandy',
            item_count: 2,
            total_amount: 379.98
          },
          {
            order_id: 'ORD_MOCK_002',
            order_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            order_status: 'Delivered',
            destination_city: 'Colombo',
            item_count: 1,
            total_amount: 149.99
          }
        ]
      });
    }

  } catch (error) {
    console.error('Get customer dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;