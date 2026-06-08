import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { CustomerTable, EmployeeTable } from "../components/UserTable";

const mockCustomers = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0912345678", totalBookings: 5, totalSpent: 25000000, status: "active", role: "customer", joinedDate: "2025-03-15" },
  { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0923456789", totalBookings: 3, totalSpent: 15000000, status: "active", role: "customer", joinedDate: "2025-06-20" },
];

const mockEmployees = [
  { id: 1, name: "Lê Văn C", email: "levanc@tourcompany.com", phone: "0934567890", role: "employee", department: "Bộ phận hỗ trợ", status: "active", joinedDate: "2024-01-10" },
  { id: 2, name: "Phạm Thị D", email: "phamthid@tourcompany.com", phone: "0945678901", role: "employee", department: "Bộ phận kinh doanh", status: "blocked", joinedDate: "2024-03-20" },
];

// Giả lập role của user đang đăng nhập
const currentUserRole = "admin"; // Đổi thành "employee" để test ẩn tab Nhân viên

export default function UserManagement() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [employees, setEmployees] = useState(mockEmployees);
  const [customerSearch, setCustomerSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [activeTab, setActiveTab] = useState("customers");

  // State Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "", email: "", phone: "", password: "", department: "",
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    employee.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    employee.phone.includes(employeeSearch)
  );

  // Gộp hàm Khóa và Mở khóa làm một, dùng window.confirm thay cho AlertDialog
  const handleToggleLock = (id, userType, currentStatus) => {
    const action = currentStatus === "active" ? "khóa" : "mở khóa";
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này không?`)) return;

    const newStatus = currentStatus === "active" ? "blocked" : "active";

    if (userType === "customer") {
      setCustomers(customers.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } else {
      setEmployees(employees.map(e => e.id === id ? { ...e, status: newStatus } : e));
    }
    alert(`Đã ${action} tài khoản thành công!`);
  };

  const viewDetail = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleCreateEmployee = () => {
    if (!employeeFormData.name || !employeeFormData.email || !employeeFormData.password) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    setEmployees([...employees, {
      id: Date.now(),
      ...employeeFormData,
      role: "employee",
      status: "active",
      joinedDate: new Date().toISOString().split('T')[0],
    }]);

    alert("Đã tạo tài khoản nhân viên thành công!");
    setIsEmployeeFormOpen(false);
    setEmployeeFormData({ name: "", email: "", phone: "", password: "", department: "" });
  };

  return (
    <div className="p-8 w-full relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
          <p className="text-gray-500 mt-1">Quản lý tài khoản khách hàng và nhân viên hệ thống</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6">
        
        {/* TABS (Chỉ hiện tab nếu là admin) */}
        {currentUserRole === "admin" && (
          <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab("customers")}
              className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
                activeTab === "customers" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Khách hàng ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
                activeTab === "employees" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Nhân viên ({employees.length})
            </button>
          </div>
        )}

        {/* NỘI DUNG TABS */}
        {activeTab === "customers" || currentUserRole !== "admin" ? (
          <div className="animate-in fade-in duration-300">
            <div className="relative max-w-sm mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên, email hoặc SĐT..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
              />
            </div>
            <CustomerTable data={filteredCustomers} onView={viewDetail} onToggleLock={handleToggleLock} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
                />
              </div>
              <button 
                onClick={() => setIsEmployeeFormOpen(true)}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tạo tài khoản nhân viên
              </button>
            </div>
            <EmployeeTable data={filteredEmployees} onView={viewDetail} onToggleLock={handleToggleLock} />
          </div>
        )}
      </div>

      {/* 1. MODAL: XEM CHI TIẾT TÀI KHOẢN */}
      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Chi tiết tài khoản</h2>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-medium text-gray-900">{selectedUser.phone || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                {selectedUser.role === "customer" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tổng đơn đặt</p>
                      <p className="font-medium text-gray-900">{selectedUser.totalBookings} đơn</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tổng chi tiêu</p>
                      <p className="font-bold text-green-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedUser.totalSpent)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bộ phận</p>
                    <p className="font-medium text-gray-900">{selectedUser.department || "—"}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{selectedUser.role === "customer" ? "Ngày tham gia" : "Ngày vào làm"}</p>
                  <p className="font-medium text-gray-900">{selectedUser.joinedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {selectedUser.status === "active" ? "Hoạt động" : "Đã khóa"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: TẠO TÀI KHOẢN NHÂN VIÊN */}
      {isEmployeeFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Tạo tài khoản nhân viên</h2>
                <p className="text-xs text-gray-500 mt-1">Cấp quyền truy cập hệ thống cho nhân sự mới</p>
              </div>
              <button onClick={() => setIsEmployeeFormOpen(false)} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                <input type="text" value={employeeFormData.name} onChange={(e) => setEmployeeFormData({ ...employeeFormData, name: e.target.value })} placeholder="Nguyễn Văn A" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email đăng nhập <span className="text-red-500">*</span></label>
                <input type="email" value={employeeFormData.email} onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })} placeholder="employee@tourcompany.com" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu <span className="text-red-500">*</span></label>
                  <input type="password" value={employeeFormData.password} onChange={(e) => setEmployeeFormData({ ...employeeFormData, password: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input type="text" value={employeeFormData.phone} onChange={(e) => setEmployeeFormData({ ...employeeFormData, phone: e.target.value })} placeholder="0912..." className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                <select value={employeeFormData.department} onChange={(e) => setEmployeeFormData({ ...employeeFormData, department: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none">
                  <option value="" disabled>Chọn bộ phận...</option>
                  <option value="Bộ phận hỗ trợ">Bộ phận hỗ trợ</option>
                  <option value="Bộ phận kinh doanh">Bộ phận kinh doanh</option>
                  <option value="Bộ phận marketing">Bộ phận marketing</option>
                  <option value="Bộ phận kế toán">Bộ phận kế toán</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setIsEmployeeFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button onClick={handleCreateEmployee} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}