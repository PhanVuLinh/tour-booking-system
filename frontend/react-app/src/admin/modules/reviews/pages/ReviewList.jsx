import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { reviewService } from "../services/reviewService";
import { ReviewTable } from "../components/ReviewTable";
import Pagination from "../../../components/Pagination";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAll();
      setReviews(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleToggleVisibility = async (id) => {
    try {
      const updated = await reviewService.toggleVisibility(id);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: updated.status } : r));
      toast.success(updated.status === "visible" ? "Đã hiển thị đánh giá" : "Đã ẩn đánh giá");
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  const handleDeletePrompt = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const review = reviews.find(r => r.id === deleteId);
    try {
      await reviewService.delete(deleteId);
      setReviews(prev => prev.filter(r => r.id !== deleteId));
      toast.success(`Đã chuyển đánh giá của "${review?.customerName}" vào thùng rác`);
    } catch (error) {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.tourName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 w-full relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
        <p className="text-sm text-gray-500 mt-1">Kiểm duyệt và quản lý đánh giá từ khách hàng</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6 pb-2">
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo khách hàng hoặc tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
          />
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Đang tải dữ liệu...</div>
        ) : (
          <ReviewTable
            reviews={paginatedList}
            onToggleVisibility={handleToggleVisibility}
            onDelete={handleDeletePrompt}
          />
        )}

        {totalPages > 0 && !loading && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Custom Modal Xác nhận xóa thay thế cho AlertDialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa đánh giá</h3>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa đánh giá này? Đánh giá sẽ được chuyển vào thùng rác và có thể khôi phục sau.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}