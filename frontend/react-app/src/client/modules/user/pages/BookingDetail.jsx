import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BookingStatusBadge } from "../components/StatusBadge";
import { getBookingDetail } from "../services/userService";
import { TicketQRCode } from "../../../shared";
import { RefundRequestModal } from "../components";
import { formatDate } from "../../../utils/format.helper";

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
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const loadDetail = () => {
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
  };

  useEffect(() => {
    loadDetail();
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
        {/* Mã QR Vé Điện Tử Check-in & Thẻ Lên Tour Boarding Pass */}
        <TicketQRCode
          bookingCode={booking.booking_code}
          tourTitle={booking.tour?.title}
          startDate={formatDate(booking.tour?.start_date)}
          customerName={booking.contact?.full_name}
          booking={booking}
        />

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

        {/* Trạng thái Chờ duyệt hủy */}
        {booking.status === "pending_cancel" && (
          <div className="bd-cancel-notice">
            <i className="fa-solid fa-hourglass-half"></i>
            <div>
              <strong>Đơn tour đang chờ xét duyệt hủy & hoàn tiền</strong>
              <p>
                Yêu cầu của bạn đã được tiếp nhận. Đội ngũ TravelGo đang kiểm tra
                và xử lý theo chính sách hoàn hủy.
              </p>
            </div>
          </div>
        )}

        {/* Nút thao tác dưới cùng: Hiển thị khi đang Chờ xác nhận hoặc Đã xác nhận */}
        {(booking.status === "pending" || booking.status === "confirmed") && (
          <div className="bd-actions-footer">
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="btn-action btn-danger-outline"
            >
              <i className="fa-solid fa-triangle-exclamation"></i>{" "}
              {booking.payment?.status === "paid"
                ? "Yêu cầu hủy tour & hoàn tiền"
                : "Hủy đặt chỗ này"}
            </button>
          </div>
        )}

      </div>

      {/* Modal Yêu cầu Hủy & Hoàn tiền */}
      {isCancelModalOpen && (
        <RefundRequestModal
          booking={booking}
          onClose={() => setIsCancelModalOpen(false)}
          onSuccess={loadDetail}
        />
      )}
    </main>
  );
}


export default BookingDetail;
