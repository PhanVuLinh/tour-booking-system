const API_BASE = "http://localhost:8080/api";

function mapTour(tour) {
  return {
    id:          tour.id,
    name:        tour.title,
    image:       tour.thumbnail,
    duration:    tour.time,
    categoryId:  tour.categoryId,
    category:    "", 
    description: tour.description,
    status:      tour.status,
    price:       tour.price ?? 0,
    
    createdAt:   tour.createdAt,
    updatedAt:   tour.updatedAt,
    createdBy:   tour.createdBy,
    updatedBy:   tour.updatedBy,
    deletedAt:   tour.deletedAt,
    deletedBy:   tour.deletedBy,
    deleted:     tour.deleted,
  };
}

export const tourService = {
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/category`);
    if (!res.ok) throw new Error("Lấy danh sách danh mục thất bại");
    return res.json();
  },

  getAll: async () => {
    const res = await fetch(`${API_BASE}/tour`);
    if (!res.ok) throw new Error("Lấy danh sách tour thất bại");
    const data = await res.json();
    return data.map(mapTour);
  },

  getAllActive: async () => {
    const res = await fetch(`${API_BASE}/tour`);
    if (!res.ok) throw new Error("Lấy danh sách tour thất bại");
    const data = await res.json();
    return data.map(mapTour);
  },

  getAllTrash: async () => {
    const res = await fetch(`${API_BASE}/tour/trash`);
    if (!res.ok) throw new Error("Lấy danh sách thùng rác thất bại");
    const data = await res.json();
    return data.map(mapTour);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/tour/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy tour");
    const data = await res.json();
    return mapTour(data);
  },

  create: async (payload, imageFile, galleryImages = []) => {
    const body = new FormData();
    body.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (imageFile) body.append("file", imageFile);
    
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach(img => {
        body.append("images", img);
      });
    }

    const res = await fetch(`${API_BASE}/tour`, { method: "POST", body });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Tạo tour thất bại");
    }
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/tour/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Cập nhật tour thất bại");
    }
    return res.json();
  },

  // GIỮ LẠI HÀM NÀY CHO TOURLIST.JSX CŨ GỌI KHÔNG BỊ LỖI
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/tour/${id}`, { method: "DELETE" });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Xóa tour thất bại");
    }
  },

  softDelete: async (id) => {
    const res = await fetch(`${API_BASE}/tour/${id}`, { method: "DELETE" });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Xóa tour thất bại");
    }
  },

  restore: async (id) => {
    const res = await fetch(`${API_BASE}/tour/${id}/restore`, { method: "PUT" });
    if (!res.ok) throw new Error("Khôi phục tour thất bại");
  },

  hardDelete: async (id) => {
    const res = await fetch(`${API_BASE}/tour/${id}/force`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xóa vĩnh viễn thất bại");
  },
};