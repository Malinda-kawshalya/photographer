const express = require("express");
const router = express.Router();
const photographerController = require("../controllers/photographerController");
const shopController = require("../controllers/shopController");
const rentalController = require("../controllers/rentalController");
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get("/api/photographers", photographerController.getPhotographers);
router.get("/api/sellers", shopController.getSellers);
router.get("/api/rentals", rentalController.getRentals);

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
};

router.get('/users', authMiddleware, adminOnly, getAllUsers);
router.post('/users', authMiddleware, adminOnly, createUser);
router.put('/users/:id', authMiddleware, adminOnly, updateUser);
router.delete('/users/:id', authMiddleware, adminOnly, deleteUser);

module.exports = router;