const BASE_URL = "http://localhost:8080/api"; 

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || `Lỗi HTTP: ${response.status}`);
  }
  if (response.status === 204) return null;
  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const departureService = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/departure`);
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/departure`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-User-Id": "1"
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/departure/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "X-User-Id": "1" 
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/departure/${id}`, {
      method: "DELETE",
      headers: { "X-User-Id": "1" }
    });
    return handleResponse(response); 
  }
};