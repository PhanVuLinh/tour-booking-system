import { Eye, EyeOff, Trash2, Star } from "lucide-react";

export function ReviewTable({ reviews, onToggleVisibility, onDelete }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return <div className="text-center py-10 text-gray-400 text-sm">Không tìm thấy đánh giá nào</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tour</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Đánh giá</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nhận xét</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Ngày tạo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <tr key={review.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm font-medium text-gray-900">{review.customerName}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{review.tourName}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 font-mono">({review.rating}/5)</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate" title={review.comment}>
                {review.comment}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">{review.createdAt}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  review.status === "visible" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {review.status === "visible" ? "Hiển thị" : "Đã ẩn"}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onToggleVisibility(review.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    title={review.status === "visible" ? "Ẩn đánh giá" : "Hiển thị đánh giá"}
                  >
                    {review.status === "visible" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onDelete(review.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Xóa đánh giá"
                  >
                    <Trash2 className="w-4 h-4" />
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