const User = require("../models/User");


const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "shop" }).select(
      "username email companyName description companyLogo"
    );
    res.json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch sellers" });
  }
};





module.exports = {  getSellers };