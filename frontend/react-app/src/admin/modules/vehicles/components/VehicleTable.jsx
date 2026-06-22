import { Edit, Trash2, Bus, Train, Plane, Ship } from "lucide-react";

const VEHICLE_TYPE_MAP = {
  BUS: { label: "Xe ô tô / Khách", icon: Bus, color: "text-blue-600 bg-blue-50" },
  TRAIN: { label: "Tàu hỏa", icon: Train, color: "text-orange-600 bg-orange-50" },
  PLANE: { label: "Máy bay", icon: Plane, color: "text-sky-600 bg-sky-50" },
  SHIP: { label: "Tàu thủy", icon: Ship, color: "text-teal-600 bg-teal-50" },
};

export function VehicleTable({ vehicles, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Tên phương tiện</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Loại phương tiện</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Ngày tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehicles.map((vehicle, index) => {
            const typeInfo = VEHICLE_TYPE_MAP[vehicle.vehicleType] || { label: vehicle.vehicleType, icon: Bus, color: "text-gray-600 bg-gray-50" };
            const TypeIcon = typeInfo.icon;
            const dateDisplay = vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString('vi-VN') : "N/A";

            return (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-gray-500">{index+1}</td>
                <td className="py-3 px-4 font-bold text-gray-900">{vehicle.name}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${typeInfo.color}`}>
                    <TypeIcon className="w-3.5 h-3.5" />
                    {typeInfo.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{dateDisplay}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onEdit(vehicle)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(vehicle.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          
          {vehicles.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">
                Không có dữ liệu phương tiện
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}