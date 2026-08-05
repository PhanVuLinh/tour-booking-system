const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const bookingValidate = require("./booking.validate");

const authMiddleware = require("../../middlewares/auth.middleware");

router.post(
  "/create",
  authMiddleware.optionalAuth,
  bookingValidate.validateCreateBooking,
  bookingController.createBooking,
);

router.get("/lookup/:code", bookingController.lookupBooking);

router.post("/admin/update-status", bookingController.updateStatusByAdmin);

module.exports = router;
