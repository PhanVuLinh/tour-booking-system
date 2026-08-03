import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TourCard } from "../components";
import { searchTours } from "../services/tourService";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

  const destination = searchParams.get("destination") || "";
  const quantity = searchParams.get("quantity") || "";
  const date = searchParams.get("date") || "";

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);

      try {
        const response = await searchTours({ destination, quantity, date });
        if (response.success) {
          setTours(response.data);
        } else {
          setTours([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [destination, quantity, date]);

  return (
    <div className="search-page-wrapper">
      <div className="container">
        {/* TIÊU ĐỀ & TÓM TẮT TÌM KIẾM */}
        <div className="search-page-header">
          <h2 className="search-title">Kết quả tìm kiếm</h2>
          <p className="search-subtitle">
            Khám phá những chuyến đi tuyệt vời dành riêng cho bạn
          </p>

          <div className="search-summary-tags">
            <span className="summary-label">Bạn đang tìm:</span>
            <div className="tag">
              <i className="fa-solid fa-location-dot"></i>
              {destination ? destination : "Tất cả địa điểm"}
            </div>
            {quantity && (
              <div className="tag">
                <i className="fa-solid fa-user-group"></i>
                {quantity} người
              </div>
            )}
            {date && (
              <div className="tag">
                <i className="fa-regular fa-calendar"></i>
                {date}
              </div>
            )}
          </div>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="search-page-content">
          {loading ? (
            <div className="client-loading-state">
              <div className="client-spinner"></div>
              <p>Đang tìm kiếm các tour tốt nhất...</p>
            </div>
          ) : (
            <>
              {tours.length > 0 ? (
                <>
                  <div className="search-results-count">
                    Tìm thấy <strong>{tours.length}</strong> tour phù hợp
                  </div>
                  <div className="tour-grid-4">
                    {tours.map((tour) => (
                      <TourCard
                        key={`${tour.id}-${tour.departure_id}`}
                        tour={tour}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="search-empty-state">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                    alt="No results"
                  />
                  <h3>Không tìm thấy tour nào phù hợp!</h3>
                  <p>
                    Hãy thử thay đổi địa điểm, ngày đi hoặc giảm bớt các điều
                    kiện lọc để xem thêm nhiều lựa chọn khác.
                  </p>
                  <button
                    className="btn-reset-search"
                    onClick={() => window.history.back()}
                  >
                    Quay lại trang trước
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
