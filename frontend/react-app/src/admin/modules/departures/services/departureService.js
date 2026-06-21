import { apiClient } from '../../login/services/authService';

export const departureService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/departure', { params: { status: 'active' } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Lấy danh sách lịch khởi hành thất bại");
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/departure', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Tạo lịch khởi hành thất bại");
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/departure/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Cập nhật lịch khởi hành thất bại");
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/departure/${id}`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Xóa lịch khởi hành thất bại");
    }
  }
};