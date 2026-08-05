import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bookingService } from "../services/BookService";
import { paymentService } from "../services/paymentService";
import { passengerService } from "../services/passengerService";
import { BookingTable } from "../components/BookingTable";
import { BookingDetailModal, getOverallPaymentStatus } from "../components/BookingDetailModal";
import ConfirmModal from "../../../components/ConfirmModal";
import Pagination from "../../../components/Pagination";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [confirmConfig, setConfirmConfig] = useState({isOpen: false,title: "",message: "",variant: "info",action: null});

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const closeConfirm = () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };

  const executeConfirmAction = async () => {
    if (confirmConfig.action) {
      await confirmConfig.action();
    }
    closeConfirm();
  };

  const handleConfirmBooking = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận đơn hàng",
      message: "Bạn có chắc chắn muốn xác nhận đơn hàng này?",
      variant: "info",
      action: async () => {
        try {
          await bookingService.updateStatus(id, "confirmed");
          const booking = bookings.find(b => b.id === id);
          bookingService.notifyStatusChange(id, "confirmed", getOverallPaymentStatus(booking?.payments));
          toast.success("Đã xác nhận đơn hàng");
          loadData();
        } catch (error) {
          toast.error(error.message || "Thao tác thất bại");
        }
      }
    });
  };

  const handleCancelBooking = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Hủy đơn hàng",
      message: "Bạn chắc chắn muốn hủy đơn đặt tour này?",
      variant: "danger",
      action: async () => {
        try {
          await bookingService.cancelBooking(id);
          const booking = bookings.find(b => b.id === id);
          bookingService.notifyStatusChange(id, "cancelled", getOverallPaymentStatus(booking?.payments));
          toast.success("Đã hủy đơn");
          loadData();
        } catch (error) {
          toast.error(error.message || "Thao tác thất bại");
        }
      }
    });
  };

  const handleCompleteBooking = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Hoàn thành chuyến đi",
      message: "Đánh dấu chuyến đi này đã hoàn thành?",
      variant: "info",
      action: async () => {
        try {
          await bookingService.updateStatus(id, "completed");
          const booking = bookings.find(b => b.id === id);
          bookingService.notifyStatusChange(id, "completed", getOverallPaymentStatus(booking?.payments));
          toast.success("Đã hoàn thành chuyến đi");
          loadData();
        } catch (error) {
          toast.error(error.message || "Thao tác thất bại");
        }
      }
    });
  };

  const handleConfirmPayment = (paymentId) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận thanh toán",
      message: "Xác nhận bạn đã nhận được tiền cho giao dịch này?",
      variant: "info",
      action: async () => {
        try {
          await paymentService.confirmPayment(paymentId);
          toast.success("Xác nhận thanh toán thành công!");
          loadData();
          if (selectedBooking) {
            const updatedBooking = await bookingService.getById(selectedBooking.id);
            setSelectedBooking(updatedBooking);
            bookingService.notifyStatusChange(updatedBooking.id, updatedBooking.status, "paid");
          }
        } catch (error) {
          toast.error(error.message || "Thao tác thất bại");
        }
      }
    });
  };

  const handleUpdatePassenger = async (passengerId, passengerData) => {
    try {
      await passengerService.update(passengerId, passengerData);
      toast.success("Cập nhật thông tin hành khách thành công!");
      loadData();
      if (selectedBooking) {
        const updatedBooking = await bookingService.getById(selectedBooking.id);
        setSelectedBooking(updatedBooking);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật hành khách");
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.tourTitle && booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getCount = (status) => bookings.filter(b => b.status === status).length;

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 w-full relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn đặt vé</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6 pb-2">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn, khách hàng, tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
          />
        </div>

        <div className="flex gap-2 border-b border-gray-100 mb-4 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab("all")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "all" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            Tất cả ({bookings.length})
          </button>
          <button onClick={() => setActiveTab("pending")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "pending" ? "bg-yellow-50 text-yellow-700" : "text-gray-500 hover:text-gray-700"}`}>
            Chờ xác nhận ({getCount("pending")})
          </button>
          <button onClick={() => setActiveTab("confirmed")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "confirmed" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
            Đã xác nhận ({getCount("confirmed")})
          </button>
          <button onClick={() => setActiveTab("cancelled")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "cancelled" ? "bg-red-50 text-red-700" : "text-gray-500 hover:text-gray-700"}`}>
            Đã hủy ({getCount("cancelled")})
          </button>
          <button onClick={() => setActiveTab("completed")} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === "completed" ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-700"}`}>
            Hoàn thành ({getCount("completed")})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <span className="text-sm font-medium text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            <BookingTable 
              data={paginatedBookings} 
              onView={handleView}
              onConfirm={handleConfirmBooking} 
              onCancel={handleCancelBooking} 
              onComplete={handleCompleteBooking}
            />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        )}
      </div>

      {isDetailOpen && selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking} 
          onClose={() => setIsDetailOpen(false)} 
          onConfirmPayment={handleConfirmPayment}
          onUpdatePassenger={handleUpdatePassenger}
        />
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        onCancel={closeConfirm}
        onConfirm={executeConfirmAction}
      />
    </div>
  );
}