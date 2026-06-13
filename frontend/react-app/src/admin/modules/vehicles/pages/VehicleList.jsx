import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { vehicleService } from "../services/vehicleService";
import { ActiveVehicleTable, TrashVehicleTable, VEHICLE_TYPES } from "../components/VehicleTable";

const defaultForm = { name: "", vehicleType: "" };

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [deletedVehicles, setDeletedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearchTerm, setTrashSearchTerm] = useState("");
  const [formData, setFormData] = useState(defaultForm);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activeData, trashData] = await Promise.all([
        vehicleService.getAllActive(),
        vehicleService.getAllTrash()
      ]);
      setVehicles(activeData);
      setDeletedVehicles(trashData);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeleted = deletedVehicles.filter((v) =>
    v.name.toLowerCase().includes(trashSearchTerm.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(trashSearchTerm.toLowerCase())
  );

  const openNew = () => {
    setEditVehicle(null);
    setFormData(defaultForm);
    setIsDialogOpen(true);
  };

  const openEdit = (vehicle) => {
    setEditVehicle(vehicle);
    setFormData({ name: vehicle.name, vehicleType: vehicle.vehicleType });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.vehicleType) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      if (editVehicle) {
        await vehicleService.update(editVehicle.id, formData);
        toast.success("Cập nhật phương tiện thành công");
      } else {
        await vehicleService.create(formData);
        toast.success("Thêm phương tiện thành công");
      }
      setIsDialogOpen(false);
      loadData(); 
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn chuyển phương tiện này vào thùng rác?")) return;
    try {
      await vehicleService.softDelete(id);
      toast.success("Đã chuyển phương tiện vào thùng rác");
      loadData();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Bạn có muốn khôi phục phương tiện này?")) return;
    try {
      await vehicleService.restore(id);
      toast.success("Đã khôi phục phương tiện");
      loadData();
    } catch (error) {
      toast.error("Khôi phục thất bại");
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa vĩnh viễn?")) return;
    try {
      await vehicleService.hardDelete(id);
      toast.success("Đã xóa vĩnh viễn");
      loadData();
    } catch (error) {
      toast.error("Xóa vĩnh viễn thất bại");
    }
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

  return (
    <div className="p-8 w-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phương tiện</h1>
          <p className="text-gray-500 mt-1">Quản lý các loại phương tiện sử dụng trong tour</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm phương tiện
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(VEHICLE_TYPES).map(([key, { label, icon: Icon, color }]) => {
          const count = vehicles.filter((v) => v.vehicleType === key).length;
          return (
            <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color.replace("text-", "text-").split(" ")[0]}`}>
                <Icon className={`w-5 h-5 ${color.split(" ")[1]}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="font-bold text-lg leading-none mt-1">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Phương tiện ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thùng rác ({deletedVehicles.length})
          </button>
        </div>

        <div>
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "active" ? "Tìm kiếm phương tiện..." : "Tìm kiếm trong thùng rác..."}
              value={activeTab === "active" ? searchTerm : trashSearchTerm}
              onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
            />
          </div>

          {activeTab === "active" ? (
            <ActiveVehicleTable vehicles={filteredVehicles} onEdit={openEdit} onDelete={handleDelete} />
          ) : (
            <TrashVehicleTable vehicles={filteredDeleted} onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} />
          )}
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editVehicle ? "Chỉnh sửa phương tiện" : "Thêm phương tiện mới"}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên phương tiện <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Xe khách Hoàng Long 45 chỗ"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại phương tiện <span className="text-red-500">*</span></label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                >
                  <option value="" disabled>-- Chọn loại phương tiện --</option>
                  {Object.entries(VEHICLE_TYPES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-black transition-colors"
              >
                {editVehicle ? "Cập nhật" : "Lưu phương tiện"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}