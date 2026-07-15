import { apiClient } from '../../login/services/authService';

export const blogService = {
  
  getAll: async () => {
    try {
      const response = await apiClient.get('/blogs');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi tải danh sách bài viết");
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không tìm thấy bài viết");
    }
  },

  getAllTrash: async () => {
    try {
      const response = await apiClient.get('/blogs/trash');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi tải danh sách thùng rác");
    }
  },


  create: async (payload) => {
    try {
      const response = await apiClient.post('/blogs', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Tạo bài viết thất bại");
    }
  },

  update: async (id, payload) => {
    try {
      const response = await apiClient.put(`/blogs/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Cập nhật bài viết thất bại");
    }
  },

  softDelete: async (id) => {
    try {
      const response = await apiClient.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Xóa bài viết thất bại");
    }
  },

  restore: async (id) => {
    try {
      const response = await apiClient.put(`/blogs/${id}/restore`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Khôi phục bài viết thất bại");
    }
  },

  hardDelete: async (id) => {
    try {
      const response = await apiClient.delete(`/blogs/${id}/force`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Xóa vĩnh viễn bài viết thất bại");
    }
  }
};