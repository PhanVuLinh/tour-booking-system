import { Edit, Trash2 } from "lucide-react";

export function DepartureTable({ departures, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Tour ID</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Khởi hành</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Giá NL</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Chỗ NL</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Chỗ TE/EB</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {departures.map((departure) => {
            // Spring Boot trả về Tour dưới dạng Object (departure.tourId.id)
            const tourIdDisplay = departure.tourId ? departure.tourId.id : "N/A";
            const dateDisplay = departure.startTime ? new Date(departure.startTime).toLocaleString('vi-VN') : "N/A";

            return (
              <tr key={departure.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-bold text-blue-600">#{tourIdDisplay}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{dateDisplay}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
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
                    <button onClick={() => onEdit(departure)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(departure.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}