const Database = require('better-sqlite3');
const path = require('path');

let db;

function getDb() {
  if (!db) {
    db = new Database(path.join(__dirname, '..', 'data.sqlite'));
  }
  return db;
}

function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      vehicle TEXT,
      status TEXT,
      deliveries INTEGER,
      rating REAL
    );
    
    CREATE TABLE IF NOT EXISTS assistants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      department TEXT,
      activeTickets INTEGER,
      resolvedToday INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer TEXT NOT NULL,
      date TEXT,
      status TEXT,
      priority TEXT,
      value INTEGER,
      driverId TEXT,
      mode TEXT,
      origin TEXT,
      destination TEXT,
      hub TEXT,
      FOREIGN KEY (driverId) REFERENCES drivers(id)
    );
  `);

  // Seed if empty
  const driverCount = db.prepare('SELECT COUNT(*) as c FROM drivers').get().c;
  if (driverCount === 0) {
    const insertDriver = db.prepare('INSERT INTO drivers (id, name, phone, vehicle, status, deliveries, rating) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertDriver.run('DRV001', 'John Smith', '+94771234567', 'Van-001', 'active', 23, 4.8);
    insertDriver.run('DRV002', 'Sarah Johnson', '+94772345678', 'Truck-002', 'active', 19, 4.9);
    insertDriver.run('DRV003', 'Mike Wilson', '+94773456789', 'Van-003', 'busy', 31, 4.7);
    insertDriver.run('DRV004', 'Lisa Garcia', '+94774567890', 'Bike-004', 'active', 15, 4.6);
  }

  const asstCount = db.prepare('SELECT COUNT(*) as c FROM assistants').get().c;
  if (asstCount === 0) {
    const insertAssistant = db.prepare('INSERT INTO assistants (id, name, email, department, activeTickets, resolvedToday) VALUES (?, ?, ?, ?, ?, ?)');
    insertAssistant.run('AST001', 'Emma Davis', 'emma@kandypack.com', 'Customer Support', 5, 8);
    insertAssistant.run('AST002', 'David Brown', 'david@kandypack.com', 'Technical Support', 3, 12);
    insertAssistant.run('AST003', 'Lisa Garcia', 'lisa@kandypack.com', 'Logistics Support', 7, 6);
  }

  const orderCount = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
  if (orderCount === 0) {
    const insertOrder = db.prepare('INSERT INTO orders (id, customer, date, status, priority, value, driverId, mode, origin, destination, hub) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const today = new Date().toISOString().slice(0,10);
    insertOrder.run('ORD001', 'Alice Johnson', today, 'pending', 'high', 25000, 'DRV001', 'rail', 'Colombo', 'Kandy', 'Kadugannawa Yard');
    insertOrder.run('ORD002', 'Bob Wilson', today, 'in-transit', 'medium', 15000, 'DRV002', 'road', 'Matara', 'Galle', 'Galle Hub');
    insertOrder.run('ORD003', 'Carol Davis', today, 'delivered', 'low', 8500, 'DRV003', 'road', 'Negombo', 'Colombo', 'Kelaniya Hub');
    insertOrder.run('ORD004', 'Daniel Miller', today, 'rail-pending', 'urgent', 32000, null, 'rail', 'Jaffna', 'Anuradhapura', 'Anuradhapura Yard');
    insertOrder.run('ORD005', 'Eva Thompson', today, 'processing', 'medium', 12000, 'DRV004', 'road', 'Kandy', 'Badulla', 'Peradeniya Hub');
  }
}

module.exports = { getDb, initDb };
