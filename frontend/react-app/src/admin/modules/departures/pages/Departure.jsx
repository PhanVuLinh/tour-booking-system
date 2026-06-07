import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { DepartureTable } from "../components/DepartureTable";
import { DepartureModal } from "../components/DepartureModal";

const mockDepartures = [
  { id: 1, tourName: "Hạ Long 3N2Đ", departureDate: "2026-06-15", vehicle: "Xe khách", seats: 40, bookedSeats: 25, price: 5000000 },
  { id: 2, tourName: "Phú Quốc 4N3Đ", departureDate: "2026-06-20", vehicle: "Máy bay", seats: 30, bookedSeats: 30, price: 8000000 },
  { id: 3, tourName: "Sapa 2N1Đ", departureDate: "2026-07-05", vehicle: "Xe khách", seats: 35, bookedSeats: 12, price: 3000000 },
];

export default function DepartureList() {
  const [departures, setDepartures] = useState(mockDepartures);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDeparture, setEditDeparture] = useState(null);
  const [formData, setFormData] = useState({
    tourName: "", departureDate: "", vehicle: "", seats: "", price: "",
  });

  const filteredDepartures = departures.filter(departure =>
    departure.tourName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ tourName: "", departureDate: "", vehicle: "", seats: "", price: "" });
    setEditDeparture(null);
  };

  const handleSubmit = () => {
    if (!formData.tourName || !formData.departureDate || !formData.seats || !formData.price) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.departureDate);
    
    if (selectedDate <= today) {
      alert("Ngày khởi hành phải lớn hơn ngày hiện tại!");
      return;
    }

    if (editDeparture) {
      setDepartures(departures.map(dep =>
        dep.id === editDeparture.id
          ? { ...dep, ...formData, seats: parseInt(formData.seats), price: parseInt(formData.price) }
          : dep
      ));
      alert("Cập nhật lịch khởi hành thành công!");
    } else {
      setDepartures([...departures, {
        id: Date.now(), ...formData, seats: parseInt(formData.seats), price: parseInt(formData.price), bookedSeats: 0,
      }]);
      alert("Thêm lịch khởi hành mới thành công!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (departure) => {
    setEditDeparture(departure);
    setFormData({
      tourName: departure.tourName, departureDate: departure.departureDate,
      vehicle: departure.vehicle, seats: departure.seats.toString(), price: departure.price.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const departure = departures.find(d => d.id === id);
    if (departure && departure.bookedSeats > 0) return alert("Không thể xóa chuyến đi đã có khách đặt vé!");

    if (window.confirm(`Bạn có chắc chắn muốn hủy chuyến đi "${departure?.tourName}" không?`)) {
      setDepartures(departures.filter(dep => dep.id !== id));
      alert(`Đã hủy lịch khởi hành "${departure?.tourName}"`);
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
          <p className="text-gray-500 mt-1">Quản lý các chuyến đi và lịch khởi hành</p>
        </div>
        <button onClick={openNewDialog} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" /> Thêm lịch khởi hành
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="p-6">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <DepartureTable departures={filteredDepartures} onEdit={handleEdit} onDelete={handleDelete} />
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
    </div>
  );
}