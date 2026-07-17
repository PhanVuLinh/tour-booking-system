const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

router.post(
  "/create",
  authMiddleware.optionalAuth,
  bookingController.createBooking,
);

module.exports = router;
