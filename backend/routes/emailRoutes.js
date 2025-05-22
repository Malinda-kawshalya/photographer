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

// Original booking confirmation email route
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

// New route for order status update notifications
router.post('/order-status', async (req, res) => {
  const { to, name, productName, orderStatus, orderDate, shopName } = req.body;

  let subject = '';
  let heading = '';
  let statusText = '';
  
  switch(orderStatus) {
    case 'accepted':
      subject = 'Order Accepted - Thank You For Your Purchase';
      heading = 'Order Accepted';
      statusText = 'Your order has been accepted and is being processed.';
      break;
    case 'delivered':
      subject = 'Order Delivered - Thank You For Your Purchase';
      heading = 'Order Delivered';
      statusText = 'Your order has been delivered.';
      break;
    default:
      subject = 'Order Status Update';
      heading = 'Order Status Update';
      statusText = `Your order status has been updated to: ${orderStatus}`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: `
      <h1>${heading}</h1>
      <p>Dear ${name},</p>
      <p>${statusText}</p>
      <p>Here are your order details:</p>
      <ul>
        <li><strong>Product:</strong> ${productName}</li>
        <li><strong>Shop:</strong> ${shopName}</li>
        <li><strong>Order Date:</strong> ${new Date(orderDate).toLocaleString()}</li>
        <li><strong>Status:</strong> ${orderStatus}</li>
      </ul>
      <p>Thank you for your purchase!</p>
      <p>Best regards,<br>${shopName} Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Status update email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// New route for rental status update notifications
router.post('/rental-status', async (req, res) => {
  const { to, name, productName, status, rentDate, rentalDuration, rentalProvider } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Rental Request Accepted',
    html: `
      <h1>Rental Request Accepted</h1>
      <p>Dear ${name},</p>
      <p>Your rental request has been accepted. Here are your rental details:</p>
      <ul>
        <li><strong>Product:</strong> ${productName}</li>
        <li><strong>Rental Provider:</strong> ${rentalProvider}</li>
        <li><strong>Rental Date:</strong> ${new Date(rentDate).toLocaleString()}</li>
        <li><strong>Duration:</strong> ${rentalDuration} days</li>
      </ul>
      <p>Thank you for using our service!</p>
      <p>Best regards,<br>${rentalProvider} Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Rental status update email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// New route for photographer booking status update notifications
router.post('/booking-status', async (req, res) => {
  const { to, name, eventType, eventDate, status, photographerName } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Photography Booking Accepted',
    html: `
      <h1>Photography Booking Accepted</h1>
      <p>Dear ${name},</p>
      <p>Your photography booking has been accepted. Here are your booking details:</p>
      <ul>
        <li><strong>Event Type:</strong> ${eventType}</li>
        <li><strong>Event Date:</strong> ${new Date(eventDate).toLocaleString()}</li>
        <li><strong>Photographer:</strong> ${photographerName}</li>
      </ul>
      <p>We're looking forward to capturing your special moments!</p>
      <p>Best regards,<br>${photographerName}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Booking status update email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;