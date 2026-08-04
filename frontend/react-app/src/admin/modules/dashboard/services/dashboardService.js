
export const getDashboardData = async () => {
  return {
    statCards: {
      revenue: { value: 220000000, growth: "+12.5% so với tháng trước" },
      totalBookings: { value: 454, pending: "89 đơn chờ xác nhận" },
      customers: { value: 2847, newThisMonth: "+156 khách mới tháng này" },
      totalTours: { value: 67, categories: 12 }
    },
    revenueData: [
      { month: "T1", revenue: 120000000 },
      { month: "T2", revenue: 150000000 },
      { month: "T3", revenue: 180000000 },
      { month: "T4", revenue: 160000000 },
      { month: "T5", revenue: 200000000 },
      { month: "T6", revenue: 220000000 },
    ],
    topTours: [
      { name: "Hạ Long 3N2Đ", bookings: 156, revenue: 780000000 },
      { name: "Phú Quốc 4N3Đ", bookings: 134, revenue: 670000000 },
      { name: "Sapa 2N1Đ", bookings: 98, revenue: 294000000 },
      { name: "Đà Nẵng 3N2Đ", bookings: 87, revenue: 435000000 },
      { name: "Nha Trang 3N2Đ", bookings: 76, revenue: 380000000 },
    ],
    bookingStatus: [
      { name: "Đã xác nhận", value: 320, color: "#10b981" },
      { name: "Chờ thanh toán", value: 89, color: "#f59e0b" },
      { name: "Đã hủy", value: 45, color: "#ef4444" },
    ]
  };
};