import { XCircle, Trash2 } from "lucide-react";

export function DiscountTable({ discounts, onDeactivate, onDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Mã code</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Giảm giá</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Giảm tối đa</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Số lượng</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24">Đã dùng</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Hạn sử dụng</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-32">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-24 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {discounts.map((discount) => {
            const isActive = discount.status === "active";
            const isExpired = discount.status === "expired" || new Date(discount.expiryDate) < new Date(new Date().setHours(0,0,0,0));
            const isFull = discount.used >= discount.quantity;

            // Xác định màu sắc cho Badge trạng thái
            let badgeStyle = "bg-gray-100 text-gray-700";
            let badgeText = "Vô hiệu";
            if (isExpired) {
              badgeStyle = "bg-red-100 text-red-700";
              badgeText = "Hết hạn";
            } else if (isFull) {
              badgeStyle = "bg-orange-100 text-orange-700";
              badgeText = "Hết lượt";
            } else if (isActive) {
              badgeStyle = "bg-green-100 text-green-700";
              badgeText = "Hoạt động";
            }

            return (
              <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-600">{discount.code}</td>
                <td className="py-3 px-4 text-sm font-medium">{discount.discountPercent}%</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {discount.maxDiscount > 0
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount.maxDiscount)
                    : "Không giới hạn"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{discount.quantity}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  <span className={isFull ? "text-orange-600 font-bold" : ""}>{discount.used}</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{discount.expiryDate}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}>
                    {badgeText}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    {isActive && !isExpired && (
                      <button 
                        onClick={() => onDeactivate(discount.id)} 
                        title="Vô hiệu hóa"
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(discount.id, discount.code)} 
                      title="Xóa"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
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