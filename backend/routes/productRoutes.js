const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const shopAuthMiddleware = require('../middleware/shopAuthMiddleware');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG/PNG images are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Protected shop routes
router.post('/api/products', [authMiddleware, shopAuthMiddleware], upload.single('image'), productController.createProduct);
router.put('/api/products/:id', [authMiddleware, shopAuthMiddleware], upload.single('image'), productController.updateProduct);
router.delete('/api/products/:id', [authMiddleware, shopAuthMiddleware], productController.deleteProduct);

// Public routes
router.get('/api/products/:id', productController.getProductById);
router.get('/api/products', authMiddleware, productController.getProducts);

module.exports = router;