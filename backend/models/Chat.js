const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true, enum: ['client', 'photographer'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true }, // For reference to CompanyProfile
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

// Index for faster lookups
chatSchema.index({ clientId: 1, photographerId: 1 });

module.exports = mongoose.model('Chat', chatSchema);