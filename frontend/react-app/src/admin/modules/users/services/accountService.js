const API_BASE = "http://localhost:8080/api/accounts";

function mapAccount(acc) {
  return {
    id:          acc.id,
    fullName:    acc.fullName,
    email:       acc.email,
    phone:       acc.phone || "",
    avatar:      acc.avatar || "",
    jobTitle:    acc.jobTitle || "",
    roleId:      acc.roleId,
    roleName:    acc.roleName || (acc.roleId === 1 ? "Admin" : "Staff"),
    status:      acc.status,
    
    createdAt:   acc.createdAt,
    updatedAt:   acc.updatedAt,
    deletedAt:   acc.deletedAt,
    deletedBy:   acc.deletedBy,
  };
}


const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-User-Id": "1" 
});

export const accountService = {
  getAllActive: async () => {
    const res = await fetch(`${API_BASE}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách tài khoản thất bại");
    const data = await res.json();
    return data.map(mapAccount);
  },

  getAllTrash: async () => {
    const res = await fetch(`${API_BASE}/trash`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách thùng rác thất bại");
    const data = await res.json();
    return data.map(mapAccount);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Không tìm thấy thông tin tài khoản");
    const data = await res.json();
    return mapAccount(data);
  },

  create: async (payload) => {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Tạo tài khoản thất bại");
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
        throw new Error(errText || "Chuyển vào thùng rác thất bại");
    }
  },

  restore: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/restore`, { 
      method: "PUT",
      headers: getHeaders()
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Khôi phục tài khoản thất bại");
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