import { Eye, Lock, Unlock } from "lucide-react";

export function CustomerTable({ data, onView, onToggleLock }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Liên hệ</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tổng đơn</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tổng chi tiêu</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày tham gia</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-gray-900">{customer.name}</td>
              <td className="py-3 px-4 text-sm">
                <div className="text-gray-900">{customer.email}</div>
                <div className="text-gray-500 mt-0.5">{customer.phone}</div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                <span className="font-medium text-gray-900">{customer.totalBookings}</span> đơn
              </td>
              <td className="py-3 px-4 text-sm font-medium text-green-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{customer.joinedDate}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  customer.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {customer.status === "active" ? "Hoạt động" : "Đã khóa"}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onView(customer)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="Xem chi tiết">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onToggleLock(customer.id, "customer", customer.status)} 
                    className={`p-2 rounded-md transition-colors ${customer.status === "active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                    title={customer.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  >
                    {customer.status === "active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
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

export function EmployeeTable({ data, onView, onToggleLock }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nhân viên</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Liên hệ</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Bộ phận</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày vào làm</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-gray-900">{employee.name}</td>
              <td className="py-3 px-4 text-sm">
                <div className="text-gray-900">{employee.email}</div>
                <div className="text-gray-500 mt-0.5">{employee.phone}</div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{employee.department || "—"}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{employee.joinedDate}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  employee.status === "active" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                }`}>
                  {employee.status === "active" ? "Hoạt động" : "Đã khóa"}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onView(employee)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="Xem chi tiết">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onToggleLock(employee.id, "employee", employee.status)} 
                    className={`p-2 rounded-md transition-colors ${employee.status === "active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                    title={employee.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  >
                    {employee.status === "active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
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