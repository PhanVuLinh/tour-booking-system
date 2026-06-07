import { Edit, Trash2 } from "lucide-react";

export function DepartureTable({ departures, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Ngày khởi hành</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Phương tiện</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Số chỗ</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Giá vé</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {departures.map((departure) => {
            const availableSeats = departure.seats - departure.bookedSeats;
            const isFull = availableSeats === 0;

            return (
              <tr key={departure.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{departure.tourName}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{departure.departureDate}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{departure.vehicle}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{departure.bookedSeats}</span>/{departure.seats}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(departure.price)}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isFull ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {isFull ? "Hết chỗ" : `Còn ${availableSeats} chỗ`}
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