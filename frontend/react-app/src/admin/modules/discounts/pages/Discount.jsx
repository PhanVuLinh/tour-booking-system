import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { DiscountTable } from "../components/DiscountTable";
import { DiscountModal } from "../components/DiscountModal";

const mockDiscounts = [
  { id: 1, code: "SUMMER2026", discountPercent: 15, maxDiscount: 1000000, quantity: 100, used: 45, expiryDate: "2026-08-31", status: "active" },
  { id: 2, code: "WELCOME10", discountPercent: 10, maxDiscount: 500000, quantity: 200, used: 178, expiryDate: "2026-12-31", status: "active" },
  { id: 3, code: "SPRING2026", discountPercent: 20, maxDiscount: 2000000, quantity: 50, used: 50, expiryDate: "2026-05-31", status: "expired" },
];

export default function Discount() {
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "", discountPercent: "", maxDiscount: "", quantity: "", expiryDate: "",
  });

  const filteredDiscounts = discounts.filter(discount =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ code: "", discountPercent: "", maxDiscount: "", quantity: "", expiryDate: "" });
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.discountPercent || !formData.quantity || !formData.expiryDate) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    // Kiểm tra xem mã code đã tồn tại chưa
    if (discounts.some(d => d.code === formData.code)) {
      alert("Mã code này đã tồn tại, vui lòng nhập mã khác!");
      return;
    }

    setDiscounts([...discounts, {
      id: Date.now(),
      ...formData,
      discountPercent: parseInt(formData.discountPercent),
      maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) : 0,
      quantity: parseInt(formData.quantity),
      used: 0,
      status: "active",
    }]);

    alert("Thêm mã giảm giá mới thành công!");
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeactivate = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa mã này không? Khách hàng sẽ không thể sử dụng nó nữa.")) {
      setDiscounts(discounts.map(discount =>
        discount.id === id ? { ...discount, status: "inactive" } : discount
      ));
    }
  };

  const handleDelete = (id, code) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn mã "${code}" không?`)) {
      setDiscounts(discounts.filter(d => d.id !== id));
      alert(`Đã xóa mã giảm giá "${code}"`);
    }
  };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Mã giảm giá</h1>
          <p className="text-gray-500 mt-1">Tạo và quản lý các mã giảm giá cho khách hàng</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Thêm mã giảm giá
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="p-6">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <DiscountTable 
            discounts={filteredDiscounts} 
            onDeactivate={handleDeactivate} 
            onDelete={handleDelete} 
          />
        </div>
      </div>

      <DiscountModal 
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); resetForm(); }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
      
    </div>
  );
}