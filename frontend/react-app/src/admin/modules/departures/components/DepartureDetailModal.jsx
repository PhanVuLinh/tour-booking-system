import { X, User, Calendar, DollarSign, Users, Percent, Info, Bus, Plane, Train, Ship } from "lucide-react";

export function DepartureDetailModal({ isOpen, onClose, departure }) {
  if (!isOpen || !departure) return null;

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "—";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : "—";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chi tiết toàn bộ lịch khởi hành</h2>
            <p className="text-sm text-blue-600 font-semibold mt-0.5">{departure.tourTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* KHỐI 1: THÔNG TIN TỔNG QUAN */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600" /> Thông tin tổng quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Mã lịch khởi hành (ID)</p>
                <p className="font-semibold text-gray-900 mt-0.5">#{departure.id}</p>
              </div>
              
              {/* THÊM MỚI: TRƯỜNG HIỂN THỊ PHƯƠNG TIỆN */}
              <div>
                <p className="text-gray-500 text-xs">Phương tiện di chuyển</p>
                {departure.vehicleName ? (
                  <div className="flex items-center gap-1.5 mt-0.5 text-blue-600 font-semibold" title={departure.vehicleName}>
                    {departure.vehicleType === 'PLANE' ? <Plane className="w-4 h-4" /> :
                     departure.vehicleType === 'TRAIN' ? <Train className="w-4 h-4" /> :
                     departure.vehicleType === 'SHIP' ? <Ship className="w-4 h-4" /> :
                     <Bus className="w-4 h-4" />}
                    <span className="truncate max-w-[120px]">{departure.vehicleName}</span>
                  </div>
                ) : (
                  <p className="font-semibold text-gray-400 mt-0.5">— Tự túc —</p>
                )}
              </div>
              
              <div>
                <p className="text-gray-500 text-xs">Trạng thái chuyến đi</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                  departure.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {departure.status}
                </span>
              </div>
              
              <div className="sm:col-span-3 border-t border-gray-200/60 pt-3">
                <p className="text-gray-500 text-xs">Thời gian bắt đầu khởi hành</p>
                <p className="font-bold text-base mt-0.5 flex items-center gap-1.5 text-blue-600">
                  <Calendar className="w-4.5 h-4.5" /> {formatDate(departure.startTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-green-600" /> Biểu phí dịch vụ & Khuyến mãi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Giá người lớn</p>
                <p className="font-bold text-gray-900 mt-0.5 text-green-600">{formatCurrency(departure.priceAdult)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Giá trẻ em (TE)</p>
                <p className="font-semibold text-gray-700 mt-0.5">{formatCurrency(departure.priceChildren)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Giá em bé (EB)</p>
                <p className="font-semibold text-gray-700 mt-0.5">{formatCurrency(departure.priceBaby)}</p>
              </div>
              <div className="bg-orange-50/60 border border-orange-100 p-2 rounded-lg">
                <p className="text-orange-600 text-xs flex items-center gap-1 font-medium">
                  <Percent className="w-3 h-3" /> Giảm giá (Discount)
                </p>
                <p className="font-bold text-orange-700 mt-0.5">
                  {departure.discount ? `${departure.discount}%` : "0% (Không giảm)"}
                </p>
              </div>
            </div>
          </div>

          {/* KHỐI 3: QUẢN LÝ SỐ CHỖ (STOCK) */}
          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-600" /> Giới hạn số lượng chỗ nhận khách (Stock)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">Chỗ Người lớn tối đa</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">{departure.stockAdult} <span className="text-xs text-gray-400 font-normal">vé</span></p>
              </div>
              <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">Chỗ Trẻ em tối đa</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">{departure.stockChildren} <span className="text-xs text-gray-400 font-normal">vé</span></p>
              </div>
              <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">Chỗ Em bé tối đa</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">{departure.stockBaby} <span className="text-xs text-gray-400 font-normal">vé</span></p>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-800">Nhật ký kiểm toán hệ thống (Audit Logs)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nhật ký Tạo */}
              <div className="grid grid-cols-2 gap-2 bg-purple-50/30 border border-purple-100 rounded-xl p-3 text-sm">
                <div className="col-span-2 border-b border-purple-100/60 pb-1.5 mb-1.5 flex items-center gap-1.5 font-semibold text-purple-800 text-xs uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" /> Quy trình khởi tạo
                </div>
                <div>
                  <p className="text-gray-400 text-[11px]">Thời gian tạo</p>
                  <p className="font-medium text-gray-700 mt-0.5">{formatDate(departure.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[11px]">Mã nhân sự tạo</p>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {departure.createdBy ? `Nhân viên #${departure.createdBy}` : "Hệ thống / Seed"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-blue-50/30 border border-blue-100 rounded-xl p-3 text-sm">
                <div className="col-span-2 border-b border-blue-100/60 pb-1.5 mb-1.5 flex items-center gap-1.5 font-semibold text-blue-800 text-xs uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" /> Biến động cuối cùng
                </div>
                <div>
                  <p className="text-gray-400 text-[11px]">Cập nhật gần nhất</p>
                  <p className="font-medium text-gray-700 mt-0.5">{formatDate(departure.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[11px]">Mã nhân sự sửa</p>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {departure.updatedBy ? `Nhân viên #${departure.updatedBy}` : "Chưa chỉnh sửa"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}