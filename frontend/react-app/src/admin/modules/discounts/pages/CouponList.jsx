import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Lock, Loader2 } from "lucide-react";
import { CouponTable } from "../components/CouponTable";
import { CouponTrashTable } from "../components/CouponTrashTable";
import { CouponModal } from "../components/DiscountModal";
import { couponService } from "../services/couponService";
import { accountService } from "../../users/services/accountService";
import { CouponDetailModal } from "../components/CouponDetailModal";

import Pagination from "../../../components/Pagination";
import { usePermission } from "../../../hooks/usePermission";

const initialFormState = {
  code: "", 
  discountPercentage: "",
  maxDiscountAmount: "",
  quantity: "",
  startDate: "", 
  endDate: "", 
  status: "active"
};

export default function CouponList() {
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("CREATE_COUPON");
  const canUpdate = hasPermission("UPDATE_COUPON");
  const canDelete = hasPermission("DELETE_COUPON");
  const canManageTrash = canDelete;

  const [coupons, setCoupons] = useState([]);
  const [deletedCoupons, setDeletedCoupons] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCoupon, setViewCoupon] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [data, trashData, accData] = await Promise.all([
        couponService.getAll().catch(() => []),
        canManageTrash ? couponService.getAllTrash().catch(() => []) : Promise.resolve([]),
        accountService.getAllActive().catch(() => [])
      ]);
      setCoupons(Array.isArray(data) ? data : []);
      setDeletedCoupons(Array.isArray(trashData) ? trashData : []);
      setAccountList(Array.isArray(accData) ? accData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [canManageTrash, activeTab]);

  const getAccountName = (id) => {
    if (!id) return null;
    const account = accountList.find(acc => String(acc.id) === String(id));
    return account ? account.fullName : null;
  };

  const filteredCoupons = coupons.filter(c => 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredDeletedCoupons = deletedCoupons.filter(c => 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentList = activeTab === "active" ? filteredCoupons : filteredDeletedCoupons;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = currentList.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = async () => {
    if (!formData.code || !formData.code.trim()) {
      alert("Vui lòng nhập mã code!");
      return;
    }

    try {
      if (editCoupon) {
        await couponService.update(editCoupon.id, formData);
        alert("Cập nhật mã giảm giá thành công!");
      } else {
        await couponService.create(formData);
        alert("Tạo mã giảm giá mới thành công!");
      }
      
      setIsDialogOpen(false);
      setFormData(initialFormState);
      setEditCoupon(null);
      fetchData(); 
    } catch (err) {
      alert("Lỗi khi lưu: " + err.message);
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData({
      ...coupon,
      startDate: coupon.startDate ? coupon.startDate.substring(0, 16) : "",
      endDate: coupon.endDate ? coupon.endDate.substring(0, 16) : ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Đưa mã giảm giá này vào thùng rác?")) {
      try {
        await couponService.delete(id);
        fetchData();
      } catch (err) { 
        alert("Lỗi: " + err.message); 
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await couponService.restore(id);
      fetchData();
    } catch (err) { 
      alert("Lỗi: " + err.message); 
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Hành động này không thể hoàn tác. Bạn chắc chắn chứ?")) {
      try {
        await couponService.hardDelete(id);
        fetchData();
      } catch (err) { 
        alert("Lỗi: " + err.message); 
      }
    }
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Mã giảm giá</h1>
        </div>
        <div className="flex gap-2">
          {activeTab === "active" && canCreate && (
            <button 
              onClick={() => { setFormData(initialFormState); setEditCoupon(null); setIsDialogOpen(true); }} 
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm mới
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden pb-4">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 m-6 mb-2">
          <button 
            onClick={() => setActiveTab("active")} 
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          > Đang hoạt động ({coupons.length})
          </button>
          
          <button 
            onClick={() => canManageTrash && setActiveTab("trash")}
            disabled={!canManageTrash}
            title={!canManageTrash ? "Cần quyền Xóa (DELETE_COUPON) để xem thùng rác" : ""}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              !canManageTrash ? "opacity-50 cursor-not-allowed text-gray-400" :
              activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!canManageTrash ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            Thùng rác {canManageTrash && `(${deletedCoupons.length})`}
          </button>
        </div>

        <div className="p-6 pt-2">
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeTab === "active" ? "Tìm kiếm mã code..." : "Tìm kiếm trong thùng rác..."} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all" 
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              Không thể tải dữ liệu: {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {activeTab === "active" ? (
                <CouponTable 
                  coupons={paginatedList} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                  onView={(coupon) => setViewCoupon(coupon)}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                />
              ) : (
                <CouponTrashTable 
                  coupons={paginatedList} 
                  onRestore={handleRestore} 
                  onPermanentDelete={handlePermanentDelete} 
                  getAccountName={getAccountName} 
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                />
              )}

              {totalPages > 0 && (
                <div className="mt-4">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <CouponModal 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleSubmit}
        formData={formData} 
        setFormData={setFormData} 
        isEdit={!!editCoupon} 
      />
      <CouponDetailModal
        isOpen={!!viewCoupon}
        coupon={viewCoupon}
        getAccountName={getAccountName}
        onClose={() => setViewCoupon(null)}
      />
    </div>
  );
}