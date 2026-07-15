import { useState, useEffect, useMemo } from "react";
import { Plus, Lock, RefreshCw } from "lucide-react"; 
import { DepartureTable, DepartureTrashTable } from "../components/DepartureTable";
import { DepartureModal } from "../components/DepartureModal";
import { DepartureDetailModal } from "../components/DepartureDetailModal"; 
import { departureService } from "../services/departureService";
import { vehicleService } from "../../vehicles/services/vehicleService"; 
import { tourService } from "../../tours/services/tourService";
import { accountService } from "../../users/services/accountService"; 

const initialFormState = {
  tourId: "", vehicleId: "", guideId: "", startTime: "", departureFrom: "", 
  priceAdult: "", priceChildren: "", priceBaby: "",
  stockAdult: "", stockChildren: "", stockBaby: "", status: "OPEN"
};

const getCurrentUserId = () => {
  const id = localStorage.getItem("userId"); 
  return id ? parseInt(id) : null;
};

export default function DepartureList() {
  const isAdmin = useMemo(() => {
    const userString = localStorage.getItem("user");
    if (!userString) return false;
    
    try {
      const user = JSON.parse(userString);
      return user.role && String(user.role).toLowerCase() === "admin";
    } catch (e) {
      return false;
    }
  }, []);

  const [departures, setDepartures] = useState([]);
  const [trashDepartures, setTrashDepartures] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [vehicles, setVehicles] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
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
      setError(null);
      const [depData, trashData, vehData, tourData, accData] = await Promise.all([
        departureService.getAll(),
        isAdmin ? departureService.getAllTrash().catch(() => []) : Promise.resolve([]), 
        vehicleService.getAll(),
        tourService.getAll(),
        accountService.getAllActive().catch(() => [])
      ]);
      
      setDepartures(depData);
      setTrashDepartures(trashData);
      setVehicles(vehData);
      setTourList(tourData);
      setAccountList(accData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin, activeTab]);

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
        guideId: formData.guideId ? parseInt(formData.guideId) : null,
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
        alert("Cập nhật thành công!");
      } else {
        await departureService.create(payload);
        alert("Thêm mới thành công!");
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
      guideId: departure.guideId || "",
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
    if (window.confirm("Bạn có chắc chắn muốn hủy chuyến đi này?")) {
      try {
        await departureService.delete(id);
        alert("Đã hủy thành công");
        fetchData(); 
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await departureService.restore(id);
      alert("Khôi phục thành công!");
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Xóa vĩnh viễn không thể khôi phục. Bạn có chắc chắn?")) {
      try {
        await departureService.hardDelete(id);
        alert("Đã xóa vĩnh viễn!");
        fetchData();
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  const getAccountName = (id) => {
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
          <button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Thêm lịch
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => setActiveTab("active")} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Lịch đang mở
          </button>
          <button 
            onClick={() => isAdmin && setActiveTab("trash")} 
            disabled={!isAdmin}
            title={!isAdmin ? "Cần quyền Admin để xem Thùng rác" : ""}
            className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all ${
              !isAdmin ? "opacity-50 cursor-not-allowed text-gray-400" : activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!isAdmin && <Lock className="w-3.5 h-3.5" />}
            Thùng rác {isAdmin && `(${trashDepartures.length})`}
          </button>
        </div>

        {/* Cấu trúc wrapper cho bảng: Giữ nguyên min-h-64 để tránh co giật giao diện */}
        <div className="p-6 pt-2 min-h-[300px] flex flex-col justify-start">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-2">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-900" />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <p className="text-red-500 font-medium mb-1">Không thể tải dữ liệu</p>
              <p className="text-gray-400 text-xs">{error}</p>
            </div>
          ) : activeTab === "active" ? (
            <DepartureTable departures={departures} onView={handleViewDetail} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <DepartureTrashTable departures={trashDepartures} onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} getAccountName={getAccountName} />
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
        editDepartureId={editDeparture ? editDeparture.id : null}
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