const Order = require('../models/Order');
const User = require('../models/User');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productPrice,
      discountedPrice,
      shopId,
      shopName,
      productType,
      billingDetails,
      paymentMethod,
      paymentStatus
    } = req.body;

    // Get userId from authenticated user
    const userId = req.user._id;

    const newOrder = new Order({
      productId,
      productName,
      productPrice,
      discountedPrice,
      shopId,
      shopName,
      userId,
      productType,
      billingDetails,
      paymentMethod,
      paymentStatus
    });

    const savedOrder = await newOrder.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('productId', 'name image')
      .populate('shopId', 'username companyName');
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all orders for a shop
exports.getShopOrders = async (req, res) => {
  try {
    const shopId = req.user._id;
    
    const orders = await Order.find({ shopId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')
      .populate('productId', 'name image');
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update order status

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus, updatedAt: Date.now() }, // Update status and timestamp
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order); // Return the updated order
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
