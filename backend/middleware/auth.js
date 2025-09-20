const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Middleware to check if user is customer
const requireCustomer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer access required' });
  }

  next();
};

// Middleware to check if user is either admin or the customer making the request
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin can access anything
  if (req.user.role === 'admin') {
    return next();
  }

  // Customer can only access their own data
  if (req.user.role === 'customer') {
    // Check if the customer ID in the request matches the authenticated user
    const customerId = req.params.customerId || req.body.customer_id || req.user.id;
    
    if (customerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    return next();
  }

  return res.status(403).json({ error: 'Access denied' });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCustomer,
  requireOwnershipOrAdmin
};