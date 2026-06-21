import { X, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function DepartureModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit, tourList = [], vehicles = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getTourTitle = (tour) => {
    if (!tour) return "";
    return tour.title || tour.name || tour.tourName || "";
  };

  useEffect(() => {
    if (formData.tourId && tourList.length > 0) {
      const selectedTour = tourList.find(t => t.id === formData.tourId);
      if (selectedTour) setSearchTerm(getTourTitle(selectedTour));
    } else {
      setSearchTerm("");
    }
  }, [formData.tourId, tourList, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTour = (tour) => {
    setFormData({
      ...formData,
      tourId: tour.id,
      priceAdult: tour.price || 0 
    });
    setSearchTerm(getTourTitle(tour));
    setIsDropdownOpen(false);
  };

  const filteredTours = tourList.filter(t => {
    const safeTitle = getTourTitle(t);
    const safeSearch = searchTerm || "";
    return safeTitle.toLowerCase().includes(safeSearch.toLowerCase());
  });

  const handleLocalSubmit = () => {
    if (!formData.tourId) {
      alert("Vui lòng chọn một Tour từ danh sách!");
      return;
    }

    const pAdult = parseFloat(formData.priceAdult || 0);
    const pChild = parseFloat(formData.priceChildren || 0);
    const pBaby = parseFloat(formData.priceBaby || 0);
    const sAdult = parseInt(formData.stockAdult || 0);
    const sChild = parseInt(formData.stockChildren || 0);
    const sBaby = parseInt(formData.stockBaby || 0);

    if (pAdult < 0 || pChild < 0 || pBaby < 0) {
      alert("⚠️ Lỗi nhập liệu: Giá vé không được là số âm!");
      return;
    }
    
    if (sAdult < 0 || sChild < 0 || sBaby < 0) {
      alert("⚠️ Lỗi nhập liệu: Số lượng chỗ không được là số âm!");
      return;
    }

    if (pAdult <= pChild) {
      alert("⚠️ Lỗi nhập liệu: Giá vé NGƯỜI LỚN phải LỚN HƠN giá vé TRẺ EM!");
      return;
    }
    if (pChild <= pBaby) {
      alert("⚠️ Lỗi nhập liệu: Giá vé TRẺ EM phải LỚN HƠN giá vé EM BÉ!");
      return;
    }
    onSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Chỉnh sửa lịch khởi hành" : "Thêm lịch khởi hành mới"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Khớp dữ liệu với Spring Boot Backend</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-sm font-medium text-gray-700">Tên Tour <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  if (!e.target.value) setFormData({ ...formData, tourId: "" });
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Gõ tên để tìm kiếm Tour..."
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            {isDropdownOpen && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg max-h-48 overflow-y-auto">
                {filteredTours.length > 0 ? (
                  filteredTours.map((tour, index) => (
                    <li 
                      key={tour.id || index} 
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        handleSelectTour(tour);
                      }} 
                      className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-0"
                    >
                      <div className="font-bold text-gray-800">
                        {getTourTitle(tour) || "Tour chưa cập nhật tên (DB bị rỗng)"}
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between mt-1">
                        <span>Mã Tour: #{tour.id}</span>
                        <span className="text-blue-600 font-semibold">
                          Giá mặc định: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price || 0)}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-gray-500 text-center">Không tìm thấy Tour nào!</li>
                )}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thời gian khởi hành <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={formData.startTime || ""}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phương tiện</label>
              <select
                value={formData.vehicleId || ""}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">-- Tự túc / Không chọn --</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.vehicleType})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Người lớn</label>
              {/* BẢO VỆ LỚP 1: Thêm min="0" vào tất cả input number */}
              <input type="number" min="0" placeholder="Giá vé (VNĐ)" value={formData.priceAdult} onChange={(e) => setFormData({ ...formData, priceAdult: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold text-green-600" />
              <input type="number" min="0" step="1" placeholder="Số chỗ" value={formData.stockAdult} onChange={(e) => setFormData({ ...formData, stockAdult: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Trẻ em</label>
              <input type="number" min="0" placeholder="Giá vé (VNĐ)" value={formData.priceChildren} onChange={(e) => setFormData({ ...formData, priceChildren: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
              <input type="number" min="0" step="1" placeholder="Số chỗ" value={formData.stockChildren} onChange={(e) => setFormData({ ...formData, stockChildren: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Em bé</label>
              <input type="number" min="0" placeholder="Giá vé (VNĐ)" value={formData.priceBaby} onChange={(e) => setFormData({ ...formData, priceBaby: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
              <input type="number" min="0" step="1" placeholder="Số chỗ" value={formData.stockBaby} onChange={(e) => setFormData({ ...formData, stockBaby: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
          </div>
          <div className="w-1/2 pr-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                value={formData.status || "active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="active">Mở bán (OPEN)</option>
                <option value="inactive">Đóng (CLOSED)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button onClick={handleLocalSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}