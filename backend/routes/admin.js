const express = require('express');
const database = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get admin dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get order statistics
    const [orderStats] = await database.query(
      `SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(CASE WHEN order_status = 'Pending' THEN 1 ELSE 0 END), 0) as pending_orders,
        COALESCE(SUM(CASE WHEN order_status = 'Delivered' THEN 1 ELSE 0 END), 0) as delivered_orders,
        COALESCE(SUM(CASE WHEN order_status = 'In Transit' THEN 1 ELSE 0 END), 0) as in_transit_orders,
        COALESCE(SUM(CASE WHEN order_status = 'Cancelled' THEN 1 ELSE 0 END), 0) as cancelled_orders
       FROM orders`
    );

    // Get customer count
    const [customerStats] = await database.query(
      'SELECT COUNT(*) as total_customers FROM customer'
    );

    // Get product count
    const [productStats] = await database.query(
      'SELECT COUNT(*) as total_products FROM product'
    );

    // Get total revenue
    const [revenueStats] = await database.query(
      `SELECT COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
       FROM order_item oi
       JOIN orders o ON oi.order_id = o.order_id
       WHERE o.order_status = 'Delivered'`
    );

    // Get recent orders
    const recentOrders = await database.query(
      `SELECT o.order_id, o.order_date, o.order_status, o.destination_city,
              c.name as customer_name, c.user_name as customer_username,
              COUNT(oi.order_item_id) as item_count,
              SUM(oi.quantity * oi.price) as total_amount
       FROM orders o
       JOIN customer c ON o.customer_id = c.customer_id
       LEFT JOIN order_item oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.order_date DESC
       LIMIT 10`
    );

    // Get low stock products
    const lowStockProducts = await database.query(
      'SELECT product_id, product_name, available_quantity FROM product WHERE available_quantity < 10 ORDER BY available_quantity ASC LIMIT 10'
    );

    res.json({
      stats: {
        total_orders: orderStats.total_orders || 0,
        pending_orders: orderStats.pending_orders || 0,
        delivered_orders: orderStats.delivered_orders || 0,
        in_transit_orders: orderStats.in_transit_orders || 0,
        cancelled_orders: orderStats.cancelled_orders || 0,
        total_customers: customerStats.total_customers || 0,
        total_products: productStats.total_products || 0,
        total_revenue: revenueStats.total_revenue || 0
      },
      recent_orders: recentOrders,
      low_stock_products: lowStockProducts
    });

  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search;

    let query = 'SELECT customer_id, name, phone_no, city, address, user_name FROM customer';
    let countQuery = 'SELECT COUNT(*) as total FROM customer';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR user_name LIKE ? OR city LIKE ?';
      countQuery += ' WHERE name LIKE ? OR user_name LIKE ? OR city LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

  const limitInt = Number.isFinite(limit) ? limit : parseInt(limit, 10) || 10;
  const offsetInt = Number.isFinite(offset) ? offset : parseInt(offset, 10) || 0;
  query += ` ORDER BY name LIMIT ${limitInt} OFFSET ${offsetInt}`;

    const [customers, [{ total }]] = await Promise.all([
      database.query(query, params),
      database.query(countQuery, search ? params : [])
    ]);

    res.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer details
router.get('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [customer] = await database.query(
      'SELECT customer_id, name, phone_no, city, address, user_name FROM customer WHERE customer_id = ?',
      [id]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get customer order summary
    const [orderSummary] = await database.query(
      `SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(oi.quantity * oi.price), 0) as total_spent
       FROM orders o
       LEFT JOIN order_item oi ON o.order_id = oi.order_id
       WHERE o.customer_id = ?`,
      [id]
    );

    res.json({
      customer,
      order_summary: orderSummary
    });

  } catch (error) {
    console.error('Get customer details error:', error);
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(400).json({ error: 'Order status is required' });
    }

    const validStatuses = ['Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ error: 'Invalid order status' });
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
      `SELECT o.*, c.name as customer_name 
       FROM orders o 
       JOIN customer c ON o.customer_id = c.customer_id 
       WHERE o.order_id = ?`,
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

// Get inventory management data
router.get('/inventory', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const lowStock = req.query.lowStock === 'true';

    let query = 'SELECT * FROM product';
    let countQuery = 'SELECT COUNT(*) as total FROM product';
    let params = [];
    let whereConditions = [];

    if (category && category !== 'all') {
      whereConditions.push('category = ?');
      params.push(category);
    }

    if (lowStock) {
      whereConditions.push('available_quantity < 10');
    }

    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

  const limitInt2 = Number.isFinite(limit) ? limit : parseInt(limit, 10) || 10;
  const offsetInt2 = Number.isFinite(offset) ? offset : parseInt(offset, 10) || 0;
  query += ` ORDER BY product_name LIMIT ${limitInt2} OFFSET ${offsetInt2}`;

    const [products, [{ total }]] = await Promise.all([
      database.query(query, params),
      database.query(countQuery, params)
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Update product inventory
router.put('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { available_quantity } = req.body;

    if (available_quantity === undefined || available_quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Check if product exists
    const [existingProduct] = await database.query(
      'SELECT product_id FROM product WHERE product_id = ?',
      [id]
    );

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product quantity
    await database.query(
      'UPDATE product SET available_quantity = ? WHERE product_id = ?',
      [available_quantity, id]
    );

    // Get updated product
    const [updatedProduct] = await database.query(
      'SELECT * FROM product WHERE product_id = ?',
      [id]
    );

    res.json({
      message: 'Product inventory updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

module.exports = router;