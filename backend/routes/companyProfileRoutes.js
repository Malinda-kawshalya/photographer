const express = require('express');
const router = express.Router();
const { createCompanyProfile, getCompanyProfile } = require('../controllers/companyProfileController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Fixed Multer configuration with proper path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path with path.join for cross-platform compatibility
    cb(null, path.join(__dirname, '../Uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'mainPicture', maxCount: 1 },
    { name: 'subPictures', maxCount: 3 }
  ]),
  createCompanyProfile
);
router.get('/:companyName', getCompanyProfile);

module.exports = router;