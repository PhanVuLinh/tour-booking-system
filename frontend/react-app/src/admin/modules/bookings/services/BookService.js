// src/services/bookingService.js

let mockBookings = [
  {
    id: 1,
    bookingCode: "BK001234",
    userId: 101,
    customerName: "Nguyễn Văn A", // Giả lập dữ liệu join từ bảng users
    departureId: 201,
    tourName: "Hạ Long 3N2Đ",       // Giả lập dữ liệu lấy từ departure -> tour
    discountId: null,
    quantityAdult: 2,
    quantityChildren: 1,
    quantityBaby: 0,
    adultPrice: 4000000.00,
    childrenPrice: 2000000.00,
    babyPrice: 0.00,
    subTotal: 10000000.00,
    total: 10000000.00,
    note: "Yêu cầu phòng hướng biển",
    status: "pending",
    createdAt: "2026-05-20 10:30:00",
  },
  {
    id: 2,
    bookingCode: "BK001235",
    userId: 102,
    customerName: "Trần Thị B",
    departureId: 202,
    tourName: "Phú Quốc 4N3Đ",
    discountId: 5,
    quantityAdult: 4,
    quantityChildren: 0,
    quantityBaby: 1,
    adultPrice: 8000000.00,
    childrenPrice: 4000000.00,
    babyPrice: 0.00,
    subTotal: 32000000.00,
    total: 30000000.00, // Đã áp dụng mã giảm giá discountId
    note: "Có người già đi cùng",
    status: "confirmed",
    createdAt: "2026-05-21 14:15:00",
  },
  {
    id: 3,
    bookingCode: "BK001236",
    userId: 103,
    customerName: "Lê Văn C",
    departureId: 203,
    tourName: "Sapa 2N1Đ",
    discountId: null,
    quantityAdult: 2,
    quantityChildren: 0,
    quantityBaby: 0,
    adultPrice: 3000000.00,
    childrenPrice: 1500000.00,
    babyPrice: 0.00,
    subTotal: 6000000.00,
    total: 6000000.00,
    note: null,
    status: "cancelled",
    createdAt: "2026-05-22 09:00:00",
  },
];

export const bookingService = {
  getAll: async () => {
    return [...mockBookings];
  },

  confirm: async (id) => {
    const index = mockBookings.findIndex(b => b.id === id);
    if (index !== -1) {
      mockBookings[index].status = "confirmed";
    }
  },

  cancel: async (id) => {
    const index = mockBookings.findIndex(b => b.id === id);
    if (index !== -1) {
      mockBookings[index].status = "cancelled";
    }
  }
};