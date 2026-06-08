import { Plus, X } from "lucide-react";

export function TourItinerary({ itinerary, onAddDay, onRemoveDay, onUpdateDay }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">Lộ trình chi tiết</h2>
        <button
          type="button"
          onClick={onAddDay}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm ngày
        </button>
      </div>
      <div className="p-6 space-y-6">
        {itinerary.map((item, index) => (
          <div key={index} className="relative p-5 bg-gray-50 border border-gray-200 rounded-xl">
            {/* Nút xóa ngày */}
            {itinerary.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveDay(index)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Xóa ngày này"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="space-y-4 pr-8">
              <h3 className="font-bold text-gray-900">Ngày {item.day}</h3>
              <div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => onUpdateDay(index, "title", e.target.value)}
                  placeholder="Tiêu đề (VD: Hà Nội - Vịnh Hạ Long)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <textarea
                  value={item.description}
                  onChange={(e) => onUpdateDay(index, "description", e.target.value)}
                  placeholder="Chi tiết các hoạt động trong ngày..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}