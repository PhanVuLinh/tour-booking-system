import { Edit, Trash2, RotateCcw, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export function TourTable({ tours, onView, onDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">Ảnh</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Tên Tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Danh mục</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Giá</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tours.map((tour, index) => (
            <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-4">
                <img src={tour.image} alt="tour" className="w-10 h-10 rounded-md object-cover border" />
              </td>
              <td className="py-3 px-4 font-medium text-gray-900">{tour.name}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{tour.category}</td>
              <td className="py-3 px-4 text-sm font-medium text-blue-600">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onView(tour)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors" title="Xem chi tiết">
                    <Eye className="w-4 h-4" />
                  </button>
                  {/* Dẫn sang trang Edit (Sửa Tour) */}
                  <Link to={`/admin/tours/edit/${tour.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Chỉnh sửa">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => onDelete(tour.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Chuyển vào thùng rác">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TourTrashTable({ tours, onRestore, onPermanentDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-16">STT</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-48">Tên Tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Danh mục</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-auto">Người xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-40">Thời gian xóa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tours.map((tour, index) => (
            <tr key={tour.id} className="hover:bg-gray-50 transition-colors opacity-75">
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-4 font-medium text-gray-500">{tour.name}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{tour.category}</td>
              
              {/* HIỂN THỊ DẤU VẾT HỆ THỐNG */}
              <td className="py-3 px-4 text-sm text-red-500 font-medium">
                {tour.deletedBy ? `Account #${tour.deletedBy}` : "Hệ thống"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {tour.deletedAt ? new Date(tour.deletedAt).toLocaleString('vi-VN') : "—"}
              </td>
              
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onRestore(tour.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Khôi phục">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={() => onPermanentDelete(tour.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa vĩnh viễn">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}