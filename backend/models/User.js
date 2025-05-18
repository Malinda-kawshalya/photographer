const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['admin','client', 'photographer', 'rental', 'shop'],
    },
    // Photographer-specific fields
    companyName: { type: String },
    description: { type: String },
    companyLogo: {
      url: { type: String },
      filename: { type: String },
    },
    location: { type: String },
    languages: { type: [String], default: [] },
    hideLocation: { type: Boolean, default: false },
    district: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;