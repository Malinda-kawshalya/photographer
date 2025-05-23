const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// Important: Order matters - specific routes must come before parameterized routes

// Get all chats by user type
router.get('/photographer', authMiddleware, chatController.getPhotographerChats);
router.get('/shop', authMiddleware, chatController.getShopChats);
router.get('/rental', authMiddleware, chatController.getRentalChats);
router.get('/client', authMiddleware, chatController.getClientChats);

// Get specific chat or add messages to a chat
router.get('/:chatId', authMiddleware, chatController.getChat);
router.post('/:chatId/messages', authMiddleware, chatController.sendMessage);

// Create a new chat
router.post('/', authMiddleware, chatController.createChat);

module.exports = router;