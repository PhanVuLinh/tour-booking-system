const mockReviews = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    tourName: "Hạ Long 3N2Đ",
    rating: 5,
    comment: "Tour rất tuyệt vời, hướng dẫn viên nhiệt tình. Tôi sẽ quay lại!",
    status: "visible",
    createdAt: "2026-05-20",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    tourName: "Phú Quốc 4N3Đ",
    rating: 4,
    comment: "Khách sạn đẹp, ăn uống ngon. Tuy nhiên lịch trình hơi gấp.",
    status: "visible",
    createdAt: "2026-05-18",
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    tourName: "Sapa 2N1Đ",
    rating: 2,
    comment: "Không hài lòng với dịch vụ, tour không như mô tả.",
    status: "hidden",
    createdAt: "2026-05-15",
  },
];

export const reviewService = {
  getAll: async () => {
    return Promise.resolve(mockReviews);
  },

  toggleVisibility: async (id) => {
    const review = mockReviews.find(r => r.id === id);
    if (review) {
      review.status = review.status === "visible" ? "hidden" : "visible";
    }
    return Promise.resolve(review);
  },

  delete: async (id) => {
    const index = mockReviews.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReviews.splice(index, 1);
    }
    return Promise.resolve(true);
  }
};