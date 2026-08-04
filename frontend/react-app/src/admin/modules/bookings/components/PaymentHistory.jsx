import React from "react";
import { CheckCircle } from "lucide-react";
import { getPaymentStatusBadge } from "./BookingTable";

export const PaymentHistory = ({ payments, formatCurrency, formatDate, onConfirmPayment }) => {
  if (!payments || payments.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Lịch sử thanh toán</h3>
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 font-medium text-gray-600 border-b border-gray-100">
            <tr>
              <th className="p-3">Mã GD</th>
              <th className="p-3">Phương thức</th>
              <th className="p-3 text-right">Số tiền</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3">Ngày thanh toán</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((pm) => (
              <tr key={pm.id}>
                <td className="p-3 font-mono text-xs ">{pm.transactionId || "không có"}</td>
                <td className="p-3">
                  <div className="text-center" >{pm.paymentMethod}</div>
                  <div className="text-xs text-gray-500 text-center">{pm.paymentType} %</div>
                </td>
                <td className="p-3 text-right font-medium">{formatCurrency(pm.amount)}</td>
                <td className="p-3 text-center">
                  {getPaymentStatusBadge(pm.paymentStatus)}
                </td>
                <td className="p-3 text-gray-600">
                  {pm.paidAt ? formatDate(pm.paidAt) : "Chưa thanh toán"}
                </td>
                <td className="p-3 text-center">
                  {pm.paymentStatus === "pending" && onConfirmPayment && (
                    <button
                      onClick={() => onConfirmPayment(pm.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                      title="Xác nhận đã nhận tiền"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Xác nhận
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};