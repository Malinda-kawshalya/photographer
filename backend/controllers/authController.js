const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password, role, companyName, description, district } = req.body; // Add district here
    const companyLogo = req.file;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      companyName,
      description,
      companyLogo: companyLogo
        ? { url: `/uploads/${companyLogo.filename}`, filename: companyLogo.filename }
        : undefined,
      district: role === 'photographer' ? district : null, // Now district will be properly assigned
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        description: user.description,
        companyLogo: user.companyLogo,
        district: user.district,
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error while registering user' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        description: user.description,
        companyLogo: user.companyLogo,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error while logging in' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ success: false, message: 'Server error while logging out' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { companyName, description, location, languages, hideLocation, username } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    user.companyName = companyName || user.companyName;
    user.description = description || user.description;
    user.location = location || user.location;
    user.languages = languages || user.languages;
    user.hideLocation = hideLocation !== undefined ? hideLocation : user.hideLocation;
    user.username = username || user.username;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        description: user.description,
        location: user.location,
        languages: user.languages,
        hideLocation: user.hideLocation,
        companyLogo: user.companyLogo,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const companyLogo = req.file;
    if (!companyLogo) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    user.companyLogo = {
      url: `/uploads/${companyLogo.filename}`,
      filename: companyLogo.filename,
    };

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        description: user.description,
        location: user.location,
        languages: user.languages,
        hideLocation: user.hideLocation,
        companyLogo: user.companyLogo,
      },
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ success: false, message: 'Server error while updating profile picture' });
  }
};

module.exports = { register, login, logout, getProfile, updateProfile, updateProfilePicture };