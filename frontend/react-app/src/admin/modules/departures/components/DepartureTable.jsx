import { useState, useMemo, Fragment } from "react";
import { Edit, Trash2, ChevronDown, ChevronRight, CalendarDays, Eye, Bus, Plane, Train, Ship } from "lucide-react";

export function DepartureTable({ departures, onView, onEdit, onDelete }) {
  
  const renderVehicle = (type, name) => {
    if (!name) return <span className="text-gray-400 text-xs">—</span>;
    let Icon = Bus;
    if (type === "PLANE") Icon = Plane;
    if (type === "TRAIN") Icon = Train;
    if (type === "SHIP") Icon = Ship;
    return (
      <div className="flex items-center gap-1.5 text-blue-600 font-medium text-xs mt-1" title={name}>
        <Icon className="w-3.5 h-3.5" />
        <span className="truncate max-w-[150px]">{name}</span>
      </div>
    );
  };

  const groupedDepartures = useMemo(() => {
    return departures.reduce((acc, departure) => {
      const title = departure.tourTitle || "Tour chưa xác định";
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(departure);
      return acc;
    }, {});
  }, [departures]);

  const [expandedGroups, setExpandedGroups] = useState({});
  const toggleGroup = (title) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Tên Tour / Thông tin</th>
            {/* Đổi tên cột cho rõ nghĩa */}
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Khởi hành & Xe</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Giá NL</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Chỗ NL</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Chỗ TE/EB</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          
          {Object.entries(groupedDepartures).map(([tourTitle, tourDepartures]) => {
            const isExpanded = expandedGroups[tourTitle];
            return (
              <Fragment key={tourTitle}>
                <tr 
                  onClick={() => toggleGroup(tourTitle)}
                  className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <td colSpan={7} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </span>
                      <span className="font-bold text-gray-800 text-base">{tourTitle}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-white border border-gray-200 text-gray-600 ml-2">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {tourDepartures.length} lịch khởi hành
                      </span>
                    </div>
                  </td>
                </tr>
                {isExpanded && tourDepartures.map((departure) => {
                  const dateDisplay = departure.startTime ? new Date(departure.startTime).toLocaleString('vi-VN') : "N/A";
                  return (
                    <tr key={departure.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-500 pl-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2"></span>
                            Mã lịch: #{departure.id}
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900">{dateDisplay}</div>
                        {renderVehicle(departure.vehicleType, departure.vehicleName)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(departure.priceAdult)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{departure.stockAdult}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{departure.stockChildren} / {departure.stockBaby}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          departure.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {departure.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={(e) => { 
                                  e.stopPropagation(); 
                                  onView?.(departure);}} 
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="Xem chi tiết nhật ký">
                              <Eye className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); onEdit(departure); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Sửa lịch">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onDelete(departure.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa lịch">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
          
          {departures.length === 0 && (
            <tr>
              <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                Không có dữ liệu lịch khởi hành
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}