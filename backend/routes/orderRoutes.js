const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// Create a new order - requires authentication
router.post('/', authMiddleware, orderController.createOrder);

// Get all orders for the authenticated user
router.get('/my-orders', authMiddleware, orderController.getUserOrders);

// Get all orders for the authenticated shop owner
router.get('/shop-orders', authMiddleware, orderController.getShopOrders);

// Update order status (shop owners only)
router.patch('/:orderId', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
