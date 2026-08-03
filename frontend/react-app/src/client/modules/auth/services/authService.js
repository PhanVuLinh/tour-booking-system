import { post } from "../../../utils/request";

export const register = async (userData) => {
  const result = await post("/register", userData);
  return result;
};

export const login = async (loginData) => {
  const result = await post("/login", loginData);
  return result;
};

export const loginGoogle = async (idToken) => {
  const result = await post("/login/google", { idToken });
  return result;
};

export const loginFacebook = async (accessToken) => {
  const result = await post("/login/facebook", { accessToken: accessToken });
  return result;
};
