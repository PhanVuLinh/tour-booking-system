const mockBanners = [
  {
    id: 1,
    title: "Summer Sale 2026",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
    link: "/tours?category=summer",
    order: 1,
    status: "active",
  },
  {
    id: 2,
    title: "Khám phá Hạ Long",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
    link: "/tours/halong",
    order: 2,
    status: "active",
  },
  {
    id: 3,
    title: "Tour Phú Quốc",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    link: "/tours/phu-quoc",
    order: 3,
    status: "inactive",
  },
];

export const bannerService = {
  getAll: async () => {
    return Promise.resolve([...mockBanners]);
  },

  create: async (formData) => {
    const maxOrder = Math.max(...mockBanners.map(b => b.order), 0);
    const newBanner = {
      id: Date.now(),
      ...formData,
      order: maxOrder + 1,
      status: "active",
    };
    mockBanners.push(newBanner);
    return Promise.resolve(newBanner);
  },

  update: async (id, formData) => {
    const index = mockBanners.findIndex(b => b.id === id);
    if (index !== -1) {
      mockBanners[index] = { ...mockBanners[index], ...formData };
      return Promise.resolve(mockBanners[index]);
    }
    throw new Error("Không tìm thấy banner");
  },

  delete: async (id) => {
    const index = mockBanners.findIndex(b => b.id === id);
    let deleted = null;
    if (index !== -1) {
      deleted = mockBanners[index];
      mockBanners.splice(index, 1);
    }
    return Promise.resolve(deleted);
  },

  updateOrder: async (newBanners) => {
    mockBanners.splice(0, mockBanners.length, ...newBanners);
    return Promise.resolve(true);
  }
};