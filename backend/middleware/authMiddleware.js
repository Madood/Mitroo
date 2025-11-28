const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user data to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // ======================
    // 1. GET TOKEN FROM HEADER
    // ======================
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Check if token is in Bearer format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // ======================
    // 2. VERIFY TOKEN
    // ======================
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production'
    );

    // ======================
    // 3. ATTACH USER TO REQUEST
    // ======================
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error);

    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

module.exports = authMiddleware;