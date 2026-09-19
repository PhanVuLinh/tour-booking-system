import React, { useState, useEffect } from "react";
import { formatDate, formatPrice } from "../../../utils/format.helper";

export default function TourStickyBookingBar({
  tour = null,
  selectedDate = null,
  passengers = { adults: 1, children: 0, infants: 0 },
  totalPrice = 0,
  onBookNow = () => {},
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Khi cuộn trang qua 420px (vượt qua khu vực gallery)
      if (window.scrollY > 420) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!tour) return null;

  const totalPassengers =
    (passengers.adults || 0) + (passengers.children || 0) + (passengers.infants || 0);

  return (
    <div className={`tour-sticky-booking-bar ${isVisible ? "show" : ""}`}>
      <div className="container tour-sticky-inner">
        {/* Thông tin tour bên trái */}
        <div className="tsb-left">
          <img
            src={tour.thumbnail || "https://placehold.co/80x60"}
            alt={tour.title}
            className="tsb-thumb"
          />

          <div className="tsb-tour-meta">
            <h4 className="tsb-title" title={tour.title}>
              {tour.title}
            </h4>

            <div className="tsb-sub-meta">
              <span className="tsb-date-badge">
                <i className="fa-regular fa-calendar-check"></i>
                <span>
                  {selectedDate
                    ? formatDate(selectedDate.start_date)
                    : "Chưa chọn ngày"}
                </span>
              </span>

              {selectedDate?.slots && (
                <span className="tsb-slot-badge">
                  <i className="fa-solid fa-fire text-amber-500"></i>
                  <span>Còn {selectedDate.slots} chỗ</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Giá & nút đặt vé bên phải */}
        <div className="tsb-right">
          <div className="tsb-pricing-box">
            <div className="tsb-price-row">
              <span className="tsb-price-label">Tổng cộng ({totalPassengers} khách):</span>
              <strong className="tsb-total-amount">{formatPrice(totalPrice)}</strong>
            </div>

            {selectedDate?.newPriceAdult && (
              <span className="tsb-price-sub">
                Giá vé: {formatPrice(selectedDate.newPriceAdult)} / người lớn
              </span>
            )}
          </div>

          <button
            type="button"
            className="tsb-book-btn"
            onClick={onBookNow}
            disabled={!selectedDate}
          >
            <span>Đặt Tour Ngay</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
