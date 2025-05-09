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

    // Validate required fields
    if (
      !rentalData.customerDetails?.name ||
      !rentalData.customerDetails?.email ||
      !rentalData.customerDetails?.nicNumber ||
      !rentalData.productDetails?.name ||
      !rentalData.productDetails?.rentDate ||
      !rentalData.productDetails?.rentalDuration ||
      !rentalData.productDetails?.endDate
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRental = new Rental(rentalData);
    await newRental.save();

    res.status(201).json({
      success: true,
      message: 'Rental created successfully',
      rental: newRental,
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ error: 'Server error while creating rental' });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.json({ rentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ error: 'Server error while fetching rentals' });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
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

    // Validate required fields
    if (!name || !description || !pricePerDay || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const rentalProduct = new RentalProduct({
      userId: req.user.userId, // From JWT token
      name,
      description,
      pricePerDay: parseFloat(pricePerDay),
      discount: parseFloat(discount) || 0,
      image: {
        url: `/uploads/${image.filename}`,
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

    // Check if user is authorized
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    // Handle image update if new image is uploaded
    if (req.file) {
      // Remove old image
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

    // Update other fields
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

    // Check if user is authorized
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    // Delete product image
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