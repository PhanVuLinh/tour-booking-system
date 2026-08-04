import { Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export function BannerTable({ banners, onEdit, onDelete, onMoveUp, onMoveDown }) {
  if (banners.length === 0) {
    return <div className="text-center py-10 text-gray-400 text-sm">Không tìm thấy banner nào</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {banners.map((banner, index) => (
        <div key={banner.id} className="border border-gray-100 bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-48 h-28 rounded-xl object-cover shrink-0 bg-gray-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate">{banner.title}</h3>
            {banner.link && (
              <p className="text-xs text-gray-500 mt-1 truncate">Link: {banner.link}</p>
            )}
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                banner.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {banner.status === "active" ? "Đang hiển thị" : "Tạm ẩn"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onMoveUp(banner.id)}
                disabled={index === 0}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Chuyển lên"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onMoveDown(banner.id)}
                disabled={index === banners.length - 1}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Chuyển xuống"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => onEdit(banner)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(banner.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa banner"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}