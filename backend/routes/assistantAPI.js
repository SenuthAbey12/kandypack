const express = require('express');
const { getDB } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get support tickets assigned to assistant
router.get('/tickets', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const assistantId = req.user.role === 'assistant' ? req.user.id : null;
    const { status, priority } = req.query;
    
    const db = await getDB();
    
    let query = `
      SELECT 
        st.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        d.name as driver_name,
        a.name as assistant_name
      FROM support_tickets st
      LEFT JOIN customer c ON st.customer_id = c.customer_id
  LEFT JOIN driver d ON st.driver_id = d.driver_id
  LEFT JOIN assistant a ON st.assistant_id = a.assistant_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (assistantId) {
      conditions.push('(st.assistant_id = ? OR st.assistant_id IS NULL)');
      params.push(assistantId);
    }
    
    if (status) {
      conditions.push('st.status = ?');
      params.push(status);
    }
    
    if (priority) {
      conditions.push('st.priority = ?');
      params.push(priority);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY st.priority DESC, st.created_at DESC';
    
    const [tickets] = await db.execute(query, params);

    res.json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching support tickets'
    });
  }
});

// Assign ticket to assistant
router.put('/tickets/:ticketId/assign', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const assistantId = req.user.id;
    
    const db = await getDB();
    
    // Check if ticket exists
    const [ticket] = await db.execute(
      'SELECT * FROM support_tickets WHERE ticket_id = ?',
      [ticketId]
    );
    
    if (ticket.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    await db.execute(
      'UPDATE support_tickets SET assistant_id = ?, status = ?, updated_at = NOW() WHERE ticket_id = ?',
      [assistantId, 'in_progress', ticketId]
    );

    res.json({
      success: true,
      message: 'Ticket assigned successfully'
    });

  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning ticket'
    });
  }
});

// Update ticket status
router.put('/tickets/:ticketId/status', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, resolution_notes } = req.body;
    
    if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const db = await getDB();
    
    const updateFields = ['status = ?', 'updated_at = NOW()'];
    const updateValues = [status];
    
    if (status === 'resolved' || status === 'closed') {
      updateFields.push('resolved_at = NOW()');
    }
    
    if (resolution_notes) {
      updateFields.push('description = CONCAT(description, "\n\nResolution: ", ?)');
      updateValues.push(resolution_notes);
    }
    
    updateValues.push(ticketId);
    
    await db.execute(
      `UPDATE support_tickets SET ${updateFields.join(', ')} WHERE ticket_id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Ticket status updated successfully'
    });

  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticket status'
    });
  }
});

// Create new support ticket
router.post('/tickets', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const { customer_id, driver_id, title, description, priority = 'medium', category = 'general' } = req.body;
    const assistantId = req.user.id;
    
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    const db = await getDB();
    
    // Generate ticket ID
    const [lastTicket] = await db.execute(
      'SELECT ticket_id FROM support_tickets ORDER BY ticket_id DESC LIMIT 1'
    );
    
    let nextId = 1;
    if (lastTicket.length > 0) {
      const lastId = parseInt(lastTicket[0].ticket_id.substring(3));
      nextId = lastId + 1;
    }
    
    const ticketId = `TKT${nextId.toString().padStart(3, '0')}`;
    
    await db.execute(
      'INSERT INTO support_tickets (ticket_id, customer_id, assistant_id, driver_id, title, description, priority, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [ticketId, customer_id || null, assistantId, driver_id || null, title, description, priority, category]
    );

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: { ticket_id: ticketId }
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating support ticket'
    });
  }
});

// Get driver requests for assistant management
router.get('/driver-requests', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const { status, priority } = req.query;
    const db = await getDB();
    
    let query = `
      SELECT 
        dr.*,
        d.name as driver_name,
        d.phone as driver_phone,
        a.name as assistant_name
      FROM driver_requests dr
  LEFT JOIN driver d ON dr.driver_id = d.driver_id
  LEFT JOIN assistant a ON dr.assistant_id = a.assistant_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (status) {
      conditions.push('dr.status = ?');
      params.push(status);
    }
    
    if (priority) {
      conditions.push('dr.priority = ?');
      params.push(priority);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY dr.priority DESC, dr.created_at DESC';
    
    const [requests] = await db.execute(query, params);

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Error fetching driver requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching driver requests'
    });
  }
});

// Handle driver request (approve/deny)
router.put('/driver-requests/:requestId', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, resolution_notes } = req.body;
    const assistantId = req.user.id;
    
    if (!['approved', 'denied', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const db = await getDB();
    
    const updateFields = ['status = ?', 'assistant_id = ?', 'updated_at = NOW()'];
    const updateValues = [status, assistantId];
    
    if (status === 'resolved' || status === 'approved' || status === 'denied') {
      updateFields.push('resolved_at = NOW()');
    }
    
    if (resolution_notes) {
      updateFields.push('resolution_notes = ?');
      updateValues.push(resolution_notes);
    }
    
    updateValues.push(requestId);
    
    await db.execute(
      `UPDATE driver_requests SET ${updateFields.join(', ')} WHERE request_id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Driver request updated successfully'
    });

  } catch (error) {
    console.error('Error updating driver request:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating driver request'
    });
  }
});

// Get inventory status
router.get('/inventory', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const { category, low_stock } = req.query;
    const db = await getDB();
    
    let query = 'SELECT * FROM inventory_items';
    const conditions = [];
    const params = [];
    
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    
    if (low_stock === 'true') {
      conditions.push('current_stock <= minimum_stock');
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY category, item_name';
    
    const [items] = await db.execute(query, params);

    res.json({
      success: true,
      data: items
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory'
    });
  }
});

// Update inventory stock
router.put('/inventory/:itemId', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const { itemId } = req.params;
    const { current_stock, minimum_stock, unit_price } = req.body;
    
    const db = await getDB();
    
    const updateFields = [];
    const updateValues = [];
    
    if (current_stock !== undefined) {
      updateFields.push('current_stock = ?');
      updateValues.push(current_stock);
      updateFields.push('last_restocked = CURDATE()');
    }
    
    if (minimum_stock !== undefined) {
      updateFields.push('minimum_stock = ?');
      updateValues.push(minimum_stock);
    }
    
    if (unit_price !== undefined) {
      updateFields.push('unit_price = ?');
      updateValues.push(unit_price);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    updateFields.push('updated_at = NOW()');
    updateValues.push(itemId);
    
    await db.execute(
      `UPDATE inventory_items SET ${updateFields.join(', ')} WHERE item_id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Inventory updated successfully'
    });

  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inventory'
    });
  }
});

// Get assistant performance stats
router.get('/stats', authenticateToken, requireRole(['assistant', 'admin']), async (req, res) => {
  try {
    const assistantId = req.user.role === 'assistant' ? req.user.id : null;
    const db = await getDB();
    
    let ticketStatsQuery = `
      SELECT 
        COUNT(*) as total_tickets,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_tickets,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tickets,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_tickets,
        AVG(CASE WHEN resolved_at IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, created_at, resolved_at) 
            ELSE NULL END) as avg_resolution_time
      FROM support_tickets
    `;
    
    let requestStatsQuery = `
      SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_requests,
        SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) as denied_requests,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests
      FROM driver_requests
    `;
    
    const params = [];
    
    if (assistantId) {
      ticketStatsQuery += ' WHERE assistant_id = ?';
      requestStatsQuery += ' WHERE assistant_id = ?';
      params.push(assistantId);
    }
    
    const [ticketStats] = await db.execute(ticketStatsQuery, params);
    const [requestStats] = await db.execute(requestStatsQuery, params);
    
    // Get active drivers count
    const [driverStats] = await db.execute(
      "SELECT COUNT(*) as active_drivers FROM driver WHERE status = 'active'"
    );

    res.json({
      success: true,
      data: {
        tickets: ticketStats[0],
        driver_requests: requestStats[0],
        active_drivers: driverStats[0].active_drivers,
        avg_response_time: ticketStats[0].avg_resolution_time 
          ? `${Math.round(ticketStats[0].avg_resolution_time)} hours`
          : 'N/A'
      }
    });

  } catch (error) {
    console.error('Error fetching assistant stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assistant statistics'
    });
  }
});

module.exports = router;