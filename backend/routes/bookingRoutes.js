const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/api/bookings", bookingController.createBooking);
router.get("/api/bookings", bookingController.getAllBookings);
router.get("/api/bookings/:id", bookingController.getBookingById);
router.patch("/api/bookings/:id", bookingController.updateBookingStatus);

module.exports = router;