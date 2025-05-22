const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

const createCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From authMiddleware
    
    // Check if formData exists
    if (!req.body.formData) {
      await cleanupFiles(req.files);
      return res.status(400).json({ success: false, error: 'No form data provided' });
    }
    
    const formData = JSON.parse(req.body.formData);

    // Validate required fields
    if (!formData.companyName || !formData.mainCaption || !formData.description) {
      await cleanupFiles(req.files);
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      await cleanupFiles(req.files);
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Check if user role is photographer (being more lenient with the check)
    if (user.role.toLowerCase() !== 'photographer') {
      await cleanupFiles(req.files);
      return res.status(403).json({ success: false, error: 'Only photographers can create profiles' });
    }

    // Check companyName consistency
    if (user.companyName && user.companyName !== formData.companyName) {
      await cleanupFiles(req.files);
      return res.status(400).json({ success: false, error: 'Company name must match your user profile' });
    }

    // Check if profile already exists for this user
    const existingProfile = await CompanyProfile.findOne({ userId });
    if (existingProfile) {
      await cleanupFiles(req.files);
      return res.status(400).json({ success: false, error: 'Profile already exists for this user' });
    }

    // Check if companyName is taken
    const nameTaken = await CompanyProfile.findOne({ companyName: formData.companyName });
    if (nameTaken) {
      await cleanupFiles(req.files);
      return res.status(400).json({ success: false, error: 'Company name already taken' });
    }

    // Check if required files exist
    if (!req.files || !req.files['mainPicture'] || !req.files['subPictures'] || req.files['subPictures'].length === 0) {
      await cleanupFiles(req.files);
      return res.status(400).json({
        success: false,
        error: 'Main picture and at least one sub picture are required'
      });
    }

    // Process uploaded files
    const profileData = {
      ...formData,
      userId,
      mainPicture: {
        url: `/Uploads/${req.files['mainPicture'][0].filename}`,
        filename: req.files['mainPicture'][0].filename,
      },
      subPictures: req.files['subPictures'].map((file) => ({
        url: `/Uploads/${file.filename}`,
        filename: file.filename,
      })) || [],
    };

    const newProfile = new CompanyProfile(profileData);
    const savedProfile = await newProfile.save();

    // Update User.companyName if not set
    if (!user.companyName) {
      user.companyName = formData.companyName;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      profile: savedProfile,
    });
  } catch (error) {
    await cleanupFiles(req.files);
    console.error('Company profile creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create company profile',
      details: error.message,
    });
  }
};

const getCompanyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ companyName: req.params.companyName }).lean();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Company profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch company profile', details: error.message });
  }
};

// Helper function to clean up uploaded files
const cleanupFiles = async (files) => {
  try {
    if (!files) return;
    
    if (files['mainPicture']) {
      const filePath = path.join(__dirname, '../Uploads', files['mainPicture'][0].filename);
      await fs.unlink(filePath);
    }
    
    if (files['subPictures']) {
      await Promise.all(files['subPictures'].map((file) => {
        const filePath = path.join(__dirname, '../Uploads', file.filename);
        return fs.unlink(filePath);
      }));
    }
  } catch (err) {
    console.error('Error cleaning up files:', err);
  }
};

module.exports = { createCompanyProfile, getCompanyProfile };