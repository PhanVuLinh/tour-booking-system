import { post } from "../../../utils/request";

export const register = async (userData) => {
  const result = await post("/register", userData);
  return result;
};

export const login = async (loginData) => {
  const result = await post("/login", loginData);
  return result;
};
