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
    createdAt:   tour.createdAt?.slice(0, 10),
    price:       tour.price ?? 0,
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

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/tour/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy tour");
    const data = await res.json();
    return mapTour(data);
  },

  create: async (payload, imageFile) => {
    const body = new FormData();
    body.append("data", JSON.stringify(payload));
    if (imageFile) body.append("file", imageFile);
    const res = await fetch(`${API_BASE}/tour`, { method: "POST", body });
    if (!res.ok) throw new Error("Tạo tour thất bại");
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/tour/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Cập nhật tour thất bại");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/tour/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xóa tour thất bại");
  },
};