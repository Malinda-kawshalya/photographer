// controllers/rentalController.js
const mongoose = require('mongoose');
const Rental = require('../models/Rental');
const RentalProduct = require('../models/RentalProduct');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

const getRentals = async (req, res) => {
  try {
    const rentals = await User.find({ role: "rental" }).select(
      "username email companyName description companyLogo"
    );
    res.json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch rentals" });
  }
};

const createRental = async (req, res) => {
  try {
    const rentalData = req.body;
    console.log('Rental data received:', JSON.stringify(rentalData, null, 2));

    // Validate required fields
    const requiredFields = {
      'rentalProviderId': 'Rental provider ID is required',
      'customerDetails.name': 'Customer name is required',
      'customerDetails.email': 'Email is required',
      'customerDetails.nicNumber': 'NIC number is required',
      'productDetails.name': 'Product name is required',
      'productDetails.quantity': 'Quantity is required',
      'productDetails.rentDate': 'Rent date is required',
      'productDetails.rentalDuration': 'Rental duration is required',
      'productDetails.endDate': 'End date is required',
      'price': 'Price is required'
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      const [parent, child] = field.split('.');
      let value;
      if (child) {
        value = rentalData[parent]?.[child];
      } else {
        value = rentalData[parent];
      }
      if (!value || (typeof value === 'string' && !value.trim())) {
        return res.status(400).json({ error: message });
      }
    }

    // Validate rentalProviderId
    if (!mongoose.Types.ObjectId.isValid(rentalData.rentalProviderId)) {
      return res.status(400).json({ error: 'Invalid rental provider ID' });
    }

    // Validate numeric fields
    const quantity = parseInt(rentalData.productDetails.quantity);
    const rentalDuration = parseInt(rentalData.productDetails.rentalDuration);
    
    // Handle price correctly - it should be at the root level
    let price;
    if (rentalData.price !== undefined) {
      price = parseFloat(rentalData.price);
      console.log('Price from request root:', rentalData.price, 'Parsed price:', price);
    } else {
      console.log('Price is undefined in request');
      return res.status(400).json({ error: 'Price is required' });
    }

    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a number greater than or equal to 1' });
    }

    if (isNaN(rentalDuration) || rentalDuration < 1) {
      return res.status(400).json({ error: 'Rental duration must be a number greater than or equal to 1' });
    }

    if (isNaN(price) || price < 1000) {
      return res.status(400).json({ error: 'Price must be a number greater than or equal to 1000' });
    }

    // Validate date fields
    const rentDate = new Date(rentalData.productDetails.rentDate);
    const endDate = new Date(rentalData.productDetails.endDate);
    const currentDate = new Date();

    if (isNaN(rentDate.getTime()) || rentDate < currentDate) {
      return res.status(400).json({ error: 'Rent date must be a valid date and not in the past' });
    }

    if (isNaN(endDate.getTime()) || endDate <= rentDate) {
      return res.status(400).json({ error: 'End date must be a valid date and after the rent date' });
    }

    // Create new rental document with explicit price field
    const newRental = new Rental({
      rentalProviderId: rentalData.rentalProviderId,
      customerDetails: {
        name: rentalData.customerDetails.name,
        email: rentalData.customerDetails.email,
        nicNumber: rentalData.customerDetails.nicNumber,
        address: rentalData.customerDetails.address || '' // Optional field
      },
      productDetails: {
        name: rentalData.productDetails.name,
        quantity: quantity,
        rentDate: rentDate,
        rentalDuration: rentalDuration,
        endDate: endDate,
        price: price,
      },
      status: rentalData.status || 'pending'
    });
    
    console.log('New rental document before save:', JSON.stringify(newRental, null, 2));

    const savedRental = await newRental.save();
    console.log('Saved rental document:', JSON.stringify(savedRental, null, 2));

    res.status(201).json({
      success: true,
      message: 'Rental created successfully',
      rental: savedRental
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ error: 'Server error while creating rental' });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const userId = req.query.userId;
    let query = {};
    
    if (userId) {
      query.rentalProviderId = userId;
    }

    const rentals = await Rental.find(query)
      .sort({ createdAt: -1 })
      .populate('rentalProviderId', 'username companyName');
      
    res.json({ success: true, rentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching rentals' 
    });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Allowed values are: pending, accepted, cancelled' });
    }

    const updatedRental = await Rental.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedRental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    res.json(updatedRental);
  } catch (error) {
    console.error('Error updating rental status:', error);
    res.status(500).json({ error: 'Server error while updating rental status' });
  }
};

const createRentalProduct = async (req, res) => {
  try {
    const { name, description, pricePerDay, discount } = req.body;
    const image = req.file;

    if (!name || !description || !pricePerDay || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const rentalProduct = new RentalProduct({
      userId: req.user.userId,
      name,
      description,
      pricePerDay: parseFloat(pricePerDay),
      discount: parseFloat(discount) || 0,
      image: {
        url: `/Uploads/${image.filename}`,
        filename: image.filename
      }
    });

    await rentalProduct.save();

    res.status(201).json({
      success: true,
      message: 'Rental product created successfully',
      rentalProduct
    });
  } catch (error) {
    console.error('Error creating rental product:', error);
    res.status(500).json({ error: 'Server error while creating rental product' });
  }
};

const getRentalProducts = async (req, res) => {
  try {
    const rentalProducts = await RentalProduct.find().populate('userId', 'username companyName');
    res.json({ success: true, rentalProducts });
  } catch (error) {
    console.error('Error fetching rental products:', error);
    res.status(500).json({ error: 'Server error while fetching rental products' });
  }
};

const updateRentalProduct = async (req, res) => {
  try {
    const { name, description, pricePerDay, discount } = req.body;
    const productId = req.params.id;

    const product = await RentalProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', product.image.url);
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.error('Error deleting old image:', err);
      }

      product.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.pricePerDay = pricePerDay ? parseFloat(pricePerDay) : product.pricePerDay;
    product.discount = discount ? parseFloat(discount) : product.discount;

    await product.save();

    res.json({
      success: true,
      message: 'Rental product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating rental product:', error);
    res.status(500).json({ success: false, message: 'Failed to update rental product' });
  }
};

const deleteRentalProduct = async (req, res) => {
  try {
    const product = await RentalProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    const imagePath = path.join(__dirname, '..', product.image.url);
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error('Error deleting image:', err);
    }

    await RentalProduct.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Rental product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rental product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete rental product' });
  }
};

module.exports = { createRental, getAllRentals, updateRentalStatus, createRentalProduct, getRentalProducts, getRentals, updateRentalProduct, deleteRentalProduct };