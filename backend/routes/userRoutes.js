const express = require("express");
const router = express.Router();
const photographerController = require("../controllers/photographerController");
const shopController = require("../controllers/shopController");
const rentalController = require("../controllers/rentalController");

router.get("/api/photographers", photographerController.getPhotographers);
router.get("/api/sellers", shopController.getSellers);
router.get("/api/rentals", rentalController.getRentals);

module.exports = router;