import React, { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatPrice } from "../../../utils/format.helper";

function BookingDetail() {
  const { isProfileLoaded } = useOutletContext();
  const { id } = useParams(); // Lấy bookingId từ URL
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giả lập gọi API lấy chi tiết đơn đặt tour dựa vào ID
  useEffect(() => {
    setLoading(true);
    // Sau này thay thế bằng API thật: fetch(`/api/bookings/detail/${id}`)
    const timer = setTimeout(() => {
      // Dữ liệu giả lập mô phỏng theo chuẩn Database
      setBooking({
        id: id,
        bookingCode: "BKG-519317596",
        tour: {
          title: "Lịch trình vi vu Đà Nẵng – Hội An 4 ngày 3 đêm",
          thumbnail:
            "https://images.unsplash.com/photo-1557315360-6a350ab4eccd?auto=format&fit=crop&w=800&q=80",
          startDate: "2026-08-15T08:00:00",
        },
        contact: {
          fullName: "Trần Minh Quân",
          phone: "0908123456",
          email: "quan.tran@example.com",
          address: "190 Pasteur, Phường Xuân Hòa, TP.HCM",
        },
        passengers: [
          {
            id: 1,
            fullName: "Trần Minh Quân",
            dob: "1995-08-15",
            gender: "Nam",
            identity_card: "079095123456",
            passengerType: "adult",
          },
          {
            id: 2,
            fullName: "Trần Gia Bảo",
            dob: "2018-03-20",
            gender: "Nam",
            identity_card: "",
            passengerType: "child",
          },
        ],
        payment: {
          method: "cod",
          type: "100", // 100% thanh toán
          payableAmount: 3732000.0,
          status: "pending",
        },
        pricing: {
          subTotal: 4232000.0,
          discount: 500000.0,
          total: 3732000.0,
        },
        note: "Gia đình có trẻ em đi cùng, vui lòng sắp xếp chỗ ngồi gần nhau và hỗ trợ suất ăn ít cay.",
        status: "pending",
        createdAt: "2026-07-08T07:58:39",
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const getPassengerTypeName = (type) => {
    switch (type) {
      case "adult":
        return "Người lớn";
      case "child":
        return "Trẻ em";
      case "baby":
        return "Em bé";
      default:
        return "Khách";
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "cod":
        return "Tiền mặt / Chuyển khoản";
      case "vnpay":
        return "Thanh toán qua VNPAY";
      case "momo":
        return "Thanh toán qua Momo";
      default:
        return method;
    }
  };

  if (!isProfileLoaded || loading) {
    return (
      <main className="profile-main b-box">
        <div className="profile-header">
          <Link to="/profile/history" className="btn-back-history">
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>
        </div>
        <div
          className="profile-form-wrapper"
          style={{ padding: "40px 0", textAlign: "center" }}
        >
          <div className="client-spinner" style={{ margin: "0 auto" }}></div>
          <p style={{ color: "#666", marginTop: "10px" }}>
            Đang tải dữ liệu chi tiết...
          </p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="profile-main b-box">
        <div className="search-empty-state">
          <h3>Không tìm thấy đơn đặt tour!</h3>
          <Link to="/profile/history" className="btn-action btn-fill">
            Quay lại danh sách
          </Link>
        </div>
      </main>
    );
  }

  const totalPassengers = booking.passengers.length;

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
            Chi tiết đơn: #{booking.bookingCode}
          </h2>
          <StatusBadge status={booking.status} />
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
                  <strong>{formatDate(booking.tour.startDate)}</strong>
                </p>
                <p>
                  <i className="fa-solid fa-users"></i> Số lượng:{" "}
                  <strong>{totalPassengers} khách</strong>
                </p>
                <p>
                  <i className="fa-regular fa-clock"></i> Ngày đặt:{" "}
                  <strong>{formatDate(booking.createdAt)}</strong>
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
                <strong>{booking.contact.fullName}</strong>
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
                    <strong>{p.fullName}</strong>
                    <span className={`badge-type type-${p.passengerType}`}>
                      {getPassengerTypeName(p.passengerType)}
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
                <span>{formatPrice(booking.pricing.subTotal)}</span>
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
                  {formatPrice(booking.payment.payableAmount)}
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
