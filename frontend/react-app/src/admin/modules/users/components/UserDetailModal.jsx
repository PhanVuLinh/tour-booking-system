import { X } from "lucide-react";

export function UserDetailModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Chi tiết tài khoản</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
              <p className="font-semibold text-gray-900">{user.name || user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
              <p className="font-medium text-gray-900">{user.phone || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            {user.role === "customer" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng đơn đặt</p>
                  <p className="font-medium text-gray-900">{user.totalBookings} đơn</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng chi tiêu</p>
                  <p className="font-bold text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.totalSpent)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Chức danh</p>
                  <p className="font-medium text-gray-900">{user.jobTitle || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Quyền hệ thống</p>
                  <p className="font-medium text-purple-700">{user.roleName || "—"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
            <div>
              <p className="text-sm text-gray-500 mb-1">{user.role === "customer" ? "Ngày tham gia" : "Ngày tạo tài khoản"}</p>
              <p className="font-medium text-gray-900">
                {user.joinedDate || (user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "—")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {user.status === "active" ? "Hoạt động" : "Đã khóa"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}