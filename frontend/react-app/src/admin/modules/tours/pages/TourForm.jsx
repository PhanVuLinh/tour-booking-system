import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, ImageIcon } from "lucide-react";
import { TourItinerary } from "../components/TourItinerary";
import { tourService } from "../services/tourService";

export default function TourForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    description: "",
    image: "",
    status: "active",
  });

  const [itinerary, setItinerary] = useState([{ day: 1, title: "", description: "" }]);

  useEffect(() => {
    if (!isEdit) return;

    const fetchTour = async () => {
      try {
        setLoading(true);
        const tour = await tourService.getById(id);
        setFormData({
          name:        tour.name || "",
          category:    tour.categoryId ? String(tour.categoryId) : "",
          price:       tour.price || "",
          duration:    tour.duration || "",
          description: tour.description || "",
          image:       tour.image || "",
          status:      tour.status || "active",
        });
        if (tour.itinerary?.length > 0) {
          setItinerary(tour.itinerary);
        }
      } catch (err) {
        alert("Không tìm thấy tour: " + err.message);
        navigate("/admin/tours");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, isEdit, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh (PNG, JPG, WEBP...)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 5MB");
      return;
    }

    setImageFile(file);
    setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (*)");
      return;
    }
    if (!isEdit && !imageFile) {
      alert("Vui lòng chọn ảnh cho tour");
      return;
    }

    const payload = {
      title:       formData.name,
      time:        formData.duration,
      categoryId:  Number(formData.category), 
      description: formData.description,
      status:      formData.status,
      price:       Number(formData.price),
      thumbnail:   imageFile ? null : formData.image,
    };

    try {
      setSubmitting(true);
      if (isEdit) {
        await tourService.update(id, payload);
        alert("Cập nhật tour thành công!");
      } else {
        await tourService.create(payload, imageFile);
        alert("Thêm tour mới thành công!");
      }
      navigate("/admin/tours");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const addItineraryDay = () =>
    setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "" }]);

  const removeItineraryDay = (index) => {
    const updated = itinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setItinerary(updated);
  };

  const updateItinerary = (index, field, value) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Đang tải dữ liệu tour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-6"
        onClick={() => navigate("/admin/tours")}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Chỉnh sửa Tour" : "Thêm Tour mới"}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? "Cập nhật thông tin chi tiết của tour" : "Điền thông tin để tạo tour du lịch mới"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Tour <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                    >
                      <option value="" disabled>Chọn danh mục...</option>
                      <option value="1">Du lịch Trong Tooi</option>
                      <option value="30002">Du lịch Trong Nướcc</option>
                      <option value="60001">Tour Trong Nước</option>
                      <option value="60002">Tour Quốc Tế</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Ví dụ: 3N2Đ"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá tour (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <TourItinerary
              itinerary={itinerary}
              onAddDay={addItineraryDay}
              onRemoveDay={removeItineraryDay}
              onUpdateDay={updateItinerary}
            />
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Hình ảnh</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-52 object-cover"
                      />
                      {imageFile && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5 flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-white shrink-0" />
                          <span className="text-xs text-white truncate">{imageFile.name}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-52 cursor-pointer group/upload">
                      <div className="w-14 h-14 mb-3 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:shadow-md transition-all">
                        <Upload className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Nhấn để chọn ảnh</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Tối đa 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                {formData.image && (
                  <label className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    Đổi ảnh khác
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}

                {!imageFile && (
                  <div>
                    <p className="text-xs text-gray-400 text-center mb-2">hoặc nhập URL ảnh</p>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Trạng thái</h2>
              </div>
              <div className="p-6">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none font-medium"
                >
                  <option value="active">🟢 Hoạt động</option>
                  <option value="inactive">⚪ Tạm dừng</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {submitting ? "Đang lưu..." : isEdit ? "Cập nhật Tour" : "Đăng Tour mới"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/tours")}
                disabled={submitting}
                className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}