export function DepartureModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit,tourList }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Chỉnh sửa lịch khởi hành" : "Thêm lịch khởi hành mới"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Khớp dữ liệu với Spring Boot Backend</p>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tour ID (Mã Tour) <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1"
                value={formData.tourId || ""}
                onChange={(e) => setFormData({ ...formData, tourId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Nhập ID Tour (VD: 1)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thời gian khởi hành <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={formData.startTime || ""}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Người lớn</label>
              <input type="number" placeholder="Giá vé (VNĐ)" value={formData.priceAdult} onChange={(e) => setFormData({ ...formData, priceAdult: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="number" placeholder="Số chỗ" value={formData.stockAdult} onChange={(e) => setFormData({ ...formData, stockAdult: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Trẻ em</label>
              <input type="number" placeholder="Giá vé (VNĐ)" value={formData.priceChildren} onChange={(e) => setFormData({ ...formData, priceChildren: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="number" placeholder="Số chỗ" value={formData.stockChildren} onChange={(e) => setFormData({ ...formData, stockChildren: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Em bé</label>
              <input type="number" placeholder="Giá vé (VNĐ)" value={formData.priceBaby} onChange={(e) => setFormData({ ...formData, priceBaby: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="number" placeholder="Số chỗ" value={formData.stockBaby} onChange={(e) => setFormData({ ...formData, stockBaby: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              value={formData.status || "OPEN"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="OPEN">Mở bán (OPEN)</option>
              <option value="CLOSED">Đóng (CLOSED)</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button onClick={onSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}