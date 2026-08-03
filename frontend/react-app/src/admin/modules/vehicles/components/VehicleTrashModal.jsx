import { useEffect, useState } from "react";
import { X, RefreshCcw, Trash, AlertTriangle, Bus, Train, Plane, Ship, Calendar, UserX } from "lucide-react";
import { vehicleService } from "../services/vehicleService";
const VEHICLE_TYPE_MAP = {
  BUS: { label: "Xe ô tô / Khách", icon: Bus, color: "text-blue-600 bg-blue-50" },
  TRAIN: { label: "Tàu hỏa", icon: Train, color: "text-orange-600 bg-orange-50" },
  PLANE: { label: "Máy bay", icon: Plane, color: "text-sky-600 bg-sky-50" },
  SHIP: { label: "Tàu thủy", icon: Ship, color: "text-teal-600 bg-teal-50" },
};

export function VehicleTrashModal({ isOpen, onClose, onRestored }) {
  const [trashData, setTrashData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTrash();
    }
  }, [isOpen]);

  const loadTrash = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getTrash();
      setTrashData(data);
    } catch (error) {
      alert("Lỗi tải thùng rác: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await vehicleService.restore(id);
      loadTrash();
      onRestored(); 
    } catch (error) {
      alert("Lỗi khôi phục: " + error.message);
    }
  };

  const handleHardDelete = async (id) => {
    if (window.confirm("CẢNH BÁO: Xóa vĩnh viễn sẽ không thể khôi phục lại. Bạn có chắc chắn?")) {
      try {
        await vehicleService.hardDelete(id);
        loadTrash();
      } catch (error) {
        alert("Lỗi xóa vĩnh viễn: " + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : "—";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Đã mở rộng max-w-5xl để chứa được nhiều cột thông tin hơn */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
          <div>
            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Trash className="w-5 h-5" /> Thùng rác (Phương tiện đã xóa)
            </h2>
            <p className="text-xs text-red-500 font-medium mt-0.5">Dữ liệu tại đây có thể được khôi phục hoặc xóa vĩnh viễn khỏi hệ thống.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Đang tải dữ liệu thùng rác...</div>
          ) : trashData.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Trash className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-600">Thùng rác trống</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">ID</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Thông tin phương tiện</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Loại</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày tạo</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 border-l border-red-100 bg-red-50/30">Ngày xóa</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 bg-red-50/30">Người xóa</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trashData.map((v) => {
                  const typeInfo = VEHICLE_TYPE_MAP[v.vehicleType] || { label: v.vehicleType, icon: Bus, color: "text-gray-600 bg-gray-50" };
                  const TypeIcon = typeInfo.icon;
                  return (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">#{v.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{v.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${typeInfo.color}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {typeInfo.label}
                        </span>
                      </td>
                                            <td className="py-3 px-4 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(v.createdAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-red-600 font-medium border-l border-red-50 bg-red-50/10">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-red-400" />
                          {formatDate(v.deletedAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-700 bg-red-50/10">
                        <div className="flex items-center gap-1.5">
                          <UserX className="w-3.5 h-3.5 text-red-400" />
                          <span className="font-semibold">{v.deletedBy ? `Nhân viên #${v.deletedBy}` : "Hệ thống"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleRestore(v.id)} className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md flex items-center gap-1.5 transition-colors shadow-sm" title="Khôi phục lại dữ liệu này">
                            <RefreshCcw className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleHardDelete(v.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1.5 transition-colors shadow-sm" title="Xóa vĩnh viễn khỏi Database">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}