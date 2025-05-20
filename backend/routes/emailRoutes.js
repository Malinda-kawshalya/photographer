const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/send-email', async (req, res) => {
  const { to, name, eventType, eventDate, venueName } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Booking Confirmation - Photography Services',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${name},</p>
      <p>Thank you for booking our photography services. Here are your booking details:</p>
      <ul>
        <li><strong>Event Type:</strong> ${eventType}</li>
        <li><strong>Event Date:</strong> ${new Date(eventDate).toLocaleString()}</li>
        <li><strong>Venue:</strong> ${venueName}</li>
      </ul>
      <p>We will contact you shortly to discuss further details.</p>
      <p>Best regards,<br>Your Photography Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;