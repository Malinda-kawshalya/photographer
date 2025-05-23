const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['client', 'photographer', 'shop', 'rental'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rentalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String },
  shopName: { type: String },
  rentalName: { type: String },
  type: { type: String, enum: ['photographer', 'shop', 'rental'], required: true },
  messages: [
    {
      sender: { type: String, enum: ['client', 'photographer', 'shop', 'rental'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


chatSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chat', chatSchema);