const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token found' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from decoded token
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Attach the full user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Please authenticate' 
    });
  }
};

module.exports = authMiddleware;