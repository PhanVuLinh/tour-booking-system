import { get, post } from "../../../utils/request";

export const createBookingService = async (payload) => {
  return await post("/booking/create", payload);
};

export const checkCouponService = async (payload) => {
  return await post("/coupons/check", payload);
};

export const createVnPayUrlService = async (booking_code) => {
  return await post("/payments/create_payment_url", { booking_code });
};

export const getVnPayPaymentStatusService = async (booking_code) => {
  return await get(
    `/payments/booking/${encodeURIComponent(booking_code)}/status`,
  );
};

export const getVnPayBookingResultService = async (bookingId) => {
  return await get(`/payments/booking/${bookingId}/result`);
};
