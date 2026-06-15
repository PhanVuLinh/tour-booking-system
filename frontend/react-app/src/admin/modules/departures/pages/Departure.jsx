import { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { DepartureTable } from "../components/DepartureTable";
import { DepartureModal } from "../components/DepartureModal";
import { DepartureDetailModal } from "../components/DepartureDetailModal"; 
import { departureService } from "../services/departureService";

const initialFormState = {
  tourId: "", startTime: "", priceAdult: "", priceChildren: "", priceBaby: "",
  stockAdult: "", stockChildren: "", stockBaby: "", status: "OPEN"
};

export default function DepartureList() {
  const [departures, setDepartures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDeparture, setEditDeparture] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const handleViewDetail = (departureData) => {
    setSelectedDeparture(departureData);
    setIsDetailModalOpen(true);
  };
  
  const fetchDepartures = async () => {
    try {
      setIsLoading(true);
      const data = await departureService.getAll();
      setDepartures(data);
    } catch (error) {
      alert("Không thể kết nối đến máy chủ: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartures();
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditDeparture(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        tourId: parseInt(formData.tourId),
        tourTitle: formData.tourTitle,
        startTime: formData.startTime,
        priceAdult: parseFloat(formData.priceAdult),
        priceChildren: parseFloat(formData.priceChildren),
        priceBaby: parseFloat(formData.priceBaby),
        stockAdult: parseInt(formData.stockAdult),
        stockChildren: parseInt(formData.stockChildren),
        stockBaby: parseInt(formData.stockBaby),
        status: formData.status
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
      fetchDepartures(); 
      
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleEdit = (departure) => {
    setEditDeparture(departure);
    setFormData({
      tourId: departure.tourId || "", 
      startTime: departure.startTime,
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
        await departureService.delete(id);
        alert("Đã hủy lịch khởi hành thành công");
        setDepartures(departures.filter(dep => dep.id !== id));
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch khởi hành</h1>
          <p className="text-gray-500 mt-1">Quản lý chuyến đi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchDepartures} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" title="Tải lại dữ liệu">
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openNewDialog} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" /> Thêm lịch
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Đang tải dữ liệu từ máy chủ...</div>
          ) : (
            <DepartureTable 
              departures={departures} 
              onView={handleViewDetail} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
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
      />

      <DepartureDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        departure={selectedDeparture} 
      />
    </div>
  );
}