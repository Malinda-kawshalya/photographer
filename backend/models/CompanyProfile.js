const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true, unique: true },
  mainCaption: { type: String, required: true },
  mainPicture: {
    url: String,
    filename: String
  },
  subPictures: [{
    url: String,
    filename: String
  }],
  description: { type: String, required: true },
  companyDetails: {
    address: { type: String, required: true },
    responseTime: { type: String, required: true },
    languages: { type: String, required: true },
    memberSince: String,
    lastEvent: String
  },
  photographyPackages: {
    wedding: { price: String, description: String },
    photoshoots: { price: String, description: String },
    musicEvents: { price: String, description: String },
    graduation: { price: String, description: String },
    productShoots: { price: String, description: String },
    otherEvents: { price: String, description: String }
  },
  videographyPackages: {
    wedding: { price: String, description: String },
    documentary: { price: String, description: String },
    musicEvents: { price: String, description: String },
    otherEvents: { price: String, description: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster lookups
companyProfileSchema.index({ companyName: 1 });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);