const BASE_URL = "http://localhost:8080/api"; 

export const categoryService = {
  // Lấy danh mục hoạt động
  getAllActive: async () => {
    const response = await fetch(`${BASE_URL}/category?status=active`);
    if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
    return response.json();
  },

  // Lấy danh mục trong thùng rác
  getAllTrash: async () => {
    const response = await fetch(`${BASE_URL}/category/trash`);
    if (!response.ok) throw new Error("Lỗi khi tải dữ liệu thùng rác");
    return response.json();
  },

  // Thêm mới
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/category`, {
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

  // Cập nhật
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/category/${id}`, {
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

  // Chuyển vào thùng rác (Soft Delete)
  softDelete: async (id) => {
    const response = await fetch(`${BASE_URL}/category/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }
    return response.text(); 
  },

  // Khôi phục từ thùng rác
  restore: async (id) => {
    const response = await fetch(`${BASE_URL}/category/${id}/restore`, {
      method: "PUT",
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }
    return response.text();
  },

  // Xóa vĩnh viễn
  hardDelete: async (id) => {
    const response = await fetch(`${BASE_URL}/category/${id}/force`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }
    return response.text(); 
  }
};