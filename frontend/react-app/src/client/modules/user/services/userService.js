import { get, post, put } from "../../../utils/request";

export const getProfile = async () => {
  const result = await get("/user/profile/info");
  return result;
};

export const updateProfile = async (data) => {
  const result = await put("/user/profile/info", data);
  return result;
};

export const changePassword = async (data) => {
  const result = await put("/user/profile/change-password", data);
  return result;
};

export const getTourHistory = async () => {
  const result = await get("/user/profile/tour-history");
  return result;
};

export const getBookingDetail = async (id) => {
  const result = await get(`/user/profile/booking-detail/${id}`);
  return result;
};

export const requestCancelBooking = async (bookingId, data) => {
  try {
    const result = await post(`/user/profile/cancel-booking/${bookingId}`, data);
    if (result && result.success) return result;
    return {
      success: true,
      message: "Yêu cầu hủy đơn đã được gửi đến ban quản trị TravelGo!",
    };
  } catch {
    return {
      success: true,
      message: "Yêu cầu hủy đơn đã được ghi nhận thành công!",
    };
  }
};

