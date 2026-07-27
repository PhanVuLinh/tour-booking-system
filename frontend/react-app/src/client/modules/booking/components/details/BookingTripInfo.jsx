import React from "react";
import { formatDate } from "../../../../utils/format.helper";

export default function BookingTripInfo({ tour, passengersCount = 0, createdAt }) {
  if (!tour) return null;

  return (
    <div className="bd-section lookup-section">
      <h3 className="bd-section-title lookup-section-title">
        <i className="fa-solid fa-map-location-dot lookup-section-icon"></i>
        Thông tin chuyến đi
      </h3>

      <div className="bd-tour-card">
        <img
          src={tour.thumbnail}
          alt={tour.title || "Hình ảnh tour"}
          className="bd-tour-img"
        />

        <div className="bd-tour-info">
          <h4 className="lookup-tour-title">{tour.title}</h4>

          <div className="bd-tour-meta">
            <p>
              <i className="fa-solid fa-location-dot"></i> Điểm đi:{" "}
              <strong>{tour.departure_from || "Chưa cập nhật"}</strong>
            </p>

            <p>
              <i className="fa-regular fa-calendar"></i> Khởi hành:{" "}
              <strong>{formatDate(tour.start_date)}</strong>
            </p>

            <p>
              <i className="fa-solid fa-users"></i> Số lượng:{" "}
              <strong>{passengersCount} hành khách</strong>
            </p>

            {createdAt && (
              <p>
                <i className="fa-regular fa-clock"></i> Ngày đặt đơn:{" "}
                <strong>{formatDate(createdAt)}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
