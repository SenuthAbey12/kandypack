const express = require('express');
const database = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get admin dashboard statistics for Rail & Road Distribution System
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get order statistics
    const [orderStats] = await database.query(
      `SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending_orders,
        COALESCE(SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END), 0) as confirmed_orders,
        COALESCE(SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END), 0) as scheduled_orders,
        COALESCE(SUM(CASE WHEN status = 'in_transit' THEN 1 ELSE 0 END), 0) as in_transit_orders,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END), 0) as delivered_orders,
        COALESCE(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END), 0) as cancelled_orders
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

    // Get train statistics
    const [trainStats] = await database.query(
      `SELECT 
        COUNT(DISTINCT t.train_id) as total_trains,
        COALESCE(SUM(t.capacity), 0) as total_train_capacity,
        COUNT(DISTINCT tt.trip_id) as scheduled_trips,
        COALESCE(SUM(tt.capacity_used), 0) as used_capacity
       FROM train t
       LEFT JOIN train_trip tt ON t.train_id = tt.train_id`
    );

    // Get truck statistics
    const [truckStats] = await database.query(
      `SELECT 
        COUNT(DISTINCT tr.truck_id) as total_trucks,
        COALESCE(SUM(tr.capacity), 0) as total_truck_capacity,
        COUNT(DISTINCT ts.truck_schedule_id) as scheduled_runs
       FROM truck tr
       LEFT JOIN truck_schedule ts ON tr.truck_id = ts.truck_id`
    );

    // Get worker statistics
    const [workerStats] = await database.query(
      `SELECT 
        (SELECT COUNT(*) FROM driver) as total_drivers,
        (SELECT COUNT(*) FROM assistant) as total_assistants`
    );

    // Get pending orders that need allocation
    const [pendingOrders] = await database.query(
      `SELECT o.order_id, o.customer_id, o.order_date, o.destination_city, o.destination_address,
              c.name as customer_name, ot.required_space, ot.order_amount
       FROM orders o
       JOIN customer c ON o.customer_id = c.customer_id
       LEFT JOIN v_order_totals ot ON o.order_id = ot.order_id
       WHERE o.status = 'confirmed'
       ORDER BY o.order_date ASC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        orders: orderStats[0],
        customers: customerStats[0],
        products: productStats[0],
        trains: trainStats[0],
        trucks: truckStats[0],
        workers: workerStats[0],
        pendingOrders: pendingOrders
      }
    });

  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// Get all orders with details for admin view
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];

    if (status && status !== 'all') {
      whereClause = 'WHERE o.status = ?';
      queryParams.push(status);
    }

    const [orders] = await database.query(
      `SELECT o.order_id, o.order_date, o.destination_city, o.destination_address, o.status,
              c.name as customer_name, c.phone_no, c.city as customer_city,
              ot.order_amount, ot.required_space,
              COUNT(DISTINCT ts.shipment_id) as train_allocations,
              COUNT(DISTINCT td.delivery_id) as truck_allocations
       FROM orders o
       JOIN customer c ON o.customer_id = c.customer_id
       LEFT JOIN v_order_totals ot ON o.order_id = ot.order_id
       LEFT JOIN train_shipment ts ON o.order_id = ts.order_id
       LEFT JOIN truck_delivery td ON o.order_id = td.order_id
       ${whereClause}
       GROUP BY o.order_id, o.order_date, o.destination_city, o.destination_address, o.status,
                c.name, c.phone_no, c.city, ot.order_amount, ot.required_space
       ORDER BY o.order_date DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    // Get total count for pagination
    const [countResult] = await database.query(
      `SELECT COUNT(DISTINCT o.order_id) as total FROM orders o ${whereClause}`,
      queryParams
    );

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get available trains for allocation
router.get('/trains/available', async (req, res) => {
  try {
    const [trains] = await database.query(
      `SELECT t.train_id, t.capacity, t.notes,
              tr.route_id, tr.start_city, tr.end_city, tr.destinations,
              COUNT(tt.trip_id) as scheduled_trips,
              COALESCE(SUM(tt.capacity - tt.capacity_used), 0) as available_capacity
       FROM train t
       LEFT JOIN train_trip tt ON t.train_id = tt.train_id AND tt.depart_time >= CURDATE()
       LEFT JOIN train_route tr ON tt.route_id = tr.route_id
       GROUP BY t.train_id, t.capacity, t.notes, tr.route_id, tr.start_city, tr.end_city, tr.destinations
       ORDER BY t.train_id`
    );

    res.json({
      success: true,
      data: trains
    });

  } catch (error) {
    console.error('Error fetching available trains:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available trains',
      error: error.message
    });
  }
});

// Get available trucks and personnel for scheduling
router.get('/trucks/available', async (req, res) => {
  try {
    // Get trucks
    const [trucks] = await database.query(
      `SELECT truck_id, license_plate, capacity FROM truck ORDER BY truck_id`
    );

    // Get drivers
    const [drivers] = await database.query(
      `SELECT driver_id, name, phone_no, email FROM driver ORDER BY name`
    );

    // Get assistants
    const [assistants] = await database.query(
      `SELECT assistant_id, name, phone_no, email FROM assistant ORDER BY name`
    );

    // Get truck routes
    const [routes] = await database.query(
      `SELECT tr.route_id, tr.route_name, tr.max_minutes,
              s.store_id, s.name as store_name, s.city
       FROM truck_route tr
       JOIN store s ON tr.store_id = s.store_id
       ORDER BY s.city, tr.route_name`
    );

    res.json({
      success: true,
      data: {
        trucks,
        drivers,
        assistants,
        routes
      }
    });

  } catch (error) {
    console.error('Error fetching available trucks and personnel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available resources',
      error: error.message
    });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'scheduled', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const [result] = await database.query(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Generate quarterly sales report
router.get('/reports/quarterly-sales', async (req, res) => {
  try {
    const [report] = await database.query(
      `SELECT * FROM v_quarterly_sales ORDER BY quarter DESC`
    );

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error generating quarterly sales report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quarterly sales report',
      error: error.message
    });
  }
});

// Generate top products report
router.get('/reports/top-products', async (req, res) => {
  try {
    const { year = new Date().getFullYear(), quarter = Math.ceil((new Date().getMonth() + 1) / 3) } = req.query;

    const [report] = await database.query(
      `SELECT * FROM v_quarter_top_items 
       WHERE year = ? AND quarter = ?
       ORDER BY total_qty DESC
       LIMIT 20`,
      [year, quarter]
    );

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error generating top products report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate top products report',
      error: error.message
    });
  }
});

// Generate worker hours report
router.get('/reports/worker-hours', async (req, res) => {
  try {
    const [report] = await database.query(
      `SELECT * FROM v_worker_hours 
       ORDER BY week DESC, role, worker_id`
    );

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error generating worker hours report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate worker hours report',
      error: error.message
    });
  }
});

module.exports = router;