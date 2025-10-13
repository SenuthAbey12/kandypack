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

    const advancedOrdersQuery = `
      SELECT o.*, 
           COUNT(oi.order_item_id) AS item_count,
     SUM(oi.quantity * oi.unit_price) AS total_amount
      FROM orders o
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
      LIMIT ${limitInt} OFFSET ${offsetInt}`;

    const legacyOrdersQuery = `
      SELECT o.*, 
           COUNT(oi.order_item_id) AS item_count,
     SUM(oi.quantity * oi.price) AS total_amount,
     o.order_status AS status
      FROM orders o
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
      LIMIT ${limitInt} OFFSET ${offsetInt}`;

    let orders;
    try {
      orders = await database.query(advancedOrdersQuery, [customerId]);
    } catch (e) {
      // Fallback if unit_price column doesn't exist
      if (e && e.code === 'ER_BAD_FIELD_ERROR') {
        orders = await database.query(legacyOrdersQuery, [customerId]);
      } else {
        throw e;
      }
    }

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
    let items;
    try {
      // Advanced: unit_price + product_name
      items = await database.query(
        `SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity,
            oi.unit_price AS unit_price,
            p.product_name AS product_name, p.description 
         FROM order_item oi
         JOIN product p ON oi.product_id = p.product_id
         WHERE oi.order_id = ?`,
        [id]
      );
    } catch (e1) {
      if (e1 && e1.code === 'ER_BAD_FIELD_ERROR') {
        try {
          // Advanced price + legacy product name
          items = await database.query(
            `SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity,
                oi.unit_price AS unit_price,
                p.name AS product_name, p.description 
             FROM order_item oi
             JOIN product p ON oi.product_id = p.product_id
             WHERE oi.order_id = ?`,
            [id]
          );
        } catch (e2) {
          try {
            // Legacy price + advanced product name
            items = await database.query(
              `SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity,
                  oi.price AS unit_price,
                  p.product_name AS product_name, p.description 
               FROM order_item oi
               JOIN product p ON oi.product_id = p.product_id
               WHERE oi.order_id = ?`,
              [id]
            );
          } catch (e3) {
            // Fully legacy: price + name
            items = await database.query(
              `SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity,
                  oi.price AS unit_price,
                  p.name AS product_name, p.description 
               FROM order_item oi
               JOIN product p ON oi.product_id = p.product_id
               WHERE oi.order_id = ?`,
              [id]
            );
          }
        }
      } else {
        throw e1;
      }
    }

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

  // Calculate total required space (advanced schema compatibility)
  let total_required_space = 0;

    // Validate products and calculate totals
    for (const item of items) {
      let product;
      try {
        // Advanced schema (space_consumption, product_name)
        [product] = await database.query(
          'SELECT price, space_consumption, available_quantity, product_name AS product_name FROM product WHERE product_id = ?',
          [item.product_id]
        );
      } catch (e1) {
        try {
          // Advanced variant where 'name' is used instead of 'product_name'
          [product] = await database.query(
            'SELECT price, space_consumption, available_quantity, name AS product_name FROM product WHERE product_id = ?',
            [item.product_id]
          );
        } catch (e2) {
          // Legacy schema fallback (weight/volume, name)
          [product] = await database.query(
            'SELECT price, weight_per_item, volume_per_item, available_quantity, name AS product_name FROM product WHERE product_id = ?',
            [item.product_id]
          );
        }
      }

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

      if (product.space_consumption != null) {
        total_required_space += Number(product.space_consumption) * item.quantity;
      } else if (product.weight_per_item != null && product.volume_per_item != null) {
        // fallback for legacy schema
        total_required_space += (Number(product.weight_per_item) + Number(product.volume_per_item)) * item.quantity;
      }
    }

    // Create order
    try {
      // advanced schema
      await database.query(
        `INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, status) 
         VALUES (?, ?, NOW(), ?, ?, 'pending')`,
        [order_id, customerId, destination_city, destination_address]
      );
    } catch (e) {
      // legacy fallback
      await database.query(
        `INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, total_weight, total_volume, order_status) 
         VALUES (?, ?, NOW(), ?, ?, ?, ?, 'Pending')`,
        [order_id, customerId, destination_city, destination_address, total_required_space, total_required_space]
      );
    }

    // Create order items
    for (const item of items) {
      const order_item_id = `OI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        await database.query(
          `INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) 
           VALUES (?, ?, ?, ?, ?)`,
          [order_item_id, order_id, item.product_id, item.quantity, item.price]
        );
      } catch (e) {
        // legacy fallback column name
        await database.query(
          `INSERT INTO order_item (order_item_id, order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?, ?)`,
          [order_item_id, order_id, item.product_id, item.quantity, item.price]
        );
      }

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

    // Fetch order items with schema-aware product name resolution
    let orderItems;
    try {
      orderItems = await database.query(
        `SELECT oi.*, p.product_name AS product_name
         FROM order_item oi
         JOIN product p ON oi.product_id = p.product_id
         WHERE oi.order_id = ?`,
        [order_id]
      );
    } catch (eItems) {
      if (eItems && eItems.code === 'ER_BAD_FIELD_ERROR') {
        orderItems = await database.query(
          `SELECT oi.*, p.name AS product_name
           FROM order_item oi
           JOIN product p ON oi.product_id = p.product_id
           WHERE oi.order_id = ?`,
          [order_id]
        );
      } else {
        throw eItems;
      }
    }

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
    try {
      await database.query(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        [order_status, id]
      );
    } catch (e) {
      if (e && e.code === 'ER_BAD_FIELD_ERROR') {
        await database.query(
          'UPDATE orders SET order_status = ? WHERE order_id = ?',
          [order_status, id]
        );
      } else {
        throw e;
      }
    }

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

    const limitInt2 = Number.isFinite(limit) ? limit : parseInt(limit, 10) || 10;
    const offsetInt2 = Number.isFinite(offset) ? offset : parseInt(offset, 10) || 0;

    const baseAdminSelect = `
      SELECT o.*, c.name AS customer_name, c.user_name AS customer_username,
             COUNT(oi.order_item_id) AS item_count
      FROM orders o
      JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN order_item oi ON o.order_id = oi.order_id`;

    const advancedAdminQuery = `${baseAdminSelect}
      ${status && status !== 'all' ? ' WHERE o.status = ?' : ''}
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
      LIMIT ${limitInt2} OFFSET ${offsetInt2}`.replace(/\s+/g, ' ');

    const legacyAdminQuery = `${baseAdminSelect.replace('SELECT o.*', 'SELECT o.*, o.order_status AS status')}
      ${status && status !== 'all' ? ' WHERE o.order_status = ?' : ''}
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
      LIMIT ${limitInt2} OFFSET ${offsetInt2}`.replace(/\s+/g, ' ');

    const advancedAdminTotals = 'SELECT SUM(oi.quantity * oi.unit_price) AS total_amount FROM order_item oi WHERE oi.order_id = ?';
    const legacyAdminTotals = 'SELECT SUM(oi.quantity * oi.price) AS total_amount FROM order_item oi WHERE oi.order_id = ?';

    let orders;
    try {
      const params = (status && status !== 'all') ? [status] : [];
      orders = await database.query(advancedAdminQuery, params);
      for (const o of orders) {
        const [{ total_amount }] = await database.query(advancedAdminTotals, [o.order_id]);
        o.total_amount = total_amount || 0;
        o.current_status = o.status ?? null;
      }
    } catch (eAdv) {
      if (eAdv && eAdv.code === 'ER_BAD_FIELD_ERROR') {
        const params = (status && status !== 'all') ? [status] : [];
        orders = await database.query(legacyAdminQuery, params);
        for (const o of orders) {
          const [{ total_amount }] = await database.query(legacyAdminTotals, [o.order_id]);
          o.total_amount = total_amount || 0;
          o.status = o.status || o.order_status || null;
        }
      } else {
        throw eAdv;
      }
    }

    // Count total
    let total;
    try {
      const countQueryAdv = 'SELECT COUNT(*) AS total FROM orders' + ((status && status !== 'all') ? ' WHERE status = ?' : '');
      const [{ total: t }] = await database.query(countQueryAdv, (status && status !== 'all') ? [status] : []);
      total = t;
    } catch (eCnt) {
      if (eCnt && eCnt.code === 'ER_BAD_FIELD_ERROR') {
        const countQueryLeg = 'SELECT COUNT(*) AS total FROM orders' + ((status && status !== 'all') ? ' WHERE order_status = ?' : '');
        const [{ total: t }] = await database.query(countQueryLeg, (status && status !== 'all') ? [status] : []);
        total = t;
      } else {
        throw eCnt;
      }
    }

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

// Get order tracking details for the authenticated customer
router.get('/:id/tracking', requireCustomer, async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;

    // Verify order ownership with schema-aware status selection
    let order;
    try {
      [order] = await database.query(
        `SELECT o.order_id, o.customer_id, 
                o.status AS status,
                o.order_date,
                o.destination_city,
                o.destination_address,
                o.updated_at
         FROM orders o
         WHERE o.order_id = ? AND o.customer_id = ?`,
        [id, customerId]
      );
    } catch (e1) {
      if (e1 && e1.code === 'ER_BAD_FIELD_ERROR') {
        [order] = await database.query(
          `SELECT o.order_id, o.customer_id, 
                  o.order_status AS status,
                  o.order_date,
                  o.destination_city,
                  o.destination_address,
                  o.updated_at
           FROM orders o
           WHERE o.order_id = ? AND o.customer_id = ?`,
          [id, customerId]
        );
      } else {
        throw e1;
      }
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const statusNorm = (order.status || '').toString().toLowerCase();
    const progress = (() => {
      if (statusNorm.includes('delivered')) return 100;
      if (statusNorm.includes('in_transit') || statusNorm.includes('in transit')) return 75;
      if (statusNorm.includes('scheduled') || statusNorm.includes('confirmed')) return 50;
      if (statusNorm.includes('pending') || statusNorm.includes('processing')) return 25;
      if (statusNorm.includes('cancel')) return 0;
      return 10;
    })();

    let trainSegments = [];
    let truckSegments = [];

    // Try singular table names first (train_shipment, truck_delivery); fallback to plural
    try {
      trainSegments = await database.query(
        `SELECT ts.shipment_id, ts.trip_id, tt.depart_time, tt.arrive_time
         FROM train_shipment ts
         LEFT JOIN train_trip tt ON tt.trip_id = ts.trip_id
         WHERE ts.order_id = ?
         ORDER BY tt.depart_time ASC`,
        [id]
      );
    } catch (e1) {
      try {
        trainSegments = await database.query(
          `SELECT ts.shipment_id, ts.trip_id, tt.depart_time, tt.arrive_time
           FROM train_shipments ts
           LEFT JOIN train_trip tt ON tt.trip_id = ts.trip_id
           WHERE ts.order_id = ?
           ORDER BY tt.depart_time ASC`,
          [id]
        );
      } catch (e2) {
        trainSegments = [];
      }
    }

    try {
      truckSegments = await database.query(
        `SELECT td.delivery_id, td.truck_schedule_id, td.delivered_at, ts.start_time, ts.end_time
         FROM truck_delivery td
         LEFT JOIN truck_schedule ts ON ts.truck_schedule_id = td.truck_schedule_id
         WHERE td.order_id = ?
         ORDER BY ts.start_time ASC`,
        [id]
      );
    } catch (e3) {
      try {
        truckSegments = await database.query(
          `SELECT td.delivery_id, td.truck_schedule_id, td.delivered_at, ts.start_time, ts.end_time
           FROM truck_deliveries td
           LEFT JOIN truck_schedule ts ON ts.truck_schedule_id = td.truck_schedule_id
           WHERE td.order_id = ?
           ORDER BY ts.start_time ASC`,
          [id]
        );
      } catch (e4) {
        truckSegments = [];
      }
    }

    const firstTrain = trainSegments[0] || null;
    const firstTruck = truckSegments[0] || null;

    // Determine derived timestamps
    const placedAt = order.order_date || null;
    const scheduledAt = firstTrain?.depart_time || null;
    const lastMileAt = firstTruck?.start_time || null;
    const deliveredAt = firstTruck?.delivered_at || (statusNorm.includes('delivered') ? order.updated_at || null : null);

    // Estimated delivery as best-effort from train arrive or truck end
    const estimatedDelivery = firstTruck?.end_time || firstTrain?.arrive_time || null;

    const milestones = [
      { key: 'placed', title: 'Order Placed', timestamp: placedAt, active: true },
      { key: 'processing', title: 'Processing', timestamp: placedAt, active: progress >= 25 },
      { key: 'scheduled', title: 'Scheduled / Rail Allocation', timestamp: scheduledAt, active: !!scheduledAt || progress >= 50 },
      { key: 'last_mile', title: 'Out for Delivery', timestamp: lastMileAt, active: !!lastMileAt || progress >= 75 },
      { key: 'delivered', title: 'Delivered', timestamp: deliveredAt, active: progress === 100 }
    ];

    return res.json({
      order_id: order.order_id,
      status: order.status,
      destination_city: order.destination_city || null,
      destination_address: order.destination_address || null,
      progress,
      estimated_delivery: estimatedDelivery,
      actual_delivery: deliveredAt,
      assignments: {
        train: firstTrain ? {
          trip_id: firstTrain.trip_id,
          depart_time: firstTrain.depart_time,
          arrive_time: firstTrain.arrive_time
        } : null,
        truck: firstTruck ? {
          truck_schedule_id: firstTruck.truck_schedule_id,
          start_time: firstTruck.start_time,
          end_time: firstTruck.end_time,
          delivered_at: firstTruck.delivered_at || null
        } : null
      },
      timeline: milestones
    });

  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({ error: 'Failed to fetch order tracking' });
  }
});

module.exports = router;