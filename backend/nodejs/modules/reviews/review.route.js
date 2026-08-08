const express = require("express");
const router = express.Router();
const reviewController = require("./review.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

router.get("/tour/:tourId", reviewController.getReviewsByTourId);

router.get(
  "/check-booking/:bookingId",
  reviewController.checkBookingReviewStatus,
);

router.post("/", authMiddleware.requireAuth, reviewController.createReview);

module.exports = router;
