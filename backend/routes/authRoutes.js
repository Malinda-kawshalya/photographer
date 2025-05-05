const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, updateProfilePicture } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'Uploads/' });

router.post('/register', upload.single('companyLogo'), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/profile/picture', authMiddleware, upload.single('companyLogo'), updateProfilePicture);

module.exports = router;