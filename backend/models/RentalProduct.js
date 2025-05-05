const mongoose = require('mongoose');

const rentalProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RentalProduct', rentalProductSchema);