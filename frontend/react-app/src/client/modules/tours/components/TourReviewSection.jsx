import { useState, useEffect } from "react";
import { getReviewsByTourId } from "../services/reviewService";
import { formatDate } from "../../../utils/format.helper";

export function TourReviewSection({ tourId }) {
  const [reviewData, setReviewData] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviews: [],
  });

  const fetchReviews = async () => {
    if (!tourId) return;
    try {
      const res = await getReviewsByTourId(tourId);
      if (res && res.success) {
        setReviewData(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đánh giá:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  return (
    <div className="detail-box tour-review-section">
      <div className="tour-review-header">
        <h2 className="box-title tour-review-title">
          <i className="fa-solid fa-star tour-review-star-icon"></i>
          Đánh Giá Từ Khách Hàng ({reviewData.totalReviews})
        </h2>
      </div>


      {/* Overview & Rating Bars */}
      <div className="tour-review-overview">
        <div className="tour-review-avg-box">
          <div className="tour-review-avg-score">{reviewData.avgRating}</div>
          <div className="tour-review-stars-group">
            {[1, 2, 3, 4, 5].map((item) => (
              <i
                key={item}
                className={
                  item <= Math.round(reviewData.avgRating)
                    ? "fa-solid fa-star"
                    : "fa-regular fa-star"
                }
              ></i>
            ))}
          </div>
          <p className="tour-review-total-text">
            {reviewData.totalReviews} lượt đánh giá thực tế
          </p>
        </div>

        <div>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviewData.ratingCounts[star] || 0;
            const percent = reviewData.totalReviews
              ? (count / reviewData.totalReviews) * 100
              : 0;
            return (
              <div key={star} className="tour-review-bar-item">
                <span className="tour-review-bar-label">{star} sao</span>
                <div className="tour-review-bar-track">
                  <div
                    className="tour-review-bar-fill"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="tour-review-bar-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="tour-review-list">
        {reviewData.reviews.length === 0 ? (
          <p className="tour-review-empty">
            Chưa có đánh giá nào cho tour này. Hãy là người đầu tiên trải nghiệm và đánh giá từ trang Lịch sử chuyến đi!
          </p>
        ) : (
          reviewData.reviews.map((rev) => (
            <div key={rev.id} className="tour-review-card">
              <div className="tour-review-card-header">
                <div className="tour-review-user-info">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwhnueGF5QtopeQcCQrbesd6LkP8FZwOrkS7ramU5m_A&s=10"
                    alt={rev.user_name}
                    className="tour-review-avatar"
                  />

                  <div>
                    <h5 className="tour-review-user-name">{rev.user_name}</h5>
                    <div className="tour-review-stars-small">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <i
                          key={item}
                          className={
                            item <= rev.rating
                              ? "fa-solid fa-star"
                              : "fa-regular fa-star"
                          }
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="tour-review-date">
                  {formatDate(rev.created_at)}
                </span>
              </div>
              <p className="tour-review-card-content">{rev.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
