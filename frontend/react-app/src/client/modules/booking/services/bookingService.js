import { get, post } from "../../../utils/request";

export const createBookingService = async (payload) => {
  return await post("/booking/create", payload);
};

export const checkCouponService = async (payload) => {
  return await post("/coupons/check", payload);
};

export const createVnPayUrlService = async (bookingCode) => {
  return await post("/payments/create_payment_url", { bookingCode });
};

export const getVnPayPaymentStatusService = async (paymentId) => {
  return await get(`/payments/${paymentId}/status`);
};
