const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Chat = require('./models/Chat');
const multer = require('multer'); // Add multer import
const fs = require('fs');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const companyProfileRoutes = require('./routes/companyProfileRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');
const emailRoutes = require('./routes/emailRoutes');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files - make sure path is consistent with your code
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/photographerDB';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join chat room
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Handle new message
  socket.on('sendMessage', async ({ chatId, userId, content }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        socket.emit('error', { message: 'Chat not found' });
        return;
      }
      if (!chat.participants.includes(userId)) {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      const message = {
        senderId: userId,
        content,
        timestamp: new Date()
      };
      chat.messages.push(message);
      await chat.save();

      io.to(chatId).emit('newMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Mount routes
app.use(authRoutes);
app.use(userRoutes);
app.use(bookingRoutes);
app.use('/api/company-profile', companyProfileRoutes);
app.use(rentalRoutes);
app.use(productRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api', emailRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error', details: err.message });
  }
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));