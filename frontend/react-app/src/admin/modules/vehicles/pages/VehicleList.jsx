import { useState, useEffect, useMemo } from "react";
import { Plus, Search, RefreshCw, Trash2, Lock } from "lucide-react";
import { VehicleTable, VehicleTrashTable } from "../components/VehicleTable";
import { VehicleModal } from "../components/VehicleModal";
import { vehicleService } from "../services/vehicleService";
import { accountService } from "../../users/services/accountService";

const initialFormState = {
  name: "",
  vehicleType: "BUS" 
};

export default function VehicleList() {
  // 1. Kiểm tra quyền Admin
  const isAdmin = useMemo(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return false;
      const user = JSON.parse(userString);
      return user.role && String(user.role).toLowerCase() === "admin";
    } catch (e) { return false; }
  }, []);

  const [vehicles, setVehicles] = useState([]);
  const [deletedVehicles, setDeletedVehicles] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const [vData, trashData, accData] = await Promise.all([
        vehicleService.getAll().catch(() => []),
        isAdmin ? vehicleService.getAllTrash().catch(() => []) : Promise.resolve([]),
        accountService.getAllActive().catch(() => [])
      ]);
      
      setVehicles(Array.isArray(vData) ? vData : []);
      setDeletedVehicles(Array.isArray(trashData) ? trashData : []);
      setAccountList(Array.isArray(accData) ? accData : []);
    } catch (error) {
      alert("Lỗi tải dữ liệu: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditVehicle(null);
  };

  useEffect(() => {
    fetchVehicles();
  }, [isAdmin,activeTab]);

  const getAccountName = (id) => {
    if (!id) return null;
    const account = accountList.find(acc => String(acc.id) === String(id));
    return account ? account.fullName : null;
  };

  const filteredVehicles = vehicles.filter(v =>
    v.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedVehicles = deletedVehicles.filter(v =>
    v.name?.toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên phương tiện!");
      return;
    }

    try {
      if (editVehicle) {
        await vehicleService.update(editVehicle.id, formData);
        alert("Cập nhật phương tiện thành công!");
      } else {
        await vehicleService.create(formData);
        alert("Thêm phương tiện mới thành công!");
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchVehicles(); 
    } catch (error) {
      alert("Lỗi khi lưu dữ liệu: " + error.message);
    }
  };

  const handleEdit = (vehicle) => {
    setEditVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      vehicleType: vehicle.vehicleType
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (window.confirm(`Bạn có chắc chắn muốn chuyển phương tiện "${vehicle?.name}" vào thùng rác?`)) {
      try {
        await vehicleService.delete(id);
        alert("Đã chuyển vào thùng rác thành công!");
        fetchVehicles();
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await vehicleService.restore(id);
      alert("Khôi phục thành công!");
      fetchVehicles();
    } catch (error) {
      alert("Lỗi khi khôi phục: " + error.message);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Hành động này sẽ xóa vĩnh viễn dữ liệu. Bạn có chắc chắn không?")) {
      try {
        await vehicleService.hardDelete(id);
        alert("Đã xóa vĩnh viễn!");
        fetchVehicles();
      } catch (error) {
        alert("Lỗi khi xóa vĩnh viễn: " + error.message);
      }
    }
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phương tiện</h1>
          <p className="text-gray-500 mt-1">Danh mục các loại xe, tàu, máy bay</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setIsLoading(true); fetchVehicles(); }} 
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          
          {activeTab === "active" && (
            <button 
              onClick={openNewDialog} 
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm phương tiện
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => { setIsLoading(true); setActiveTab("active"); }} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >Đang hoạt động
          </button>
          
          <button 
            onClick={() => { if (isAdmin) { setIsLoading(true); setActiveTab("trash"); } }} 
            disabled={!isAdmin}
            title={!isAdmin ? "Bạn cần quyền Admin để xem Thùng rác" : ""}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              !isAdmin 
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : activeTab === "trash" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!isAdmin ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            Thùng rác {isAdmin && `(${deletedVehicles.length})`}
          </button>
        </div>

        <div className="p-6 pt-2">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeTab === "active" ? "Tìm kiếm phương tiện..." : "Tìm kiếm trong thùng rác..."} 
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
            <VehicleTable 
              vehicles={filteredVehicles} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              getAccountName={getAccountName}
            />
          ) : (
            <VehicleTrashTable 
              vehicles={filteredDeletedVehicles} 
              onRestore={handleRestore} 
              onPermanentDelete={handlePermanentDelete} 
              getAccountName={getAccountName}
            />
          )}
        </div>
      </div>

      <VehicleModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleSubmit}
        formData={formData} 
        setFormData={setFormData} 
        isEdit={!!editVehicle} 
      />
      
    </div>
  );
}