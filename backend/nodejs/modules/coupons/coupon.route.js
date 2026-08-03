const express = require("express");
const router = express.Router();
const couponController = require("./coupon.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const couponValidate = require("./coupon.validate");

router.post(
  "/check",
  authMiddleware.optionalAuth,
  couponValidate.validateCheckCoupon,
  couponController.checkCoupon,
);

module.exports = router;
