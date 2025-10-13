const express = require('express');
const { getDB } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get driver's assignments
router.get('/assignments', authenticateToken, requireRole(['driver']), async (req, res) => {
  try {
    const driverId = req.user.id;
    const db = await getDB();

    const [assignments] = await db.execute(`
      SELECT 
        da.*,
        o.customer_id,
        c.name as customer_name,
        c.address as customer_address,
        c.phone as customer_phone,
        o.total_amount,
        o.order_date,
        o.status as order_status
      FROM driver_assignments da
      LEFT JOIN orders o ON da.order_id = o.order_id
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      WHERE da.driver_id = ?
      ORDER BY da.assignment_date DESC, da.created_at DESC
    `, [driverId]);

    res.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('Error fetching driver assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments'
    });
  }
});

// Update assignment status
router.put('/assignments/:assignmentId/status', authenticateToken, requireRole(['driver']), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { status, notes } = req.body;
    const driverId = req.user.id;

    if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const db = await getDB();

    // Verify assignment belongs to this driver
    const [assignment] = await db.execute(
      'SELECT * FROM driver_assignments WHERE assignment_id = ? AND driver_id = ?',
      [assignmentId, driverId]
    );

    if (assignment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Update assignment
    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (status === 'completed') {
      updateFields.push('actual_delivery_time = NOW()');
    }

    if (notes) {
      updateFields.push('special_instructions = ?');
      updateValues.push(notes);
    }

    updateValues.push(assignmentId, driverId);

    await db.execute(
      `UPDATE driver_assignments SET ${updateFields.join(', ')}, updated_at = NOW() 
       WHERE assignment_id = ? AND driver_id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Assignment status updated successfully'
    });

  } catch (error) {
    console.error('Error updating assignment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating assignment status'
    });
  }
});

// Get driver's performance stats
router.get('/stats', authenticateToken, requireRole(['driver']), async (req, res) => {
  try {
    const driverId = req.user.id;
    const db = await getDB();

    // Get today's stats
    const [todayStats] = await db.execute(`
      SELECT 
        COUNT(*) as total_deliveries,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_deliveries,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_deliveries,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_deliveries
      FROM driver_assignments 
      WHERE driver_id = ? AND DATE(assignment_date) = CURDATE()
    `, [driverId]);

    // Get overall performance rating
    const [driverInfo] = await db.execute(
      'SELECT performance_rating, status FROM driver WHERE driver_id = ?',
      [driverId]
    );

    // Calculate on-time delivery rate (last 30 days)
    const [onTimeStats] = await db.execute(`
      SELECT 
        COUNT(*) as total_completed,
        SUM(CASE WHEN actual_delivery_time <= estimated_delivery_time THEN 1 ELSE 0 END) as on_time_deliveries
      FROM driver_assignments 
      WHERE driver_id = ? 
      AND status = 'completed' 
      AND assignment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `, [driverId]);

    const onTimeRate = onTimeStats[0].total_completed > 0 
      ? Math.round((onTimeStats[0].on_time_deliveries / onTimeStats[0].total_completed) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        today: todayStats[0],
        performance_rating: driverInfo[0]?.performance_rating || 5.0,
        driver_status: driverInfo[0]?.status || 'active',
        on_time_rate: `${onTimeRate}%`
      }
    });

  } catch (error) {
    console.error('Error fetching driver stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching driver statistics'
    });
  }
});

// Create driver request
router.post('/requests', authenticateToken, requireRole(['driver']), async (req, res) => {
  try {
    const { request_type, description, priority = 'medium' } = req.body;
    const driverId = req.user.id;

    if (!request_type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Request type and description are required'
      });
    }

    if (!['route_change', 'vehicle_issue', 'schedule_change', 'emergency', 'break_request'].includes(request_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request type'
      });
    }

    const db = await getDB();

    // Generate request ID
    const [lastRequest] = await db.execute(
      'SELECT request_id FROM driver_requests ORDER BY request_id DESC LIMIT 1'
    );
    
    let nextId = 1;
    if (lastRequest.length > 0) {
      const lastId = parseInt(lastRequest[0].request_id.substring(3));
      nextId = lastId + 1;
    }
    
    const requestId = `REQ${nextId.toString().padStart(3, '0')}`;

    await db.execute(
      'INSERT INTO driver_requests (request_id, driver_id, request_type, description, priority) VALUES (?, ?, ?, ?, ?)',
      [requestId, driverId, request_type, description, priority]
    );

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      data: { request_id: requestId }
    });

  } catch (error) {
    console.error('Error creating driver request:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting request'
    });
  }
});

// Get driver's requests
router.get('/requests', authenticateToken, requireRole(['driver']), async (req, res) => {
  try {
    const driverId = req.user.id;
    const db = await getDB();

    const [requests] = await db.execute(`
      SELECT 
        dr.*,
        a.name as assistant_name
      FROM driver_requests dr
      LEFT JOIN assistant a ON dr.assistant_id = a.assistant_id
      WHERE dr.driver_id = ?
      ORDER BY dr.created_at DESC
    `, [driverId]);

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Error fetching driver requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests'
    });
  }
});

// Update driver status (active, on_break, etc.)
router.put('/status', authenticateToken, requireRole(['driver']), async (req, res) => {
  try {
    const { status } = req.body;
    const driverId = req.user.id;

    if (!['active', 'inactive', 'on_break'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const db = await getDB();
    
    await db.execute(
      'UPDATE driver SET status = ?, updated_at = NOW() WHERE driver_id = ?',
      [status, driverId]
    );

    res.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});

module.exports = router;