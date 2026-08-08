import { get, post } from "../../../utils/request.jsx";

export const getReviewsByTourId = async (tourId) => {
  return await get(`/reviews/tour/${tourId}`);
};

export const checkBookingReviewStatus = async (bookingId) => {
  return await get(`/reviews/check-booking/${bookingId}`);
};

export const createReview = async (reviewData) => {
  return await post("/reviews", reviewData);
};
