import { post } from "../../../utils/request";

export const createBookingService = async (payload) => {
  return await post("/booking/create", payload);
};

export const checkCouponService = async (payload) => {
  return await post("/coupons/check", payload);
};
