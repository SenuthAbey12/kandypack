const express = require('express');
const database = require('../config/database');
const { requireAdmin, requireCustomer } = require('../middleware/auth');

const router = express.Router();

// Get customer orders
// List orders for the authenticated customer
router.get('/', requireCustomer, async (req, res) => {
  try {
    const customerId = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    // Get orders with order items
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
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details
// Get a specific order for the authenticated customer
router.get('/:id', requireCustomer, async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;

    // Get order with items and product details
    const [order] = await database.query(
      `SELECT o.* FROM orders o WHERE o.order_id = ? AND o.customer_id = ?`,
      [id, customerId]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    const items = await database.query(
      `SELECT oi.*, p.product_name, p.description 
       FROM order_item oi
       JOIN product p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      ...order,
      items
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Create new order
// Create a new order for the authenticated customer
router.post('/', requireCustomer, async (req, res) => {
  try {
    const customerId = req.user?.id;
    const { 
      destination_city, 
      destination_address, 
      items // Array of { product_id, quantity, price }
    } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    if (!destination_city || !destination_address || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'Destination city, address, and items are required' 
      });
    }

    // Generate order ID
    const order_id = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate total weight and volume
    let total_weight = 0;
    let total_volume = 0;

    // Validate products and calculate totals
    for (const item of items) {
      const [product] = await database.query(
        'SELECT weight_per_item, volume_per_item, available_quantity FROM product WHERE product_id = ?',
        [item.product_id]
      );

      if (!product) {
        return res.status(400).json({ 
          error: `Product ${item.product_id} not found` 
        });
      }

      if (product.available_quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient quantity for product ${item.product_id}` 
        });
      }

      total_weight += product.weight_per_item * item.quantity;
      total_volume += product.volume_per_item * item.quantity;
    }

    // Create order
    await database.query(
      `INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, total_weight, total_volume, order_status) 
       VALUES (?, ?, NOW(), ?, ?, ?, ?, 'Pending')`,
      [order_id, customerId, destination_city, destination_address, total_weight, total_volume]
    );

    // Create order items
    for (const item of items) {
      const order_item_id = `OI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await database.query(
        `INSERT INTO order_item (order_item_id, order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?, ?)`,
        [order_item_id, order_id, item.product_id, item.quantity, item.price]
      );

      // Update product quantity
      await database.query(
        'UPDATE product SET available_quantity = available_quantity - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Get the created order with items
    const [newOrder] = await database.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [order_id]
    );

    const orderItems = await database.query(
      `SELECT oi.*, p.product_name 
       FROM order_item oi
       JOIN product p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        ...newOrder,
        items: orderItems
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(400).json({ error: 'Order status is required' });
    }

    // Check if order exists
    const [existingOrder] = await database.query(
      'SELECT order_id FROM orders WHERE order_id = ?',
      [id]
    );

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    await database.query(
      'UPDATE orders SET order_status = ? WHERE order_id = ?',
      [order_status, id]
    );

    // Get updated order
    const [updatedOrder] = await database.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [id]
    );

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get all orders (Admin only)
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = `
      SELECT o.*, c.name as customer_name, c.user_name as customer_username,
             COUNT(oi.order_item_id) as item_count,
             SUM(oi.quantity * oi.price) as total_amount
      FROM orders o
      JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
    `;
    
    let params = [];

    if (status && status !== 'all') {
      query += ' WHERE o.order_status = ?';
      params.push(status);
    }

  const limitInt2 = Number.isFinite(limit) ? limit : parseInt(limit, 10) || 10;
  const offsetInt2 = Number.isFinite(offset) ? offset : parseInt(offset, 10) || 0;
  query += ` GROUP BY o.order_id ORDER BY o.order_date DESC LIMIT ${limitInt2} OFFSET ${offsetInt2}`;

    const orders = await database.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders';
    let countParams = [];

    if (status && status !== 'all') {
      countQuery += ' WHERE order_status = ?';
      countParams.push(status);
    }

    const [{ total }] = await database.query(countQuery, countParams);

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
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;