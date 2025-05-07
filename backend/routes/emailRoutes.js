const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter using your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-specific-password'
  }
});

router.post('/send-email', async (req, res) => {
  const { to, name, eventType, eventDate, venueName } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
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
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;