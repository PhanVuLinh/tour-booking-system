import { get, post } from "../../../utils/request";

export const register = async (userData) => {
  const result = await post("/auth/register", userData);
  return result;
};

export const login = async (loginData) => {
  const result = await post("/auth/login", loginData);
  return result;
};

export const loginGoogle = async (idToken) => {
  const result = await post("/auth/login/google", { idToken });
  return result;
};

export const loginFacebook = async (accessToken) => {
  const result = await post("/auth/login/facebook", { accessToken: accessToken });
  return result;
};

export const logout = async () => {
  const result = await post("/auth/logout");
  return result;
};

export const getMe = async () => {
  const result = await get("/auth/me");
  return result;
};
