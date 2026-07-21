import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate, formatPrice } from "../../../utils/format.helper";

export default function HistoryCard({ booking }) {
  return (
    <div className="history-card">
      {/* Header thẻ: Mã Code & Trạng thái */}
      <div className="hc-header">
        <div className="hc-header-left">
          <span className="hc-code">
            Mã đơn: <strong>{booking.bookingCode}</strong>
          </span>
          <span className="hc-date">
            Ngày đặt: {formatDate(booking.bookingDate)}
          </span>
        </div>
        <div className="hc-header-right">
          <StatusBadge status={booking.status} />
        </div>
      </div>

      {/* Body thẻ: Thông tin Tour */}
      <div className="hc-body">
        <div className="hc-img">
          <img src={booking.tour.thumbnail} alt={booking.tour.title} />
        </div>
        <div className="hc-info">
          <h3 className="hc-tour-title">
            <Link to={`/tours/detail/${booking.tour.slug}`}>
              {booking.tour.title}
            </Link>
          </h3>
          <div className="hc-meta-grid">
            <div className="hc-meta-item">
              <i className="fa-regular fa-calendar"></i>
              <span>
                Khởi hành: <strong>{formatDate(booking.startDate)}</strong>
              </span>
            </div>
            <div className="hc-meta-item">
              <i className="fa-solid fa-users"></i>
              <span>
                Hành khách: <strong>{booking.totalPassengers} người</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer thẻ: Tổng tiền & Nút thao tác */}
      <div className="hc-footer">
        <div className="hc-total">
          Tổng tiền: <strong>{formatPrice(booking.totalAmount)}</strong>
        </div>
        <div className="hc-actions">
          <Link
            to={`/profile/history/${booking.id}`}
            className="btn-action btn-outline btn-sm"
          >
            Xem chi tiết
          </Link>
          {booking.status === "pending" && (
            <button className="btn-action btn-danger-outline btn-sm">
              Hủy đơn
            </button>
          )}
          {booking.status === "completed" && (
            <button className="btn-action btn-fill btn-sm">
              Đánh giá tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
