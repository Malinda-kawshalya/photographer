const User = require("../models/User");

const getPhotographers = async (req, res) => {
  try {
    const photographers = await User.find({ role: "photographer" }).select(
      "username email companyName description companyLogo"
    );
    res.json({ success: true, photographers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch photographers" });
  }
};

module.exports = { getPhotographers };