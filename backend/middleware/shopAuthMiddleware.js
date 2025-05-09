const shopAuthMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'shop') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Shop privileges required.' 
      });
    }
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

module.exports = shopAuthMiddleware;