// models/Rental.js
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
    nicNumber: { type: String, required: true },
    address: { type: String } // Added address field
  },
  productDetails: {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }, // Added quantity
    rentDate: { type: Date, required: true },
    rentalDuration: { type: Number, required: true, min: 1 }, // Changed to Number
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rental', rentalSchema);