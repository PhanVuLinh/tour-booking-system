import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { bookingService } from "../services/BookService";
import { BookingTable, getStatusBadge } from "../components/BookingTable";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirm = async (id) => {
    if (!window.confirm("Bạn muốn xác nhận thanh toán cho đơn này?")) return;
    try {
      await bookingService.confirm(id);
      toast.success("Đã xác nhận thanh toán thành công");
      loadData();
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt vé này?")) return;
    try {
      await bookingService.cancel(id);
      toast.success("Đã hủy đơn đặt vé");
      loadData();
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  // Logic Tìm Kiếm & Lọc theo cấu trúc mới
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || booking.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getCount = (status) => bookings.filter(b => b.status === status).length;
  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-8 w-full relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn đặt vé</h1>
        <p className="text-gray-500 mt-1">Xác nhận đơn hàng, kiểm tra chi tiết phân loại vé dựa trên cấu trúc DB</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6">
        
        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn (bookingCode), khách hàng, tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-100 mb-4 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab("all")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "all" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            Tất cả ({bookings.length})
          </button>
          <button onClick={() => setActiveTab("pending")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "pending" ? "bg-yellow-50 text-yellow-700" : "text-gray-500 hover:text-gray-700"}`}>
            Chờ thanh toán ({getCount("pending")})
          </button>
          <button onClick={() => setActiveTab("confirmed")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "confirmed" ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-700"}`}>
            Đã xác nhận ({getCount("confirmed")})
          </button>
          <button onClick={() => setActiveTab("cancelled")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "cancelled" ? "bg-red-50 text-red-700" : "text-gray-500 hover:text-gray-700"}`}>
            Đã hủy ({getCount("cancelled")})
          </button>
        </div>

        <BookingTable data={filteredBookings} onView={(b) => { setSelectedBooking(b); setIsDetailOpen(true); }} onConfirm={handleConfirm} onCancel={handleCancel} />
      </div>

      {/* Modal Xem chi tiết Đơn hàng nâng cấp theo DB */}
      {isDetailOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chi tiết hóa đơn đặt vé</h2>
                <p className="text-sm text-gray-500 mt-1">Mã Booking: <span className="font-mono font-semibold text-gray-900">{selectedBooking.bookingCode}</span></p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Nội dung chi tiết */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Thông tin khách & Tour */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
                <div>
                  <p className="text-gray-500 mb-0.5">Khách hàng (User ID: {selectedBooking.userId})</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Thời gian hệ thống nhận đơn</p>
                  <p className="font-medium text-gray-900">{selectedBooking.createdAt}</p>
                </div>
                <div className="col-span-2 border-t border-gray-200 pt-2">
                  <p className="text-gray-500 mb-0.5">Tên sản phẩm Tour (Departure ID: {selectedBooking.departureId})</p>
                  <p className="font-semibold text-gray-900 text-base">{selectedBooking.tourName}</p>
                </div>
              </div>

              {/* Bảng kê khai chi tiết giá các loại vé */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Chi tiết phân loại vé</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 font-medium text-gray-600 border-b border-gray-100">
                      <tr>
                        <th className="p-3">Loại vé</th>
                        <th className="p-3 text-center">Số lượng</th>
                        <th className="p-3 text-right">Đơn giá</th>
                        <th className="p-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium">Người lớn (Adult)</td>
                        <td className="p-3 text-center font-mono">{selectedBooking.quantityAdult}</td>
                        <td className="p-3 text-right text-gray-600">{formatCurrency(selectedBooking.adultPrice)}</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(selectedBooking.quantityAdult * selectedBooking.adultPrice)}</td>
                      </tr>
                      {selectedBooking.quantityChildren > 0 && (
                        <tr>
                          <td className="p-3 font-medium">Trẻ em (Children)</td>
                          <td className="p-3 text-center font-mono">{selectedBooking.quantityChildren}</td>
                          <td className="p-3 text-right text-gray-600">{formatCurrency(selectedBooking.childrenPrice)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(selectedBooking.quantityChildren * selectedBooking.childrenPrice)}</td>
                        </tr>
                      )}
                      {selectedBooking.quantityBaby > 0 && (
                        <tr>
                          <td className="p-3 font-medium">Em bé (Baby)</td>
                          <td className="p-3 text-center font-mono">{selectedBooking.quantityBaby}</td>
                          <td className="p-3 text-right text-gray-600">{formatCurrency(selectedBooking.babyPrice)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(selectedBooking.quantityBaby * selectedBooking.babyPrice)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedBooking.note && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Ghi chú từ khách hàng:</h3>
                  <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-gray-700 italic">
                    "{selectedBooking.note}"
                  </div>
                </div>
              )}

              {/* Phần đối chiếu tổng tiền thanh toán */}
              <div className="border-t border-gray-100 pt-4 flex flex-col items-end space-y-2 text-sm">
                <div className="flex justify-between w-64 text-gray-500">
                  <span>Tạm tính (subTotal):</span>
                  <span className="font-medium text-gray-900">{formatCurrency(selectedBooking.subTotal)}</span>
                </div>
                <div className="flex justify-between w-64 text-gray-500">
                  <span>Mã giảm giá (Discount ID):</span>
                  <span className="font-medium text-red-600">{selectedBooking.discountId ? `#${selectedBooking.discountId}` : "Không áp dụng"}</span>
                </div>
                <div className="flex justify-between w-64 text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Tổng thanh toán (total):</span>
                  <span className="text-lg text-green-600">{formatCurrency(selectedBooking.total)}</span>
                </div>
                <div className="flex justify-between w-64 items-center pt-1">
                  <span className="text-xs text-gray-500 font-medium">Trạng thái đơn:</span>
                  <div>{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setIsDetailOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
