import { Edit, Trash2, RotateCcw, Bus, Plane, Train, Ship, Car } from "lucide-react";

export const VEHICLE_TYPES = {
  "Xe khách":   { label: "Xe khách",  icon: Bus,   color: "bg-blue-50 text-blue-600" },
  "Máy bay":    { label: "Máy bay",   icon: Plane, color: "bg-sky-50 text-sky-600" },
  "Tàu hỏa":    { label: "Tàu hỏa",  icon: Train, color: "bg-orange-50 text-orange-600" },
  "Tàu thủy":   { label: "Tàu thủy", icon: Ship,  color: "bg-teal-50 text-teal-600" },
  "Xe hơi":     { label: "Xe hơi",   icon: Car,   color: "bg-purple-50 text-purple-600" },
};

export const TypeBadge = ({ type }) => {
  const config = VEHICLE_TYPES[type];
  if (!config) return <span className="text-sm text-gray-500">{type}</span>;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export function ActiveVehicleTable({ vehicles, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-64">Tên phương tiện</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Loại</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Người tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Ngày tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehicles.map((vehicle, index) => (
            <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-4 font-medium text-gray-900">{vehicle.name}</td>
              <td className="py-3 px-4"><TypeBadge type={vehicle.vehicleType} /></td>
              <td className="py-3 px-4 text-sm text-gray-600">{vehicle.createdBy}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{vehicle.createdAt}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(vehicle)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Chỉnh sửa">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(vehicle.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Chuyển vào thùng rác">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">Không tìm thấy phương tiện nào</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TrashVehicleTable({ vehicles, onRestore, onPermanentDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-64">Tên phương tiện</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Loại</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Người xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Thời gian xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors opacity-75">
              <td className="py-3 px-4 font-medium text-gray-500">{vehicle.name}</td>
              <td className="py-3 px-4"><TypeBadge type={vehicle.vehicleType} /></td>
              <td className="py-3 px-4 text-sm text-red-500 font-medium">{vehicle.deletedBy}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{vehicle.deletedAt}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onRestore(vehicle.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Khôi phục">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={() => onPermanentDelete(vehicle.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa vĩnh viễn">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr><td colSpan={5} className="py-10 text-center text-gray-400 text-sm">Thùng rác trống</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}