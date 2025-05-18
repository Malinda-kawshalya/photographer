const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).lean();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', details: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    const savedUser = await user.save();
    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create user', details: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, companyName } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { username, email, password, role,companyName }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update user', details: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to delete user', details: error.message });
  }
};