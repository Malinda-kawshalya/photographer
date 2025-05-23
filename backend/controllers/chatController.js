const Chat = require('../models/Chat');
const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');

const createChat = async (req, res) => {
  try {
    let { companyName, userId, type = 'photographer' } = req.body;
    // Normalize type to prevent case-sensitivity issues
    type = String(type).toLowerCase().trim();
    const clientId = req.user.userId; // From authMiddleware
    
    // Ensure userId is properly formatted if provided
    if (userId) {
      userId = String(userId).trim();
    }

    if (!clientId) {
      return res.status(400).json({ success: false, error: 'Client ID is required' });
    }
    
    // Enhanced logging for debugging
    console.log('Chat creation request:', { 
      type, 
      companyName, 
      userId, 
      clientId,
      typeIsString: typeof type === 'string',
      typeValue: String(type),
      typeEqualsRental: type === 'rental'
    });

    if (type === 'photographer') {
      // Photographer chat: Requires companyName
      if (!companyName) {
        return res.status(400).json({ success: false, error: 'Company name is required for photographer chats' });
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

      // Check for existing chat
      const existingChat = await Chat.findOne({ clientId, photographerId });
      if (existingChat) {
        return res.status(200).json({ success: true, chatId: existingChat._id });
      }

      // Create new photographer chat
      const newChat = new Chat({
        clientId,
        photographerId,
        companyName,
        type: 'photographer',
        messages: [],
      });

      const savedChat = await newChat.save();
      console.log('createChat: New photographer chat created:', savedChat._id);
      return res.status(201).json({ success: true, chatId: savedChat._id });
    } else if (type === 'shop') {
      // Shop chat: Requires userId
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required for shop chats' });
      }

      // Verify the shop user exists and has role 'shop'
      const shop = await User.findById(userId);
      if (!shop || shop.role !== 'shop') {
        return res.status(400).json({ success: false, error: 'Invalid shop user' });
      }

      // Check for existing chat
      const existingChat = await Chat.findOne({ clientId, shopId: userId });
      if (existingChat) {
        return res.status(200).json({ success: true, chatId: existingChat._id });
      }

      // Create new shop chat
      const newChat = new Chat({
        clientId,
        shopId: userId,
        shopName: shop.companyName || 'Shop', // Use companyName if available, else fallback
        type: 'shop',
        messages: [],
      });

      const savedChat = await newChat.save();
      console.log('createChat: New shop chat created:', savedChat._id);
      return res.status(201).json({ success: true, chatId: savedChat._id });
    } else if (type === 'rental') {
      // Shop chat: Requires userId
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required for rental chats' });
      }

      // Verify the shop user exists and has role 'shop'
      const rental = await User.findById(userId);
      if (!rental || rental.role !== 'rental') {
        return res.status(400).json({ success: false, error: 'Invalid rental user' });
      }

      // Check for existing chat
      const existingChat = await Chat.findOne({ clientId, rentalId: userId });
      if (existingChat) {
        return res.status(200).json({ success: true, chatId: existingChat._id });
      }

      // Create new rental chat
      const newChat = new Chat({
        clientId,
        rentalId: userId,
        rentalName: rental.companyName || 'Rental', // Use companyName if available, else fallback
        type: 'rental',
        messages: [],
      });

      const savedChat = await newChat.save();
      console.log('createChat: New rental chat created:', savedChat._id);
      return res.status(201).json({ success: true, chatId: savedChat._id });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid chat type' });
    }
  } catch (error) {
    console.error('Create chat error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create chat', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    console.log('Fetching chat ID:', chatId, 'for user:', userId);

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    // Verify user is authorized to access this chat
    const isAuthorized =
      chat.clientId.equals(userId) ||
      (chat.photographerId && chat.photographerId.equals(userId)) ||
      (chat.shopId && chat.shopId.equals(userId)) ||
      (chat.rentalId && chat.rentalId.equals(userId));

    if (!isAuthorized) {
      console.log('Unauthorized access attempt:', {
        userId,
        chatClientId: chat.clientId,
        chatPhotographerId: chat.photographerId,
        chatShopId: chat.shopId,
        chatRentalId: chat.rentalId
      });
      return res.status(403).json({ success: false, error: 'Unauthorized to access this chat' });
    }

    // Only verify company profile for photographer chats
    if (chat.type === 'photographer' && chat.companyName) {
      const profile = await CompanyProfile.findOne({ companyName: chat.companyName });
      if (!profile) {
        console.log('Company profile not found for:', chat.companyName);
        // Don't fail for shop chats that might have a company name set
        if (chat.photographerId) {
          return res.status(404).json({ success: false, error: 'Associated company profile not found' });
        }
      }
    }

    console.log('Successfully fetched chat of type:', chat.type);
    return res.json({ success: true, chat });
  } catch (error) {
    console.error('Get chat error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chat', 
      details: error.message 
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, sender } = req.body;
    const userId = req.user.userId;

    if (!content || !sender) {
      return res.status(400).json({ success: false, error: 'Content and sender are required' });
    }

    if (!['client', 'photographer', 'shop', 'rental'].includes(sender)) {
      return res.status(400).json({ success: false, error: 'Invalid sender type' });
    }

    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    // Verify user is part of the chat
    const isClient = chat.clientId.equals(userId);
    const isPhotographer = chat.photographerId && chat.photographerId.equals(userId);
    const isShop = chat.shopId && chat.shopId.equals(userId);
    const isRental = chat.rentalId && chat.rentalId.equals(userId);
    
    console.log('Message auth check:', { isClient, isPhotographer, isShop, isRental, userId });
    
    if (!isClient && !isPhotographer && !isShop && !isRental) {
      return res.status(403).json({ success: false, error: 'Unauthorized to send message in this chat' });
    }

    // Verify sender matches user role
    const user = await User.findById(userId);
    if (sender === 'photographer' && (user.role !== 'photographer' || chat.type !== 'photographer')) {
      return res.status(403).json({ success: false, error: 'Only photographers can send as photographer in photographer chats' });
    }
    if (sender === 'shop' && (user.role !== 'shop' || chat.type !== 'shop')) {
      return res.status(403).json({ success: false, error: 'Only shops can send as shop in shop chats' });
    }
    if (sender === 'rental' && (user.role !== 'rental' || chat.type !== 'rental')) {
      return res.status(403).json({ success: false, error: 'Only rentals can send as rental in rental chats' });
    }
    if (sender === 'client' && user.role !== 'client') {
      return res.status(403).json({ success: false, error: 'Only clients can send as client' });
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
    console.log('Fetching chats for photographer ID:', photographerId);
    const chats = await Chat.find({ photographerId })
      .populate('clientId', 'name email')
      .sort({ updatedAt: -1 });
    console.log('Found chats:', chats);
    res.json({ success: true, chats });
  } catch (error) {
    console.error('Error fetching photographer chats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chats' });
  }
};

const getShopChats = async (req, res) => {
  try {
    const shopId = req.user.userId;
    const chats = await Chat.find({ shopId })
      .populate('clientId', 'name email')
      .sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    console.error('Error fetching shop chats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chats' });
  }
};

const getRentalChats = async (req, res) => {
  try {
    const rentalId = req.user.userId;
    console.log('Fetching chats for rental provider ID:', rentalId);
    
    // Simplified query with better error handling
    const chats = await Chat.find({ rentalId, type: 'rental' })
      .populate('clientId', 'name email')
      .lean() // Use lean for better performance
      .sort({ updatedAt: -1 });
      
    console.log(`Found ${chats.length} chats for rental service provider`);
    return res.json({ success: true, chats });
    
  } catch (error) {
    console.error('Error fetching rental chats:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chats',
      details: error.message
    });
  }
};

const getClientChats = async (req, res) => {
  try {
    const clientId = req.user.userId;
    console.log('Fetching chats for client ID:', clientId);
    
    // Simplified query with better error handling
    const chats = await Chat.find({ clientId })
      .lean() // Use lean for better performance
      .sort({ updatedAt: -1 });
      
    console.log(`Found ${chats.length} chats for client`);
    return res.json({ success: true, chats });
    
  } catch (error) {
    console.error('Error fetching client chats:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chats',
      details: error.message
    });
  }
};

module.exports = { createChat, getChat, sendMessage, getPhotographerChats, getShopChats, getRentalChats, getClientChats };