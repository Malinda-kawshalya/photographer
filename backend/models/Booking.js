const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  organization: String,
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventDuration: { type: String, required: true },
  guests: { type: Number, required: true },
  venueName: { type: String, required: true },
  venueType: { type: String, required: true },
  venueAddress: { type: String, required: true },
  specialInstructions: String,
  termsAccepted: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  photographerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
});

module.exports = mongoose.model('Booking', bookingSchema);