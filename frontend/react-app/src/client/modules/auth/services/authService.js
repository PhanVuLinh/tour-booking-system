import { post } from "../../../utils/request";

export const register = async (userData) => {
  const result = await post("/register", userData);
  return result;
};
