import { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { DepartureTable, DepartureTrashTable } from "../components/DepartureTable";
import { DepartureModal } from "../components/DepartureModal";
import { DepartureDetailModal } from "../components/DepartureDetailModal"; 
import { departureService } from "../services/departureService";
import { vehicleService } from "../../vehicles/services/vehicleService"; 
import { tourService } from "../../tours/services/tourService";
import { accountService } from "../../users/services/accountService"; 

const initialFormState = {
  tourId: "", vehicleId: "", startTime: "", departureFrom: "", 
  priceAdult: "", priceChildren: "", priceBaby: "",
  stockAdult: "", stockChildren: "", stockBaby: "", status: "OPEN"
};

const getCurrentUserId = () => {
  const id = localStorage.getItem("userId"); 
  return id ? parseInt(id) : null;
};

export default function DepartureList() {
  const [departures, setDepartures] = useState([]);
  const [trashDepartures, setTrashDepartures] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  const [vehicles, setVehicles] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [tourList, setTourList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDeparture, setEditDeparture] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [accountList, setAccountList] = useState([]);
  
  const handleViewDetail = (departureData) => {
    setSelectedDeparture(departureData);
    setIsDetailModalOpen(true);
  };
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [depData, trashData, vehData, tourData, accData] = await Promise.all([
        departureService.getAll(),
        departureService.getAllTrash(), 
        vehicleService.getAll(),
        tourService.getAll(),
        accountService.getAllActive()
      ]);
      setDepartures(depData);
      setTrashDepartures(trashData);
      setVehicles(vehData);
      setTourList(tourData);
      setAccountList(accData);
    } catch (error) {
      alert("Không thể kết nối đến máy chủ: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditDeparture(null);
  };

  const handleSubmit = async () => {
    try {
      const userId = getCurrentUserId();

      const payload = {
        tourId: parseInt(formData.tourId),
        vehicleId: formData.vehicleId ? parseInt(formData.vehicleId) : null,
        startTime: formData.startTime,
        departureFrom: formData.departureFrom,
        priceAdult: parseFloat(formData.priceAdult),
        priceChildren: parseFloat(formData.priceChildren),
        priceBaby: parseFloat(formData.priceBaby),
        stockAdult: parseInt(formData.stockAdult),
        stockChildren: parseInt(formData.stockChildren),
        stockBaby: parseInt(formData.stockBaby),
        status: formData.status,
        createdBy: editDeparture ? undefined : userId,
        updatedBy: editDeparture ? userId : undefined
      };

      if (editDeparture) {
        await departureService.update(editDeparture.id, payload);
        alert("Cập nhật lịch khởi hành thành công!");
      } else {
        await departureService.create(payload);
        alert("Thêm lịch khởi hành mới thành công!");
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchData(); 
      
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleEdit = (departure) => {
    setEditDeparture(departure);
    setFormData({
      tourId: departure.tourId || "", 
      vehicleId: departure.vehicleId || "", 
      startTime: departure.startTime,
      departureFrom: departure.departureFrom || "", 
      priceAdult: departure.priceAdult,
      priceChildren: departure.priceChildren,
      priceBaby: departure.priceBaby,
      stockAdult: departure.stockAdult,
      stockChildren: departure.stockChildren,
      stockBaby: departure.stockBaby,
      status: departure.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy chuyến đi này không?`)) {
      try {
        const userId = getCurrentUserId();
        await departureService.delete(id, userId);
        alert("Đã hủy lịch khởi hành thành công");
        fetchData(); 
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleRestore = async (id) => {
    try {
      await departureService.restore(id);
      alert("Khôi phục lịch khởi hành thành công!");
      fetchData();
    } catch (error) {
      alert("Lỗi khôi phục: " + error.message);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Hành động này sẽ XÓA VĨNH VIỄN dữ liệu và không thể khôi phục. Bạn có chắc chắn?")) {
      try {
        await departureService.hardDelete(id);
        alert("Đã xóa vĩnh viễn!");
        fetchData();
      } catch (error) {
        alert("Lỗi xóa: " + error.message);
      }
    }
  };

  const getAccountName = (id) => {
    if (!id) return null;
    const account = accountList.find(acc => acc.id === id);
    return account ? account.fullName : null; 
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch khởi hành</h1>
          <p className="text-gray-500 mt-1">Quản lý chuyến đi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" title="Tải lại dữ liệu">
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          </button>
            <button onClick={openNewDialog} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium shadow-sm">
              <Plus className="w-4 h-4" /> Thêm lịch
            </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => setActiveTab("active")} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Lịch đang mở
          </button>
          <button 
            onClick={() => setActiveTab("trash")} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Thùng rác ({trashDepartures.length})
          </button>
        </div>

        <div className="p-6 pt-2">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span>Đang đồng bộ dữ liệu...</span>
            </div>
          ) : activeTab === "active" ? (
            <DepartureTable 
              departures={departures} 
              onView={handleViewDetail} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ) : (
            <DepartureTrashTable 
              departures={trashDepartures}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
              getAccountName={getAccountName}
            />
          )}
        </div>
      </div>

      <DepartureModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleSubmit}
        formData={formData} 
        setFormData={setFormData} 
        isEdit={!!editDeparture}
        vehicles={vehicles}
        tourList={tourList}
      />

      <DepartureDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        departure={selectedDeparture} 
        accountList={accountList}
      />
      
    </div>
  );
}