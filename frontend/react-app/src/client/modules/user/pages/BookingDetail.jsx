import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BookingStatusBadge } from "../components/StatusBadge";
import { getBookingDetail } from "../services/userService";

import {
  BookingTripInfo,
  BookingContactInfo,
  BookingPassengerList,
  BookingPaymentSummary,
} from "../../booking/components/details";

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

  if (loading) {
    return (
      <main className="profile-main b-box">
        <div className="client-loading-state" style={{ minHeight: "300px" }}>
          <div className="client-spinner"></div>
          <p>Đang tải chi tiết đơn đặt tour...</p>
        </div>
      </main>
    );
  }

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
        <BookingTripInfo
          tour={booking.tour}
          passengersCount={booking.passengers?.length || 0}
          createdAt={booking.created_at}
        />

        <BookingContactInfo contact={booking.contact} note={booking.note} />

        <BookingPassengerList passengers={booking.passengers} />

        <BookingPaymentSummary
          payment={booking.payment}
          pricing={booking.pricing}
          status={booking.status}
        />

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
