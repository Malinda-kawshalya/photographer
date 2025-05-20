const Chat = require('../models/Chat');
const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');

const createChat = async (req, res) => {
  try {
    const { companyName } = req.body;
    const clientId = req.user.userId; // From authMiddleware

    if (!companyName || !clientId) {
      return res.status(400).json({ success: false, error: 'Company name and client ID are required' });
    }

    // Find the photographer's profile to get their userId
    const profile = await CompanyProfile.findOne({ companyName });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Company profile not found' });
    }

    if (!profile.userId) {
      return res.status(400).json({ success: false, error: 'Company profile is not linked to a user' });
    }

    const photographer = await User.findById(profile.userId);
    if (!photographer || photographer.role !== 'photographer') {
      return res.status(400).json({ success: false, error: 'Invalid photographer profile' });
    }

    const photographerId = profile.userId;

    // Check for existing chat between client and photographer
    const existingChat = await Chat.findOne({
      clientId,
      photographerId,
    });

    if (existingChat) {
      return res.status(200).json({ success: true, chatId: existingChat._id });
    }

    // Create new chat
    const newChat = new Chat({
      clientId,
      photographerId,
      companyName,
      messages: [],
    });

    const savedChat = await newChat.save();
    console.log('createChat: New chat created:', savedChat._id);
    res.status(201).json({ success: true, chatId: savedChat._id });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ success: false, error: 'Failed to create chat', details: error.message });
  }
};

const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId; // From authMiddleware

    const chat = await Chat.findOne({ _id: chatId }).lean();
    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    // Verify user is part of the chat
    if (!chat.clientId.equals(userId) && !chat.photographerId.equals(userId)) {
      return res.status(403).json({ success: false, error: 'Unauthorized to access this chat' });
    }

    // Verify company profile exists
    const profile = await CompanyProfile.findOne({ companyName: chat.companyName });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Associated company profile not found' });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chat', details: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, sender } = req.body;
    const userId = req.user.userId; // From authMiddleware

    if (!content || !sender) {
      return res.status(400).json({ success: false, error: 'Content and sender are required' });
    }

    if (!['client', 'photographer'].includes(sender)) {
      return res.status(400).json({ success: false, error: 'Invalid sender type' });
    }

    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    // Verify user is part of the chat
    if (!chat.clientId.equals(userId) && !chat.photographerId.equals(userId)) {
      return res.status(403).json({ success: false, error: 'Unauthorized to send message in this chat' });
    }

    // Verify sender matches user role
    const user = await User.findById(userId);
    if (sender === 'photographer' && user.role !== 'photographer') {
      return res.status(403).json({ success: false, error: 'Only photographers can send as photographer' });
    }
    if (sender === 'client' && user.role === 'photographer') {
      return res.status(403).json({ success: false, error: 'Photographers cannot send as client' });
    }

    const newMessage = {
      sender,
      content,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message', details: error.message });
  }
};

const getPhotographerChats = async (req, res) => {
  try {
    const photographerId = req.user.userId;
    const chats = await Chat.find({ photographerId })
      .populate('clientId', 'name email') // Add this populate to get client details
      .populate('messages')
      .sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chats' });
  }
};

module.exports = { createChat, getChat, sendMessage, getPhotographerChats };

