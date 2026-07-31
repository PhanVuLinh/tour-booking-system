import { useState, useEffect } from "react";
import { StatCards } from "../components/StatCards";
import { RevenueChart, BookingStatusChart } from "../components/DashboardCharts";
import { TopToursTable } from "../components/TopToursTable";
import { getDashboardData } from "../services/dashboardService";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải dữ liệu dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu tổng quan...</div>;
  }

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-500 mt-1">Thống kê tổng quan hệ thống quản lý tour</p>
      </div>

      {/* 4 Thẻ thống kê */}
      <StatCards data={dashboardData.statCards} />

      {/* Khu vực Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={dashboardData.revenueData} />
        </div>
        <div className="lg:col-span-1">
          <BookingStatusChart data={dashboardData.bookingStatus} />
        </div>
      </div>

      {/* Bảng Top Tours */}
      <TopToursTable tours={dashboardData.topTours} />

    </div>
  );
}