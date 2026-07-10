// Mock data — sau chỉ cần thay bằng apiClient calls
const mockBlogs = [
  {
    id: 1,
    title: "Top 10 địa điểm du lịch Hạ Long",
    slug: "top-10-dia-diem-du-lich-ha-long",
    thumbnail: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
    description: "Khám phá những địa điểm tuyệt đẹp tại Vịnh Hạ Long",
    content: "<p>Vịnh Hạ Long là một trong những kỳ quan thiên nhiên thế giới...</p>",
    status: "published",
    deleted: false,
    deletedAt: null,
    createdBy: 30001,
    updatedBy: 30001,
    deletedBy: null,
    createdAt: "2026-05-15T08:00:00",
    updatedAt: "2026-05-15T08:00:00",
  },
  {
    id: 2,
    title: "Kinh nghiệm du lịch Phú Quốc tiết kiệm",
    slug: "kinh-nghiem-du-lich-phu-quoc-tiet-kiem",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    description: "Chia sẻ những tips du lịch Phú Quốc với chi phí hợp lý",
    content: "<p>Phú Quốc là hòn đảo thiên đường với bãi biển tuyệt đẹp...</p>",
    status: "published",
    deleted: false,
    deletedAt: null,
    createdBy: 30001,
    updatedBy: 30001,
    deletedBy: null,
    createdAt: "2026-05-10T08:00:00",
    updatedAt: "2026-05-10T08:00:00",
  },
  {
    id: 3,
    title: "Bài viết đã xóa test",
    slug: "bai-viet-da-xoa-test",
    thumbnail: "",
    description: "Mô tả test",
    content: "<p>Nội dung test</p>",
    status: "draft",
    deleted: true,
    deletedAt: "2026-06-01T10:00:00",
    createdBy: 30001,
    updatedBy: 30001,
    deletedBy: 30001,
    createdAt: "2026-05-01T08:00:00",
    updatedAt: "2026-06-01T10:00:00",
  },
];

let _blogs = [...mockBlogs];

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const blogService = {
  getAll: async () => {
    return _blogs.filter(b => !b.deleted);
    // TODO: return (await apiClient.get('/blogs')).data;
  },

  getAllTrash: async () => {
    return _blogs.filter(b => b.deleted);
    // TODO: return (await apiClient.get('/blogs/trash')).data;
  },

  getById: async (id) => {
    const blog = _blogs.find(b => b.id === Number(id));
    if (!blog) throw new Error("Không tìm thấy bài viết");
    return blog;
    // TODO: return (await apiClient.get(`/blogs/${id}`)).data;
  },

  create: async (payload, thumbnailFile) => {
    const newBlog = {
      id: Date.now(),
      ...payload,
      slug: generateSlug(payload.title),
      thumbnail: thumbnailFile ? URL.createObjectURL(thumbnailFile) : payload.thumbnail || "",
      deleted: false,
      deletedAt: null,
      deletedBy: null,
      createdBy: Number(localStorage.getItem("userId")),
      updatedBy: Number(localStorage.getItem("userId")),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    _blogs.push(newBlog);
    return newBlog;
    // TODO: FormData + apiClient.post('/blogs', body)
  },

  update: async (id, payload, thumbnailFile) => {
    const index = _blogs.findIndex(b => b.id === Number(id));
    if (index === -1) throw new Error("Không tìm thấy bài viết");
    _blogs[index] = {
      ..._blogs[index],
      ...payload,
      thumbnail: thumbnailFile
        ? URL.createObjectURL(thumbnailFile)
        : payload.thumbnail || _blogs[index].thumbnail,
      updatedBy: Number(localStorage.getItem("userId")),
      updatedAt: new Date().toISOString(),
    };
    return _blogs[index];
    // TODO: FormData + apiClient.put(`/blogs/${id}`, body)
  },

  softDelete: async (id) => {
    const index = _blogs.findIndex(b => b.id === Number(id));
    if (index === -1) throw new Error("Không tìm thấy bài viết");
    _blogs[index] = {
      ..._blogs[index],
      deleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: Number(localStorage.getItem("userId")),
    };
    // TODO: apiClient.delete(`/blogs/${id}`)
  },

  restore: async (id) => {
    const index = _blogs.findIndex(b => b.id === Number(id));
    if (index === -1) throw new Error("Không tìm thấy bài viết");
    _blogs[index] = {
      ..._blogs[index],
      deleted: false,
      deletedAt: null,
      deletedBy: null,
    };
    // TODO: apiClient.put(`/blogs/${id}/restore`)
  },

  hardDelete: async (id) => {
    _blogs = _blogs.filter(b => b.id !== Number(id));
    // TODO: apiClient.delete(`/blogs/${id}/force`)
  },
};