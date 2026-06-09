
const BASE_URL = "http://localhost:8080/api"; 

export const departureService = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/departure`);
    if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/departure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg); 
    }
    return response.json();
  },


  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/departure/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/departure/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }
    return response.text(); 
  }
};