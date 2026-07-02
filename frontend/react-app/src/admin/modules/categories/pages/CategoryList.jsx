import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { CategoryTable, CategoryTrashTable } from "../components/CategoryTable";
import { CategoryModal } from "../components/CategoryModal";
import { CategoryDetailModal } from "../components/CategoryDetailModal";
import { categoryService } from "../services/categoryApi";
import { accountService } from "../../users/services/accountService"; 

const initialFormState = { title: "", description: "", parentId: "" };

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [viewCategory, setViewCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accData = await accountService.getAllActive(); 
        setAccounts(accData);
      } catch (error) {
        console.error("Lỗi tải danh sách tài khoản:", error);
      }
    };
    fetchAccounts();
  }, []);

  const fetchData = async () => {
    try {
      if (activeTab === "active") {
        const data = await categoryService.getAllActive();
        setCategories(data);
      } else {
        const trashData = await categoryService.getAllTrash();
        setDeletedCategories(trashData);
      }
    } catch (error) {
      alert("Không thể tải dữ liệu từ hệ thống: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditCategory(null);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const filteredCategories = categories.filter(cat =>
    cat.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedCategories = deletedCategories.filter(cat =>
    cat.title?.toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.title || !formData.title.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description ? formData.description.trim() : "",
        status: formData.status || "active",
        parentId: formData.parentId ? Number(formData.parentId) : null
      };

      if (editCategory) {
        await categoryService.update(editCategory.id, payload);
        alert("Cập nhật danh mục thành công!");
      } else {
        await categoryService.create(payload);
        alert("Thêm danh mục mới thành công!");
      }
      
      setIsDialogOpen(false);
      resetForm();
      
      setIsLoading(true); 
      fetchData();
      
    } catch (error) {
      alert("Lỗi hệ thống: " + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setFormData({ 
      title: category.title || "", 
      description: category.description || "",
      parentId: category.parentId || "",
      status: category.status || "active"
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const category = categories.find(c => c.id === id);
    if (category && category.tourCount > 0) {
      return alert("Không thể xóa danh mục đang chứa các tour hoạt động!");
    }
    
    if (window.confirm(`Bạn có chắc chắn muốn chuyển danh mục "${category?.title}" vào thùng rác?`)) {
      try {
        await categoryService.softDelete(id);
        alert("Đã chuyển danh mục vào thùng rác thành công!");
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const handleRestore = async (id) => {
    const category = deletedCategories.find(c => c.id === id);
    if (window.confirm(`Bạn muốn khôi phục danh mục "${category?.title}" về trạng thái hoạt động?`)) {
      try {
        await categoryService.restore(id);
        alert("Khôi phục danh mục thành công!");
        setDeletedCategories(deletedCategories.filter(c => c.id !== id));
      } catch (error) {
        alert("Lỗi khi khôi phục: " + error.message);
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Hành động này sẽ xóa vĩnh viễn danh mục này và không thể hoàn tác. Bạn có chắc chắn không?")) {
      try {
        await categoryService.hardDelete(id);
        alert("Đã xóa vĩnh viễn danh mục khỏi cơ sở dữ liệu!");
        setDeletedCategories(deletedCategories.filter(c => c.id !== id));
      } catch (error) {
        alert("Lỗi khi hủy: " + error.message);
      }
    }
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={openNewDialog} 
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm danh mục
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => { setIsLoading(true); setActiveTab("active"); }} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Danh mục ({categories.length})
          </button>
          <button 
            onClick={() => { setIsLoading(true); setActiveTab("trash"); }} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${activeTab === "trash" ? "bg-red-100 text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Thùng rác ({deletedCategories.length})
          </button>
        </div>

        <div className="p-6 pt-2">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeTab === "active" ? "Tìm kiếm danh mục..." : "Tìm kiếm trong thùng rác..."} 
              value={activeTab === "active" ? searchTerm : trashSearchTerm} 
              onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all" 
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span>Đang đồng bộ dữ liệu...</span>
            </div>
          ) : activeTab === "active" ? (
            <CategoryTable categories={filteredCategories} onView={(cat) => setViewCategory(cat)} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <CategoryTrashTable 
              categories={filteredDeletedCategories} 
              accounts={accounts} 
              onRestore={handleRestore} 
              onPermanentDelete={handlePermanentDelete} 
            />
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
        categories={categories}
        currentCategoryId={editCategory?.id}
      />
      <CategoryDetailModal 
        isOpen={!!viewCategory} 
        category={viewCategory} 
        categories={categories}
        accounts={accounts}
        onClose={() => setViewCategory(null)} 
      />
    </div>
  );
}