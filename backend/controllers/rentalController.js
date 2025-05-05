const Rental = require('../models/Rental');
const RentalProduct = require('../models/RentalProduct');
const User = require('../models/User');


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

module.exports = { createRental, getAllRentals, updateRentalStatus, createRentalProduct, getRentalProducts, getRentals };