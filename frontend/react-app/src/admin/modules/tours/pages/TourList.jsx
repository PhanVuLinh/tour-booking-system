import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import { TourTable, TourTrashTable } from "../components/TourTable";
import { tourService } from "../services/tourService";

export function TourList() {
  const [tours, setTours] = useState([]);
  const [deletedTours, setDeletedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedTour, setSelectedTour] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [toursData, categoriesData] = await Promise.all([
          tourService.getAll().catch(() => []),       
          tourService.getCategories().catch(() => []) 
        ]);

        const safeTours = Array.isArray(toursData) ? toursData : [];
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];

        const mappedTours = safeTours.map(tour => {
          const foundCategory = safeCategories.find(
            cat => Number(cat.id) === Number(tour.categoryId)
          );
          
          return {
            ...tour,
            // SỬA CHỖ NÀY: cat.name đổi thành cat.title vì dữ liệu DB dùng trường title
            category: foundCategory ? foundCategory.title : `Danh mục #${tour.categoryId}`
          };
        });

        setTours(mappedTours);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTours = tours.filter((tour) =>
    tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const filteredDeletedTours = deletedTours.filter((tour) =>
    tour.name?.toLowerCase().includes(trashSearchTerm.toLowerCase()) || false
  );

  const handleViewDetail = (tour) => {
    setSelectedTour(tour);
    setIsDetailOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tour này? Tour sẽ được chuyển vào thùng rác.")) return;
    try {
      await tourService.delete(id);
      const tour = tours.find((t) => t.id === id);
      if (tour) {
        setDeletedTours([
          ...deletedTours,
          { ...tour, deletedBy: "Admin User", deletedAt: new Date().toLocaleString("vi-VN") },
        ]);
        setTours(tours.filter((t) => t.id !== id));
      }
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };

  const handleRestore = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục tour này?")) return;
    const tour = deletedTours.find((t) => t.id === id);
    if (tour) {
      // eslint-disable-next-line no-unused-vars
      const { deletedBy: _deletedBy, deletedAt: _deletedAt, ...restTour } = tour;
      setTours([...tours, restTour]);
      setDeletedTours(deletedTours.filter((t) => t.id !== id));
    }
  };

  const handlePermanentDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tour này? Hành động này không thể hoàn tác.")) return;
    setDeletedTours(deletedTours.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tour</h1>
          <p className="text-gray-500 mt-1">Thêm mới, sửa và xóa các tour du lịch</p>
        </div>
        <Link
          to="/admin/tours/new"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm Tour mới
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tour ({tours.length})
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thùng rác ({deletedTours.length})
          </button>
        </div>

        <div>
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "active" ? "Tìm kiếm tour..." : "Tìm kiếm trong thùng rác..."}
              value={activeTab === "active" ? searchTerm : trashSearchTerm}
              onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
            />
          </div>

          {activeTab === "active" ? (
            <TourTable tours={filteredTours} onView={handleViewDetail} onDelete={handleDelete} />
          ) : (
            <TourTrashTable
              tours={filteredDeletedTours}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          )}
        </div>
      </div>

      {isDetailOpen && selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết Tour</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <img
                src={selectedTour.image}
                alt={selectedTour.name}
                className="w-full h-56 object-cover rounded-xl shadow-sm border border-gray-100"
              />
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
                <div className="col-span-2 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Ngày tạo hệ thống</p>
                  <p className="font-medium text-gray-900">{selectedTour.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}