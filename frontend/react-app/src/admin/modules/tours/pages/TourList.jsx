import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { TourTable, TourTrashTable } from "../components/TourTable";
import { mockTours } from "../services/mockData";

export function TourList() {
  const [tours, setTours] = useState(mockTours || []);
  const [deletedTours, setDeletedTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedTours = deletedTours.filter((tour) =>
    tour.name.toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tour này? Tour sẽ được chuyển vào thùng rác.")) return;
    
    const tour = tours.find((t) => t.id === id);
    if (tour) {
      setDeletedTours([
        ...deletedTours,
        { ...tour, deletedBy: "Admin User", deletedAt: new Date().toLocaleString("vi-VN") },
      ]);
      setTours(tours.filter((t) => t.id !== id));
      alert(`Đã chuyển tour "${tour.name}" vào thùng rác`);
    }
  };

  const handleRestore = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục tour này?")) return;

    const tour = deletedTours.find((t) => t.id === id);
    if (tour) {
      const { deletedBy, deletedAt, ...restTour } = tour;
      setTours([...tours, restTour]);
      setDeletedTours(deletedTours.filter((t) => t.id !== id));
      alert(`Đã khôi phục tour "${tour.name}"`);
    }
  };

  const handlePermanentDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tour này? Hành động này không thể hoàn tác.")) return;

    setDeletedTours(deletedTours.filter((t) => t.id !== id));
    alert("Đã xóa vĩnh viễn tour");
  };

return (
    // 1. p-8: Tạo khoảng đệm cách Sidebar và viền trên/dưới/phải
    <div className="p-8 w-full">
      
      {/* 2. mb-6: Tạo khoảng cách giữa Header và khối chứa bảng bên dưới */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tour</h1>
          <p className="text-gray-500 mt-1">Thêm mới, sửa và xóa các tour du lịch</p>
        </div>
        <Link 
          to="/admin/tours/new" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Thêm Tour mới
        </Link>
      </div>

      {/* 3. Khối Card: Thêm viền nhạt, bo góc và bóng mờ */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        
        {/* Phần Tabs */}
        <div className="flex border-b border-gray-200 px-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Tour đang hoạt động ({tours.length})
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "trash" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Thùng rác ({deletedTours.length})
          </button>
        </div>

        {/* 4. Phần nội dung (Search + Table): p-6 để nội dung không chạm sát viền khung */}
        <div className="p-6">
          {activeTab === "active" ? (
            <div>
              {/* 5. mb-4: Tạo khoảng cách giữa ô tìm kiếm và bảng */}
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <TourTable tours={filteredTours} onDelete={handleDelete} />
            </div>
          ) : (
            <div>
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trong thùng rác..."
                  value={trashSearchTerm}
                  onChange={(e) => setTrashSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <TourTrashTable
                tours={filteredDeletedTours}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}