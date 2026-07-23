const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const { optionalAuth } = require("../../middlewares/auth.middleware");

router.post(
  "/create_payment_url",
  optionalAuth,
  paymentController.createPaymentUrl,
);

router.get("/vnpay_return", paymentController.vnpayReturn);

router.get("/booking/:booking_code/status", paymentController.getPaymentStatus);

router.get(
  "/booking/:bookingId/result",
  paymentController.getBookingSuccessData,
);

module.exports = router;
