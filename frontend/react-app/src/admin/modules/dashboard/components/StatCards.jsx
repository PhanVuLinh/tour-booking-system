import { TrendingUp, Users, ShoppingCart, MapPin } from "lucide-react";

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-sm font-medium text-gray-600">Doanh thu tháng này</h3>
          <TrendingUp className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">220,000,000 ₫</div>
          <p className="text-xs text-green-600 mt-1">+12.5% so với tháng trước</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-sm font-medium text-gray-600">Tổng đơn đặt</h3>
          <ShoppingCart className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">454</div>
          <p className="text-xs text-gray-500 mt-1">89 đơn chờ xác nhận</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-sm font-medium text-gray-600">Khách hàng</h3>
          <Users className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">2,847</div>
          <p className="text-xs text-purple-600 mt-1">+156 khách mới tháng này</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-sm font-medium text-gray-600">Tổng Tour</h3>
          <MapPin className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">67</div>
          <p className="text-xs text-gray-500 mt-1">12 danh mục</p>
        </div>
      </div>
    </div>
  );
}