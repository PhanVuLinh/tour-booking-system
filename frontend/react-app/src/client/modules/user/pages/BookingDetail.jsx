import React, { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import { BookingStatusBadge } from "../components/StatusBadge";
import { formatDate, formatPrice } from "../../../utils/format.helper";
import { getBookingDetail } from "../services/userService";

import {
  getPassengerTypeName,
  getPaymentMethodName,
} from "../utils/user.helper";

function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBookingDetail(id)
      .then((response) => {
        if (response.success && response.data) setBooking(response.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải chi tiết đơn tour:", err);
        setError(
          err.message ||
            "Đã có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau!",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (error || !booking) {
    return (
      <main className="profile-main b-box">
        <div className="profile-header">
          <Link to="/profile/history" className="btn-back-history">
            <i className="fa-solid fa-arrow-left"></i> Quay lại lịch sử
          </Link>
        </div>
        <div className="search-empty-state" style={{ padding: "40px 20px" }}>
          <i
            className="fa-solid fa-triangle-exclamation"
            style={{ fontSize: "40px", color: "#dc2626", marginBottom: "15px" }}
          ></i>
          <h3>{error || "Không tìm thấy đơn đặt tour!"}</h3>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <Link to="/profile/history" className="btn-action btn-outline">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-main b-box">
      <div
        className="profile-header"
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <Link to="/profile/history" className="btn-back-history">
          <i className="fa-solid fa-arrow-left"></i> Quay lại lịch sử
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginTop: "10px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2 className="profile-title" style={{ margin: 0 }}>
            Chi tiết đơn: #{booking.booking_code}
          </h2>
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      <div className="bd-wrapper">
        {/* Khối 1: Thông tin Tour */}
        <div className="bd-section">
          <h3 className="bd-section-title">
            <i className="fa-solid fa-map-location-dot"></i> Thông tin chuyến đi
          </h3>
          <div className="bd-tour-card">
            <img
              src={booking.tour.thumbnail}
              alt="Tour thumbnail"
              className="bd-tour-img"
            />
            <div className="bd-tour-info">
              <h4>{booking.tour.title}</h4>
              <div className="bd-tour-meta">
                <p>
                  <i className="fa-regular fa-calendar"></i> Khởi hành:{" "}
                  <strong>{formatDate(booking.tour.start_date)}</strong>
                </p>
                <p>
                  <i className="fa-solid fa-users"></i> Số lượng:{" "}
                  <strong>{booking.passengers.length} khách</strong>
                </p>
                <p>
                  <i className="fa-regular fa-clock"></i> Ngày đặt:{" "}
                  <strong>{formatDate(booking.created_at)}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 2: Thông tin liên hệ */}
        <div className="bd-section">
          <h3 className="bd-section-title">
            <i className="fa-solid fa-address-book"></i> Thông tin liên hệ
          </h3>
          <div className="bd-grid-info">
            <div className="bd-info-item">
              <span className="label">Họ và tên:</span>
              <span className="value">
                <strong>{booking.contact.full_name}</strong>
              </span>
            </div>
            <div className="bd-info-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">
                <strong>{booking.contact.phone}</strong>
              </span>
            </div>
            <div className="bd-info-item">
              <span className="label">Email:</span>
              <span className="value">
                <strong>{booking.contact.email}</strong>
              </span>
            </div>
            <div className="bd-info-item">
              <span className="label">Địa chỉ:</span>
              <span className="value">
                {booking.contact.address || "Không có"}
              </span>
            </div>
          </div>
          {booking.note && (
            <div className="bd-note-box">
              <strong>Ghi chú:</strong> {booking.note}
            </div>
          )}
        </div>

        {/* Khối 3: Danh sách hành khách */}
        <div className="bd-section">
          <h3 className="bd-section-title">
            <i className="fa-solid fa-user-group"></i> Danh sách hành khách (
            {booking.passengers.length})
          </h3>
          <div className="bd-passenger-list">
            {booking.passengers.map((p, index) => (
              <div className="bd-passenger-card" key={p.id || index}>
                <div className="bd-passenger-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="bd-passenger-details">
                  <div className="bd-pd-header">
                    <strong>{p.full_name}</strong>
                    <span className={`badge-type type-${p.passenger_type}`}>
                      {getPassengerTypeName(p.passenger_type)}
                    </span>
                  </div>
                  <div className="bd-pd-body">
                    <span>Giới tính: {p.gender || "Không rõ"}</span>
                    <span>Ngày sinh: {formatDate(p.dob)}</span>
                    {p.identity_card && (
                      <span>CCCD/Passport: {p.identity_card}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khối 4: Thanh toán & Giá */}
        <div className="bd-section">
          <h3 className="bd-section-title">
            <i className="fa-solid fa-file-invoice-dollar"></i> Chi tiết thanh
            toán
          </h3>

          <div className="bd-payment-summary">
            <div className="bd-ps-left">
              <p>
                <strong>Phương thức:</strong>{" "}
                {getPaymentMethodName(booking.payment.method)}
              </p>
              <p>
                <strong>Hình thức:</strong>{" "}
                {booking.payment.type === "50"
                  ? "Đặt cọc 50%"
                  : "Thanh toán toàn bộ 100%"}
              </p>
              <p>
                <strong>Trạng thái TT:</strong>{" "}
                {booking.status === "pending" ? (
                  <span className="text-warning">Chưa thanh toán</span>
                ) : (
                  <span className="text-success">Đã thanh toán</span>
                )}
              </p>
            </div>

            <div className="bd-ps-right">
              <div className="bd-price-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(booking.pricing.sub_total)}</span>
              </div>
              {booking.pricing.discount > 0 && (
                <div className="bd-price-row discount">
                  <span>Giảm giá:</span>
                  <span>- {formatPrice(booking.pricing.discount)}</span>
                </div>
              )}
              <div className="bd-price-row total">
                <span>Tổng tiền tour:</span>
                <span>{formatPrice(booking.pricing.total)}</span>
              </div>

              <div className="bd-price-divider"></div>

              <div className="bd-price-row amount-paid">
                <span>
                  Số tiền{" "}
                  {booking.payment.type === "50"
                    ? "cần cọc (50%)"
                    : "cần thanh toán"}
                  :
                </span>
                <strong className="text-red">
                  {formatPrice(booking.payment.payable_amount)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Nút thao tác dưới cùng: Chỉ hiển thị khi đang Chờ xác nhận (pending) */}
        {booking.status === "pending" && (
          <div className="bd-actions-footer">
            <button className="btn-action btn-danger-outline">
              <i className="fa-solid fa-times"></i> Hủy đơn tour này
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default BookingDetail;
