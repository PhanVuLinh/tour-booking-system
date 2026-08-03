import { useRef, useState, useEffect } from "react";
import { TourCard } from "../../tours";
import { getFlashSales } from "../services/homeService";
import { useCountdown } from "../hooks/useCountdown";
import { formatPrice } from "../../../utils/format.helper";

function FlashSale() {
  const trackRef = useRef(null);
  const [tourFlashSales, setTourFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy ngày khởi hành của tour cận kề nhất làm mốc đếm ngược
  const targetDate = tourFlashSales.length > 0 ? tourFlashSales[0].start_date : null;
  const timeLeft = useCountdown(targetDate);

  // Tính số tiền giảm tối đa thực tế từ danh sách tour flash sale
  const maxDiscountAmount = tourFlashSales.reduce((max, tour) => {
    const discount = (tour.oldPrice || 0) - (tour.newPrice || 0);
    return discount > max ? discount : max;
  }, 0);

  useEffect(() => {
    setLoading(true);
    getFlashSales()
      .then((result) => {
        if (result.success) {
          setTourFlashSales(result.data || []);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải tour flash sale:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const padZero = (num) => String(num).padStart(2, "0");

  const getScrollAmount = () => {
    if (trackRef.current && trackRef.current.children.length > 0) {
      const cardWidth = trackRef.current.children[0].offsetWidth;
      const gap = 20; // 20px gap từ CSS
      return cardWidth + gap;
    }
    return 0;
  };

  const handlePrev = () => {
    const amount = getScrollAmount();
    if (trackRef.current && amount > 0) {
      trackRef.current.scrollBy({
        left: -amount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const amount = getScrollAmount();
    if (trackRef.current && amount > 0) {
      trackRef.current.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    }
  };

  if (!loading && tourFlashSales.length === 0) {
    return null;
  }

  return (
    <section className="flash-sale">
      <div className="container">
        <div className="flash-sale__inner">
          <div className="flash-sale__info">
            <h2 className="fs-title">
              ƯU ĐÃI 2026 <br /> TOUR GIỜ CHÓT
            </h2>
            <p className="fs-desc">
              Săn tour giá cực sốc – Số lượng chỗ có hạn, chốt deal ngay hôm nay!
            </p>

            <div className="fs-countdown-wrap">
              <p className="fs-end-text">Kết thúc sau</p>
              <div className="fs-countdown">
                <div className="time-item">
                  <div className="time-box">{padZero(timeLeft.days)}</div>
                  <span>Ngày</span>
                </div>
                <div className="time-item">
                  <div className="time-box">{padZero(timeLeft.hours)}</div>
                  <span>Giờ</span>
                </div>
                <div className="time-item">
                  <div className="time-box">{padZero(timeLeft.minutes)}</div>
                  <span>Phút</span>
                </div>
                <div className="time-item">
                  <div className="time-box">{padZero(timeLeft.seconds)}</div>
                  <span>Giây</span>
                </div>
              </div>
            </div>

            {maxDiscountAmount > 0 && (
              <div className="fs-huge-discount">
                <p>GIẢM ĐẾN</p>
                <h3>{formatPrice(maxDiscountAmount)}</h3>
              </div>
            )}
          </div>

          <div className="flash-sale__tours">
            {tourFlashSales.length > 0 && (
              <>
                <button
                  className="slider-nav next"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>

                <button
                  className="slider-nav prev"
                  onClick={handlePrev}
                  aria-label="Prev"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              </>
            )}

            {loading ? (
              <div className="client-loading-state" style={{ padding: "40px 0" }}>
                <div className="client-spinner"></div>
                <p>Đang tải danh sách tour flash sale...</p>
              </div>
            ) : (
              <div className="tour-track" ref={trackRef}>
                {tourFlashSales.map((item) => (
                  <TourCard key={item.departure_id} tour={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlashSale;
