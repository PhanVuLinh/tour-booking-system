const API_BASE = "http://localhost:8080/api/user";

function mapUser(user) {
  return {
    id: user.id,
    name: user.fullName, 
    email: user.email,
    phone: user.phone || "—",
    
    totalBookings: user.totalBookings || 0, 
    totalSpent: user.totalSpent || 0,
    
    status: user.status,
    joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "—",
    
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}


const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-User-Id": "1"
});

export const userService = {
  getAllActive: async () => {
    const res = await fetch(`${API_BASE}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách khách hàng thất bại");
    const data = await res.json();
    return data.map(mapUser);
  },

  getAllTrash: async () => {
    const res = await fetch(`${API_BASE}/trash`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách thùng rác thất bại");
    const data = await res.json();
    return data.map(mapUser);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Không tìm thấy thông tin khách hàng");
    const data = await res.json();
    return mapUser(data);
  },

  create: async (payload) => {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Tạo tài khoản khách hàng thất bại");
    }
    return res.json();
  },

  update: async (id, payload) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Cập nhật tài khoản thất bại");
    }
    return res.json();
  },

  softDelete: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { 
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Khóa tài khoản thất bại");
    }
  },

  restore: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/restore`, { 
      method: "PUT",
      headers: getHeaders()
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Mở khóa tài khoản thất bại");
    }
  },

  hardDelete: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/force`, { 
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Xóa vĩnh viễn thất bại");
    }
  },
};