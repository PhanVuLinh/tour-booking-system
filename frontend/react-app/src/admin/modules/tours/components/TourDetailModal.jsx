import { X } from "lucide-react";

export function TourDetailModal({ isOpen, onClose, selectedTour }) {
  if (!isOpen || !selectedTour) return null;

  // Hàm chuyển đổi ngày giờ cho đẹp
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết Tour</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Ảnh Cover */}
          <img
            src={selectedTour.image}
            alt={selectedTour.name}
            className="w-full h-64 object-cover rounded-xl shadow-sm border border-gray-100"
          />
          
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tên Tour</p>
              <p className="font-semibold text-gray-900">{selectedTour.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Danh mục</p>
              <p className="font-medium text-gray-900">{selectedTour.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Giá Tour</p>
              <p className="font-bold text-blue-600 text-lg">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedTour.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  selectedTour.status === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {selectedTour.status === "active" ? "Hoạt động" : "Tạm dừng"}
              </span>
            </div>
          </div>

          {/* KHỐI THÔNG TIN HỆ THỐNG (AUDIT LOG) */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Thông tin hệ thống</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Ngày tạo</p>
                <p className="font-medium text-gray-900">{formatDate(selectedTour.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Người tạo (ID)</p>
                <p className="font-medium text-gray-900">
                    {selectedTour.createdBy ? `Account #${selectedTour.createdBy}` : "Hệ thống"}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-200/60">
                <p className="text-gray-500 mb-1">Lần cập nhật cuối</p>
                <p className="font-medium text-gray-900">{formatDate(selectedTour.updatedAt)}</p>
              </div>
              <div className="pt-2 border-t border-gray-200/60">
                <p className="text-gray-500 mb-1">Người cập nhật (ID)</p>
                <p className="font-medium text-gray-900">
                    {selectedTour.updatedBy ? `Account #${selectedTour.updatedBy}` : "Chưa có lượt cập nhật"}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}