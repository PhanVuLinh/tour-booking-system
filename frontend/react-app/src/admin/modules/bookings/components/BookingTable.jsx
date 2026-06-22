// src/components/bookings/BookingTable.jsx
import { CheckCircle, XCircle, Eye } from "lucide-react";

export const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">Chờ thanh toán</span>;
    case "confirmed":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Đã xác nhận</span>;
    case "cancelled":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Đã hủy</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
  }
};

export function BookingTable({ data, onView, onConfirm, onCancel }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[950px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Mã đơn</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Số lượng vé</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tổng tiền</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày đặt</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((booking) => {
            // Gom chuỗi hiển thị số lượng khách
            const guests = [];
            if (booking.quantityAdult > 0) guests.push(`${booking.quantityAdult}L`);
            if (booking.quantityChildren > 0) guests.push(`${booking.quantityChildren}TE`);
            if (booking.quantityBaby > 0) guests.push(`${booking.quantityBaby}EB`);

            return (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-mono text-sm font-medium text-gray-900">{booking.bookingCode}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{booking.customerName}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{booking.tourName}</td>
                <td className="py-3 px-4 text-sm text-gray-700 font-medium">{guests.join(" - ")}</td>
                <td className="py-3 px-4 text-sm font-semibold text-blue-600">{formatCurrency(booking.total)}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{booking.createdAt}</td>
                <td className="py-3 px-4">{getStatusBadge(booking.status)}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onView(booking)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors" title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </button>
                    {booking.status === "pending" && (
                      <>
                        <button onClick={() => onConfirm(booking.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Xác nhận thanh toán">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancel(booking.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hủy đơn đặt">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr><td colSpan={8} className="py-10 text-center text-gray-400 text-sm">Không có đơn đặt nào</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}