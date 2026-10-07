const API_DOMAIN = import.meta.env.VITE_API_URL;

// Hàm tự động lấy cấu hình Header + Token
const getHeaders = () => {
  const token = localStorage.getItem("client_token");
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const get = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  return result;
};

export const post = async (path, options) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(options),
  });
  const result = await response.json();
  return result;
};

export const del = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  return result;
};

export const update = async (path, options) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(options),
  });
  const result = await response.json();
  return result;
};

export const put = async (path, options) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PUT",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(options),
  });
  return await response.json();
};
