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
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredDeletedTours = deletedTours.filter((tour) =>
    tour.name.toLowerCase().includes(trashSearchTerm.toLowerCase()),
  );

  const handleDelete = (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa tour này? Tour sẽ được chuyển vào thùng rác.",
      )
    )
      return;

    const tour = tours.find((t) => t.id === id);
    if (tour) {
      setDeletedTours([
        ...deletedTours,
        {
          ...tour,
          deletedBy: "Admin User",
          deletedAt: new Date().toLocaleString("vi-VN"),
        },
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
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa vĩnh viễn tour này? Hành động này không thể hoàn tác.",
      )
    )
      return;

    setDeletedTours(deletedTours.filter((t) => t.id !== id));
    alert("Đã xóa vĩnh viễn tour");
  };

  return (
    <div className="p-8 w-full">
      {/* 1. HEADER & NÚT THÊM TOUR (Sửa thành màu đen/xám đậm giống Figma) */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tour</h1>
          <p className="text-gray-500 mt-1">
            Thêm mới, sửa và xóa các tour du lịch
          </p>
        </div>
        <Link
          to="/admin/tours/new"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm Tour mới
        </Link>
      </div>

      {/* KHỐI CARD CHÍNH */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6">
        {/* 2. TAB STYLE DẠNG VIÊN THUỐC (Pill Tabs) GIỐNG FIGMA */}
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "active"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tour ({tours.length})
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "trash"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thùng rác ({deletedTours.length})
          </button>
        </div>

        {/* NỘI DUNG TÌM KIẾM & BẢNG */}
        <div>
          {/* 3. Ô TÌM KIẾM (Nền xám, bo góc tròn, không viền) */}
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === "active"
                  ? "Tìm kiếm tour..."
                  : "Tìm kiếm trong thùng rác..."
              }
              value={activeTab === "active" ? searchTerm : trashSearchTerm}
              onChange={(e) =>
                activeTab === "active"
                  ? setSearchTerm(e.target.value)
                  : setTrashSearchTerm(e.target.value)
              }
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
            />
          </div>

          {/* HIỂN THỊ BẢNG */}
          {activeTab === "active" ? (
            <TourTable tours={filteredTours} onDelete={handleDelete} />
          ) : (
            <TourTrashTable
              tours={filteredDeletedTours}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
