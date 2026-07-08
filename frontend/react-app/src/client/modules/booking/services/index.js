import { post } from "../../../utils/request";

export const createBookingService = async (payload) => {
  return await post("/booking/create", payload);
};
