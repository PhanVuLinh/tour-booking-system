import { useState, useEffect } from "react";
import { Plus, Search, Lock } from "lucide-react";
import { CustomerTable } from "../components/UserTable";
import { EmployeeTable } from "../components/AccountTable";
import { TrashTable } from "../components/TrashTable";
import { UserDetailModal } from "../components/UserDetailModal";
import { EmployeeFormModal } from "../components/EmployeeFormModal";
import { accountService } from "../services/accountService";
import { userService } from "../services/userService";
import { roleService } from "../services/roleService";
import { apiClient } from "../../login/services/authService";

export default function UserManagement() {

  const [currentUserRole, setCurrentUserRole] = useState(null);
  const isAdmin = (currentUserRole || "").toLowerCase() === "admin";

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const defaultEmployeeForm = {
    fullName: "", email: "", phone: "", password: "", jobTitle: "", roleId: null, status: "active"
  };
  const [employeeFormData, setEmployeeFormData] = useState(defaultEmployeeForm);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllActive();
      setCustomers(data);
    } catch (error) {
      alert(error.message || "Lỗi tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAllActive();
      setEmployees(data);
    } catch (error) {
      alert(error.message || "Lỗi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const loadTrash = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAllTrash();
      setTrashItems(data);
    } catch (error) {
      alert(error.message || "Lỗi tải thùng rác");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await roleService.getAll();
      setRoles(data);
      const defaultRole =
        data.find((r) => r.name.toLowerCase() !== "admin") || data[0];
      if (defaultRole) {
        setEmployeeFormData((prev) => ({ ...prev, roleId: defaultRole.id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await apiClient.get("/admin/auth/me");
        setCurrentUserRole(res.data.role);
      } catch (error) {
        setCurrentUserRole(null);
      }
    };
    loadCurrentUser();
    loadCustomers();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadEmployees();
      loadRoles();
    } else {
      setActiveTab("customers");
    }
  }, [isAdmin]);

  useEffect(() => {
    if (activeTab === "trash") {
      loadTrash();
    }
  }, [activeTab]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.phone && customer.phone.includes(customerSearch))
  );

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    employee.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    (employee.phone && employee.phone.includes(employeeSearch))
  );

  const handleToggleLock = async (id, userType, currentStatus) => {
    const action = currentStatus === "active" ? "khóa" : "mở khóa";
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này không?`)) return;

    const newStatus = currentStatus === "active" ? "inactive" : "active";

    if (userType === "customer") {
      try {
        const user = await userService.getById(id);
        const payload = {
          fullName: user.name,
          email: user.email,
          phone: user.phone || "",
          status: newStatus,
          password: ""
        };
        await userService.update(id, payload);
        loadCustomers();
        alert(`Đã ${action} tài khoản khách hàng thành công!`);
      } catch (error) {
        alert(error.message || `Lỗi khi ${action} tài khoản`);
      }
    } else {
      try {
        const account = await accountService.getById(id);
        const payload = {
          fullName: account.fullName,
          email: account.email,
          phone: account.phone || "",
          jobTitle: account.jobTitle || "",
          roleId: account.roleId,
          status: newStatus,
          password: ""
        };
        await accountService.update(id, payload);
        loadEmployees();
        alert(`Đã ${action} tài khoản nhân viên thành công!`);
      } catch (error) {
        alert(error.message || `Lỗi khi ${action} tài khoản`);
      }
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEmployeeFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone || "",
      password: "",
      jobTitle: employee.jobTitle || "",
      roleId: employee.roleId,
      status: employee.status || "active"
    });
    setIsEditMode(true);
    setIsEmployeeFormOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!employeeFormData.fullName || !employeeFormData.email) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const payload = {
        fullName: employeeFormData.fullName,
        email: employeeFormData.email,
        phone: employeeFormData.phone || "",
        jobTitle: employeeFormData.jobTitle || "",
        roleId: Number(employeeFormData.roleId),
        status: employeeFormData.status || "active",
        password: employeeFormData.password || "" // không đổi mật khẩu
      };
      await accountService.update(editingEmployee.id, payload);
      alert("Cập nhật nhân viên thành công!");
      setIsEmployeeFormOpen(false);
      setIsEditMode(false);
      setEditingEmployee(null);
      setEmployeeFormData(defaultEmployeeForm);
      loadEmployees();
      loadTrash();
    } catch (error) {
      alert(error.message || "Cập nhật thất bại");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Đưa nhân viên này vào thùng rác?")) return;
    try {
      await accountService.softDelete(id);
      loadEmployees();
      alert("Đã chuyển nhân viên vào thùng rác!");
    } catch (error) {
      alert(error.message || "Lỗi xóa nhân viên");
    }
  };

  const handleRestoreEmployee = async (id) => {
    if (!window.confirm("Khôi phục nhân viên này?")) return;
    try {
      await accountService.restore(id);
      await loadTrash();
      await loadEmployees();
      alert("Khôi phục nhân viên thành công!");
    } catch (error) {
      alert(error.message || "Khôi phục thất bại");
    }
  };

  const handleForceDeleteEmployee = async (id) => {
    if (!window.confirm("Xóa vĩnh viễn nhân viên này? Hành động không thể hoàn tác!")) return;
    try {
      await accountService.hardDelete(id);
      await loadTrash();
      alert("Đã xóa vĩnh viễn nhân viên!");
    } catch (error) {
      alert(error.message || "Xóa vĩnh viễn thất bại");
    }
  };

  const viewDetail = (user, type) => {
    setSelectedUser({ ...user, role: type });
    setIsDetailOpen(true);
  };

  const handleCreateEmployee = async () => {
    if (!employeeFormData.fullName || !employeeFormData.email || !employeeFormData.password) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    try {
      await accountService.create({
        fullName: employeeFormData.fullName,
        email: employeeFormData.email,
        password: employeeFormData.password,
        phone: employeeFormData.phone,
        jobTitle: employeeFormData.jobTitle,
        roleId: Number(employeeFormData.roleId),
        status: "active"
      });

      alert("Đã tạo tài khoản nhân viên thành công!");
      setIsEmployeeFormOpen(false);
      setEmployeeFormData(defaultEmployeeForm);
      loadEmployees();
      loadRoles();
    } catch (error) {
      alert(error.message || "Tạo tài khoản thất bại");
    }
  };

  return (
    <div className="p-8 w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
          <p className="text-gray-500 mt-1">Quản lý tài khoản khách hàng và nhân viên hệ thống</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6">
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
            onClick={() => isAdmin && setActiveTab("employees")}
            disabled={!isAdmin}
            className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              !isAdmin
                ? "opacity-50 cursor-not-allowed"
                : activeTab === "employees"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!isAdmin && <Lock className="w-3.5 h-3.5" />}
            Nhân viên {isAdmin && `(${employees.length})`}
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab("trash")}
              className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
                activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Thùng rác ({trashItems.length})
            </button>
          )}
        </div>

        {activeTab === "customers" ? (
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
            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải dữ liệu khách hàng...</div>
            ) : (
              <CustomerTable
                data={filteredCustomers}
                onView={(user) => viewDetail(user, 'customer')}
                onToggleLock={handleToggleLock}
              />
            )}
          </div>
        ) : activeTab === "employees" ? (
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
                onClick={() => {
                  setIsEditMode(false);
                  setEditingEmployee(null);
                  setEmployeeFormData(defaultEmployeeForm);
                  setIsEmployeeFormOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tạo tài khoản nhân viên
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải dữ liệu nhân viên...</div>
            ) : (
              <EmployeeTable
                data={filteredEmployees}
                onView={(user) => viewDetail(user, 'employee')}
                onToggleLock={handleToggleLock}
                onDelete={handleDeleteEmployee}
                onEdit={handleEditEmployee}
              />
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải thùng rác...</div>
            ) : (
              <TrashTable
                data={trashItems}
                onRestore={handleRestoreEmployee}
                onForceDelete={handleForceDeleteEmployee}
              />
            )}
          </div>
        )}
      </div>

      <UserDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
        onEdit={(user) => {
          if (user.role === "employee") {
            setIsDetailOpen(false);
            handleEditEmployee(user);
          }
        }}
      />

      <EmployeeFormModal
        isOpen={isEmployeeFormOpen}
        onClose={() => {
          setIsEmployeeFormOpen(false);
          setIsEditMode(false);
          setEditingEmployee(null);
          setEmployeeFormData(defaultEmployeeForm);
        }}
        formData={employeeFormData}
        setFormData={setEmployeeFormData}
        onSubmit={isEditMode ? handleUpdateEmployee : handleCreateEmployee}
        roles={roles}
        isEdit={isEditMode}
        loading={false}
      />
    </div>
  );
}