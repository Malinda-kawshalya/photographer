const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
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
    } = req.body;

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
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
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