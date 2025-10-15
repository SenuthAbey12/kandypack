import express from 'express';
import cors from 'cors';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  // Customers table for auth/registration
  await run(`CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone_no TEXT,
    city TEXT,
    address TEXT
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

// ---- Auth helpers (JWT) ----
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

// ---- Auth routes (customer-only for this SQLite server) ----
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, user_name, password, phone_no, city, address } = req.body || {};

    if (!name || !user_name || !password) {
      return res.status(400).json({ error: 'Name, username, and password are required' });
    }

    const existing = await get('SELECT user_name FROM customers WHERE user_name = ?', [user_name]);
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const customer_id = `CUS${Date.now().toString().slice(-6)}`;

    await run(
      `INSERT INTO customers (customer_id, name, user_name, password, phone_no, city, address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, name, user_name, hashed, phone_no || null, city || null, address || null]
    );

    const user = { customer_id, name, user_name, phone_no, city, address, role: 'customer', portalType: 'customer' };
    const token = signToken({ id: customer_id, username: user_name, role: 'customer', name, portalType: 'customer' });

    res.status(201).json({ message: 'Customer registered successfully', user, token });
  } catch (e) {
    console.error('Registration error (sqlite):', e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body || {};
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    if (role !== 'customer') {
      return res.status(400).json({ error: 'Only customer login is supported by this server' });
    }

    const user = await get('SELECT customer_id as id, name, user_name as username, password, phone_no, city, address FROM customers WHERE user_name = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _pw, ...userWithoutPassword } = user;
    const token = signToken({ id: user.id, username: user.username, role: 'customer', name: user.name, portalType: 'customer' });

    res.json({
      message: 'Login successful',
      user: { ...userWithoutPassword, role: 'customer', portalType: 'customer', isCustomer: true, isEmployee: false },
      token
    });
  } catch (e) {
    console.error('Login error (sqlite):', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No token provided' });
      // Dev utility: list customers (no passwords)
      app.get('/api/dev/customers', async (req, res) => {
        try {
          const rows = await all('SELECT customer_id, name, user_name, phone_no, city, address FROM customers ORDER BY customer_id DESC');
          res.json(rows);
        } catch (e) {
          res.status(500).json({ error: e.message });
        }
      });


    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(401).json({ error: 'Invalid role in token' });
    }

    const user = await get('SELECT customer_id as id, name, user_name as username, phone_no, city, address FROM customers WHERE customer_id = ?', [decoded.id]);
    if (!user) return res.status(401).json({ error: 'User not found' });

    res.json({
      user: { ...user, role: 'customer', portalType: 'customer', isCustomer: true, isEmployee: false },
      valid: true
    });
  } catch (e) {
    console.error('Verify error (sqlite):', e);
    res.status(401).json({ error: 'Invalid token' });
  }
});

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
