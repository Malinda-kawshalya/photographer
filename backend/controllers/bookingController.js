const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    console.log('Received booking data:', req.body); // Add debug logging

    const {
      "full-name": fullName,
      email,
      organization,
      "event-type": eventType,
      "event-date": eventDate,
      "event-duration": eventDuration,
      guests,
      "venue-name": venueName,
      "venue-type": venueType,
      "venue-address": venueAddress,
      "special-instructions": specialInstructions,
      terms,
      photographerId,
    } = req.body;

    // Validate photographer ID first
    if (!photographerId) {
      return res.status(400).json({
        success: false,
        message: "Photographer ID is required"
      });
    }

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !eventType ||
      !eventDate ||
      !eventDuration ||
      !guests ||
      !venueName ||
      !venueType ||
      !venueAddress ||
      !terms
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newBooking = new Booking({
      fullName,
      email,
      organization: organization || "",
      eventType,
      eventDate: new Date(eventDate),
      eventDuration,
      guests: parseInt(guests),
      venueName,
      venueType,
      venueAddress,
      specialInstructions: specialInstructions || "",
      termsAccepted: terms === "on" || terms === true,
      photographerId, // Add this line
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: savedBooking,
      bookingId: savedBooking._id,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query params

    // If userId is provided, filter bookings by photographerId
    const query = userId ? { photographerId: userId } : {};

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch booking" });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update booking" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
};