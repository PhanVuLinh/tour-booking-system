import { apiClient } from "../../login/services/authService"; // Đường dẫn tuỳ thuộc cấu trúc của bạn

export const bookingService = {
  getAll: async () => {
    const response = await apiClient.get('/bookings');
    return response.data.data; 
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data.data;
  },

  updateStatus: async (id, statusValue) => {
    const response = await apiClient.put(`/bookings/${id}/status`, { 
      status: statusValue 
    });
    return response.data.data;
  },

  cancelBooking: async (id) => {
    const response = await apiClient.put(`/bookings/${id}/status`, { 
      status: 'cancelled' 
    });
    return response.data.data;
  }
};