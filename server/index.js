const express = require('express');
const cors = require('cors');
const { getDb, initDb } = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize DB and seed data if needed
initDb();

// Helpers
const mapOrderRow = (row) => ({
  id: row.id,
  customer: row.customer,
  date: row.date,
  status: row.status,
  priority: row.priority,
  value: row.value,
  driver: row.driver_name || null,
  driverId: row.driver_id || null,
  mode: row.mode,
  origin: row.origin,
  destination: row.destination,
  hub: row.hub
});

app.get('/api/portal/admin/stats', (req, res) => {
  try {
    const db = getDb();
    const totalOrders = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
    const totalDrivers = db.prepare('SELECT COUNT(*) as c FROM drivers').get().c;
    const totalAssistants = db.prepare('SELECT COUNT(*) as c FROM assistants').get().c;
    const totalCustomers = db.prepare('SELECT COUNT(DISTINCT customer) as c FROM orders').get().c;
    const pendingOrders = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status IN ('pending','processing','rail-pending','at-hub')").get().c;
    const today = new Date().toISOString().slice(0,10);
    const completedToday = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='completed' AND date=?").get(today).c;
    res.json({ totalOrders, totalDrivers, totalAssistants, totalCustomers, pendingOrders, completedToday });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

app.get('/api/portal/admin/drivers', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM drivers ORDER BY id').all();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load drivers' });
  }
});

app.post('/api/portal/admin/drivers', (req, res) => {
  try {
    const db = getDb();
    const { id, name, phone, vehicle, status = 'active', deliveries = 0, rating = 5.0 } = req.body;
    const stmt = db.prepare('INSERT INTO drivers (id, name, phone, vehicle, status, deliveries, rating) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, name, phone, vehicle, status, deliveries, rating);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

app.get('/api/portal/admin/assistants', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM assistants ORDER BY id').all();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load assistants' });
  }
});

app.post('/api/portal/admin/assistants', (req, res) => {
  try {
    const db = getDb();
    const { id, name, email, department, activeTickets = 0, resolvedToday = 0 } = req.body;
    const stmt = db.prepare('INSERT INTO assistants (id, name, email, department, activeTickets, resolvedToday) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, name, email, department, activeTickets, resolvedToday);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create assistant' });
  }
});

app.get('/api/portal/admin/orders', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT o.*, d.name as driver_name, d.id as driver_id
      FROM orders o
      LEFT JOIN drivers d ON d.id = o.driverId
      ORDER BY o.id
    `).all();
    res.json(rows.map(mapOrderRow));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

app.post('/api/portal/admin/orders', (req, res) => {
  try {
    const db = getDb();
    const { id, customer, date, status, priority, value, driverId = null, mode = 'road', origin = '', destination = '', hub = '' } = req.body;
    const stmt = db.prepare('INSERT INTO orders (id, customer, date, status, priority, value, driverId, mode, origin, destination, hub) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, customer, date, status, priority, value, driverId, mode, origin, destination, hub);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/portal/admin/assign-driver', (req, res) => {
  try {
    const db = getDb();
    const { orderId, driverId } = req.body;
    const stmt = db.prepare('UPDATE orders SET driverId=? WHERE id=?');
    stmt.run(driverId, orderId);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to assign driver' });
  }
});

app.patch('/api/portal/admin/order-status', (req, res) => {
  try {
    const db = getDb();
    const { orderId, status } = req.body;
    db.prepare('UPDATE orders SET status=? WHERE id=?').run(status, orderId);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.listen(PORT, () => {
  console.log(`KandyPack API running on http://localhost:${PORT}`);
});
