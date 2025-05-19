const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  rentalProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    nicNumber: { type: String, required: true }
  },
  productDetails: {
    name: { type: String, required: true },
    rentDate: { type: Date, required: true },
    rentalDuration: { type: String, required: true },
    endDate: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rental', rentalSchema);