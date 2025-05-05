const express = require('express');
const router = express.Router();
const { createChat, getChat, sendMessage, getPhotographerChats } = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createChat);
router.get('/:chatId', authMiddleware, getChat);
router.post('/:chatId/messages', authMiddleware, sendMessage);
router.get('/', authMiddleware, getPhotographerChats); // New endpoint for photographer chats

module.exports = router;