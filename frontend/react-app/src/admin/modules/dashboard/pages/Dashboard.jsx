import { StatCards } from "../components/StatCards";
import { RevenueChart, BookingStatusChart } from "../components/DashboardCharts";
import { TopToursTable } from "../components/TopToursTable";

// Dữ liệu mô phỏng (Mock Data)
const revenueData = [
  { month: "T1", revenue: 120000000 },
  { month: "T2", revenue: 150000000 },
  { month: "T3", revenue: 180000000 },
  { month: "T4", revenue: 160000000 },
  { month: "T5", revenue: 200000000 },
  { month: "T6", revenue: 220000000 },
];

const topTours = [
  { name: "Hạ Long 3N2Đ", bookings: 156, revenue: 780000000 },
  { name: "Phú Quốc 4N3Đ", bookings: 134, revenue: 670000000 },
  { name: "Sapa 2N1Đ", bookings: 98, revenue: 294000000 },
  { name: "Đà Nẵng 3N2Đ", bookings: 87, revenue: 435000000 },
  { name: "Nha Trang 3N2Đ", bookings: 76, revenue: 380000000 },
];

const bookingStatus = [
  { name: "Đã xác nhận", value: 320, color: "#10b981" },
  { name: "Chờ thanh toán", value: 89, color: "#f59e0b" },
  { name: "Đã hủy", value: 45, color: "#ef4444" },
];

export default function Dashboard() {
  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-500 mt-1">Thống kê tổng quan hệ thống quản lý tour</p>
      </div>

      {/* 4 Thẻ thống kê */}
      <StatCards />

      {/* Khu vực Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-1">
          <BookingStatusChart data={bookingStatus} />
        </div>
      </div>

      {/* Bảng Top Tours */}
      <TopToursTable tours={topTours} />

    </div>
  );
}