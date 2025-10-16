const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();
// Validate critical environment configuration before continuing
require('./config/requiredEnv');

const database = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const databaseRoutes = require('./routes/database');
const dashboardRoutes = require('./routes/dashboard');

// Import new portal routes
const portalAuthRoutes = require('./routes/portalAuth');
const driverAPIRoutes = require('./routes/driverAPI');
const assistantAPIRoutes = require('./routes/assistantAPI');

// Auth middleware
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration (allow common local dev URLs)
const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173', // Vite
  'http://127.0.0.1:5173'
];
const userOrigin = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];
const allowedOrigins = new Set([...defaultOrigins, ...userOrigin]);

//********************************************************************* */

const setupUsers = require('./setupUsers');

app.use(express.json());

// Run admin insertion then start server
(async () => {
  await setupUsers();

  app.listen(PORT, () => {
    console.log(`🚀 KandyPack API Server running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
      console.log('✅ Database connection successful');
    }
  });
})();




//********************************************************************* */

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (no origin)
    if (!origin) return callback(null, true);
    // Allow any localhost/127.0.0.1 origin with any port (dev convenience)
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d{2,5}$/.test(origin);
    if (isLocalhost || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
};

app.use(cors(corsOptions));
// Explicitly handle preflight for all routes
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection on startup
database.testConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
// Secure orders routes - require valid JWT for all order endpoints
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/database', databaseRoutes);
// Secure dashboard routes - requires authentication
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Portal-specific routes
app.use('/api/portal/auth', portalAuthRoutes);
app.use('/api/portal/driver', driverAPIRoutes);
app.use('/api/portal/assistant', assistantAPIRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'KandyPack API is running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
