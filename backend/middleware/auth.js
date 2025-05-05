const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Check if no token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user from payload
      req.user = decoded;
      
      // Optional: Check if user still exists in DB
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }
      
      next();
    } catch (err) {
      res.status(401).json({ success: false, error: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = authMiddleware;