import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { bannerService } from "../services/bannerService";
import { BannerTable } from "../components/BannerTable";
import { BannerModal } from "../components/BannerModal";

const initialFormState = {
  title: "",
  image: "",
  link: "",
};

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [deleteId, setDeleteId] = useState(null);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAll();
      setBanners(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error("Lỗi khi tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSubmit = async () => {
    if (!formData.title || !formData.image) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc (*)");
      return;
    }

    try {
      if (editBanner) {
        await bannerService.update(editBanner.id, formData);
        toast.success("Cập nhật banner thành công");
      } else {
        await bannerService.create(formData);
        toast.success("Thêm banner mới thành công");
      }
      setIsDialogOpen(false);
      resetForm();
      loadBanners();
    } catch (error) {
      toast.error(error.message || "Thao tác thất bại");
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditBanner(null);
  };

  const handleEdit = (banner) => {
    setEditBanner(banner);
    setFormData({
      title: banner.title,
      image: banner.image,
      link: banner.link || "",
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const deleted = await bannerService.delete(deleteId);
      setBanners(prev => prev.filter(b => b.id !== deleteId));
      toast.success(`Đã chuyển banner "${deleted?.title}" vào thùng rác`);
    } catch (error) {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteId(null);
    }
  };

  const moveUp = async (id) => {
    const index = banners.findIndex(b => b.id === id);
    if (index > 0) {
      const newBanners = [...banners];
      [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
      newBanners.forEach((b, i) => b.order = i + 1);
      await bannerService.updateOrder(newBanners);
      setBanners([...newBanners]);
      toast.success("Đã thay đổi thứ tự banner");
    }
  };

  const moveDown = async (id) => {
    const index = banners.findIndex(b => b.id === id);
    if (index < banners.length - 1) {
      const newBanners = [...banners];
      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
      newBanners.forEach((b, i) => b.order = i + 1);
      await bannerService.updateOrder(newBanners);
      setBanners([...newBanners]);
      toast.success("Đã thay đổi thứ tự banner");
    }
  };

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật hình ảnh banner trên trang chủ</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm banner
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden p-6 pb-2">
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm banner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
          />
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Đang tải dữ liệu...</div>
        ) : (
          <BannerTable
            banners={filteredBanners}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
          />
        )}
      </div>

      <BannerModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!editBanner}
      />

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa banner</h3>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa banner này? Banner sẽ được chuyển vào thùng rác và có thể khôi phục sau.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}