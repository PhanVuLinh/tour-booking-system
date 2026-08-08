import React, { useState } from "react";
import { toast } from "sonner";
import { createReview } from "../../tours/services/reviewService";

export default function ReviewModal({ booking, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập cảm nhận của bạn!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createReview({
        tour_id: booking.tour.id,
        booking_id: booking.id,
        rating,
        content: content.trim(),
      });

      if (res && res.success) {
        toast.success(res.message || "Gửi đánh giá thành công!");
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Không thể gửi đánh giá.");
      }
    } catch (error) {
      toast.error(error?.message || "Đã xảy ra lỗi khi gửi đánh giá.");
    } finally {

      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-modal-backdrop">
      <div className="review-modal-card">
        {/* Modal Header */}
        <div className="review-modal-header">
          <h3 className="review-modal-title">⭐ Đánh giá chuyến đi</h3>
          <button onClick={onClose} className="review-modal-close-btn">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="review-modal-body">
          {/* Mini Card Tour */}
          <div className="review-modal-mini-card">
            <img
              src={booking.tour.thumbnail}
              alt={booking.tour.title}
              className="review-modal-mini-img"
            />
            <div className="review-modal-mini-info">
              <h4 className="review-modal-mini-title">{booking.tour.title}</h4>
              <span className="review-modal-mini-code">
                Mã đơn:{" "}
                <strong className="review-modal-mini-code-val">
                  {booking.booking_code}
                </strong>
              </span>
            </div>
          </div>

          {/* Chọn số sao */}
          <div className="review-modal-star-section">
            <label className="review-modal-star-label">
              Mức độ hài lòng của bạn:
            </label>
            <div className="review-modal-star-group">
              {[1, 2, 3, 4, 5].map((s) => (
                <i
                  key={s}
                  onClick={() => setRating(s)}
                  className={`review-modal-star-icon ${
                    s <= rating ? "fa-solid fa-star" : "fa-regular fa-star"
                  }`}
                ></i>
              ))}
            </div>
          </div>

          {/* Nhập nội dung */}
          <div className="review-modal-textarea-section">
            <label className="review-modal-textarea-label">
              Chia sẻ cảm nhận chi tiết:
            </label>
            <textarea
              rows="4"
              placeholder="Hướng dẫn viên, phương tiện đưa đón, chất lượng ăn uống và khách sạn thế nào..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="review-modal-textarea"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="review-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="review-modal-cancel-btn"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="review-modal-submit-btn"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
