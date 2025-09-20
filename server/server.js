import express from 'express';
import cors from 'cors';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'kandypack.db');
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

async function init() {
  await run(`CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    deliveries INTEGER DEFAULT 0,
    rating REAL DEFAULT 5.0,
    phone TEXT,
    vehicle TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS assistants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    department TEXT,
    activeTickets INTEGER DEFAULT 0,
    resolvedToday INTEGER DEFAULT 0
  )`);

  await run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    status TEXT NOT NULL,
    value INTEGER,
    driverId TEXT,
    driverName TEXT,
    date TEXT,
    priority TEXT,
    mode TEXT CHECK(mode IN ('rail','road')),
    origin TEXT,
    destination TEXT
  )`);

  const driverCount = await get('SELECT COUNT(*) as cnt FROM drivers');
  if (driverCount.cnt === 0) {
    await run(`INSERT INTO drivers (id, name, status, deliveries, rating, phone, vehicle) VALUES
      ('DRV001','John Smith','active',23,4.8,'+94771234567','Van-001'),
      ('DRV002','Sarah Johnson','active',19,4.9,'+94772345678','Truck-002'),
      ('DRV003','Mike Wilson','busy',31,4.7,'+94773456789','Van-003'),
      ('DRV004','Lisa Garcia','active',15,4.6,'+94774567890','Bike-004')
    `);
  }

  const astCount = await get('SELECT COUNT(*) as cnt FROM assistants');
  if (astCount.cnt === 0) {
    await run(`INSERT INTO assistants (id, name, email, department, activeTickets, resolvedToday) VALUES
      ('AST001','Emma Davis','emma@kandypack.com','Customer Support',5,8),
      ('AST002','David Brown','david@kandypack.com','Technical Support',3,12),
      ('AST003','Lisa Garcia','lisa@kandypack.com','Logistics Support',7,6)
    `);
  }

  const orderCount = await get('SELECT COUNT(*) as cnt FROM orders');
  if (orderCount.cnt === 0) {
    const today = new Date().toISOString().split('T')[0];
    await run(`INSERT INTO orders (id, customer, status, value, driverId, driverName, date, priority, mode, origin, destination) VALUES
      ('ORD001','Alice Johnson','pending',25000,'DRV001','John Smith','${today}','high','road','Colombo','Kandy'),
      ('ORD002','Bob Wilson','in-transit',15000,'DRV002','Sarah Johnson','${today}','medium','rail','Galle','Jaffna'),
      ('ORD003','Carol Davis','delivered',8500,'DRV003','Mike Wilson','${today}','low','road','Negombo','Matara'),
      ('ORD004','Daniel Miller','pending',32000,NULL,NULL,'${today}','urgent','rail','Colombo','Batticaloa'),
      ('ORD005','Eva Thompson','processing',12000,'DRV004','Lisa Garcia','${today}','medium','road','Kandy','Colombo')
    `);
  }
}

app.get('/api/portal/admin/stats', async (req, res) => {
  try {
    const [orders, drivers, assistants, pending, completedToday] = await Promise.all([
      get('SELECT COUNT(*) as c FROM orders'),
      get('SELECT COUNT(*) as c FROM drivers'),
      get('SELECT COUNT(*) as c FROM assistants'),
      get("SELECT COUNT(*) as c FROM orders WHERE status='pending'"),
      get("SELECT COUNT(*) as c FROM orders WHERE status='delivered' AND date=date('now')")
    ]);
    res.json({
      totalOrders: orders.c,
      totalDrivers: drivers.c,
      totalAssistants: assistants.c,
      totalCustomers: 342,
      pendingOrders: pending.c,
      completedToday: completedToday.c
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/portal/admin/drivers', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM drivers');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/portal/admin/assistants', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM assistants');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/portal/admin/orders', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM orders ORDER BY date DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/portal/admin/assign-driver', async (req, res) => {
  try {
    const { orderId, driverId } = req.body;
    const driver = await get('SELECT id, name FROM drivers WHERE id = ?', [driverId]);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    await run('UPDATE orders SET driverId=?, driverName=?, status=? WHERE id=?', [driver.id, driver.name, 'processing', orderId]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/portal/admin/orders', async (req, res) => {
  try {
    const { id, customer, value, priority, mode, origin, destination } = req.body;
    const date = new Date().toISOString().split('T')[0];
    await run('INSERT INTO orders (id, customer, status, value, driverId, driverName, date, priority, mode, origin, destination) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [id, customer, 'pending', value, null, null, date, priority, mode, origin, destination]
    );
    const created = await get('SELECT * FROM orders WHERE id=?', [id]);
    res.json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/portal/admin/orders/status', async (req, res) => {
  try {
    const { id, status } = req.body;
    await run('UPDATE orders SET status=? WHERE id=?', [status, id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

init().then(() => {
  app.listen(PORT, () => console.log(`KandyPack server running at http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to init DB', err);
  process.exit(1);
});
