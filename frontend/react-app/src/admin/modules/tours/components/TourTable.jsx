import { Link } from "react-router-dom";
import { Edit, Trash2, Eye, RotateCcw } from "lucide-react";

export function TourTable({ tours, onView, onDelete }) {
  return (
    <div className="w-full max-w-full bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-24">Hình ảnh</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-auto">Tên Tour</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-40">Danh mục</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-32">Giá</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-28">Trạng thái</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-32">Ngày tạo</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-32 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <img src={tour.image} alt={tour.name} className="w-16 h-12 rounded-lg object-cover" />
                </td>
                <td className="py-3 px-4 font-medium text-gray-900 truncate">{tour.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600 truncate">{tour.category}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    tour.status === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {tour.status === "active" ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{tour.createdAt}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onView(tour)} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors" title="Xem chi tiết">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <Link to={`/admin/tours/${tour.id}/edit`} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Link>
                    <button onClick={() => onDelete(tour.id)} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TourTrashTable({ tours, onRestore, onPermanentDelete }) {
  return (
    <div className="w-full max-w-full bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-24">Hình ảnh</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-auto">Tên Tour</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-40">Người xóa</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-40">Thời gian xóa</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <img src={tour.image} alt={tour.name} className="w-16 h-12 rounded-lg object-cover opacity-50" />
                </td>
                <td className="py-3 px-4 font-medium text-gray-500 truncate">{tour.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600 truncate">{tour.deletedBy}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{tour.deletedAt}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onRestore(tour.id)} title="Khôi phục" className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-green-50 transition-colors">
                      <RotateCcw className="w-4 h-4 text-green-600" />
                    </button>
                    <button onClick={() => onPermanentDelete(tour.id)} title="Xóa vĩnh viễn" className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}