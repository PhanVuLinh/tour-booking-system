import { useState, useEffect } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { VehicleTable } from "../components/VehicleTable";
import { VehicleModal } from "../components/VehicleModal";
import { VehicleTrashModal } from "../components/VehicleTrashModal";
import { vehicleService } from "../services/vehicleService";

const initialFormState = {
  name: "",
  vehicleType: "BUS" 
};

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  
  const [editVehicle, setEditVehicle] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error) {
      alert("Không thể tải danh sách phương tiện: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditVehicle(null);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (vehicle) => {
    setEditVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      vehicleType: vehicle.vehicleType
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn chuyển phương tiện này vào thùng rác không?")) {
      try {
        await vehicleService.delete(id);
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên phương tiện!");
      return;
    }

    try {
      if (editVehicle) {
        await vehicleService.update(editVehicle.id, formData);
      } else {
        await vehicleService.create(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchVehicles(); 
    } catch (error) {
      alert("Lỗi khi lưu dữ liệu: " + error.message);
    }
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      
      {/* Khối Header & Nút chức năng */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phương tiện</h1>
          <p className="text-gray-500 mt-1">Danh mục các loại xe, tàu, máy bay</p>
        </div>
        <div className="flex gap-2">
          {/* Nút Thùng rác */}
          <button 
            onClick={() => setIsTrashOpen(true)} 
            className="p-2 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors" 
            title="Thùng rác"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={fetchVehicles} 
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" 
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          
          <button 
            onClick={openNewDialog} 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" /> Thêm mới
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Đang tải dữ liệu từ máy chủ...</div>
          ) : (
            <VehicleTable 
              vehicles={vehicles} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
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
      <VehicleTrashModal 
        isOpen={isTrashOpen} 
        onClose={() => setIsTrashOpen(false)} 
        onRestored={fetchVehicles} 
      />
      
    </div>
  );
}