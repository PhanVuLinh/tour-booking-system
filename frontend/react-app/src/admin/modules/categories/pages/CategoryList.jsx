import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { CategoryTable, CategoryTrashTable } from "../components/CategoryTable";
import { CategoryModal } from "../components/CategoryModal";

const mockCategories = [
  { id: 1, name: "Tour Miền Bắc", description: "Các tour du lịch khu vực Miền Bắc", tourCount: 23 },
  { id: 2, name: "Tour Miền Trung", description: "Các tour du lịch khu vực Miền Trung", tourCount: 18 },
  { id: 3, name: "Tour Miền Nam", description: "Các tour du lịch khu vực Miền Nam", tourCount: 15 },
  { id: 4, name: "Tour Quốc tế", description: "Các tour du lịch nước ngoài", tourCount: 11 },
];

export default function CategoryList() {
  const [categories, setCategories] = useState(mockCategories);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedCategories = deletedCategories.filter(cat =>
    cat.name.toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }
    if (editCategory) {
      setCategories(categories.map(cat => cat.id === editCategory.id ? { ...cat, ...formData } : cat));
      alert("Cập nhật danh mục thành công!");
    } else {
      setCategories([...categories, { id: Date.now(), ...formData, tourCount: 0 }]);
      alert("Thêm danh mục mới thành công!");
    }
    setIsDialogOpen(false);
    setFormData({ name: "", description: "" });
    setEditCategory(null);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditCategory(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const category = categories.find(c => c.id === id);
    if (category && category.tourCount > 0) return alert("Không thể xóa danh mục đang có chứa tour hoạt động!");
    
    if (window.confirm(`Bạn có chắc chắn muốn chuyển danh mục "${category?.name}" vào thùng rác?`)) {
      setDeletedCategories([...deletedCategories, { ...category, deletedBy: "Admin User", deletedAt: new Date().toLocaleString('vi-VN') }]);
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleRestore = (id) => {
    const category = deletedCategories.find(c => c.id === id);
    if (window.confirm(`Bạn muốn khôi phục danh mục "${category?.name}"?`)) {
      const { deletedBy, deletedAt, ...restCategory } = category;
      setCategories([...categories, restCategory]);
      setDeletedCategories(deletedCategories.filter(c => c.id !== id));
    }
  };

  const handlePermanentDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn danh mục này? Hành động này không thể hoàn tác.")) {
      setDeletedCategories(deletedCategories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
          <p className="text-gray-500 mt-1">Quản lý các danh mục tour du lịch</p>
        </div>
        <button onClick={openNewDialog} className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" /> Thêm danh mục
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="flex border-b border-gray-200 px-4">
          <button onClick={() => setActiveTab("active")} className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            Danh mục ({categories.length})
          </button>
          <button onClick={() => setActiveTab("trash")} className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "trash" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            Thùng rác ({deletedCategories.length})
          </button>
        </div>

        <div className="p-6">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder={activeTab === "active" ? "Tìm kiếm danh mục..." : "Tìm kiếm trong thùng rác..."} value={activeTab === "active" ? searchTerm : trashSearchTerm} onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
          
          {activeTab === "active" ? (
            <CategoryTable categories={filteredCategories} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <CategoryTrashTable categories={filteredDeletedCategories} onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} />
          )}
        </div>
      </div>

      <CategoryModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleSubmit} 
        formData={formData} 
        setFormData={setFormData} 
        isEdit={!!editCategory} 
      />
    </div>
  );
}