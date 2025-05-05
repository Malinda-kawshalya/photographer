const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// Rental transaction routes
router.post('/api/rental-transactions', rentalController.createRental);
router.get('/api/rental-transactions', rentalController.getAllRentals);
router.patch('/api/rental-transactions/:id', rentalController.updateRentalStatus);

// Rental product routes
router.post(
  '/api/rental-products',
  authMiddleware,
  upload.single('image'),
  rentalController.createRentalProduct
);
router.get('/api/rental-products', rentalController.getRentalProducts);

module.exports = router;