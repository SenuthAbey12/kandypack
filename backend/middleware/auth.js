const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
};

// Middleware to require specific roles
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Legacy middleware - kept for backward compatibility
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Legacy middleware - kept for backward compatibility
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

// Middleware to require specific portal access
const requirePortal = (allowedPortalTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!allowedPortalTypes.includes(req.user.portalType)) {
      return res.status(403).json({
        success: false,
        message: 'Portal access denied'
      });
    }

    next();
  };
};

// Middleware for employee portal access (admin, driver, assistant)
const requireEmployeePortal = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.portalType !== 'employee') {
    return res.status(403).json({
      success: false,
      message: 'Employee portal access required'
    });
  }

  next();
};

// Middleware for customer portal access
const requireCustomerPortal = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.portalType !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Customer portal access required'
    });
  }

  next();
};

// Middleware to check if user owns the resource (for customer-specific data)
const requireOwnership = (req, res, next) => {
  const userId = req.user.id;
  const resourceUserId = req.params.userId || req.params.customerId || req.body.customer_id;

  if (req.user.role === 'admin') {
    // Admins can access all resources
    return next();
  }

  if (userId !== resourceUserId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: You can only access your own data'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePortal,
  requireEmployeePortal,
  requireCustomerPortal,
  requireOwnership,
  requireAdmin,    // Legacy
  requireCustomer, // Legacy
  requireOwnershipOrAdmin // Legacy
};