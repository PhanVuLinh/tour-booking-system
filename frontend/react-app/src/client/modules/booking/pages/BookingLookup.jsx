import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { lookupBookingService } from "../services";
import { Breadcrumb } from "../../../shared";
import { BookingStatusBadge } from "../../user/components/StatusBadge";

import {
  BookingTripInfo,
  BookingContactInfo,
  BookingPassengerList,
  BookingPaymentSummary,
} from "../components/details";

export default function BookingLookup() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(code || "");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooking = (bookingCode) => {
    setInputCode(bookingCode);
    setBooking(null);
    setLoading(true);

    lookupBookingService(bookingCode)
      .then((response) => {
        if (response.success && response.data) {
          setBooking(response.data);
          toast.success(
            `Tra cứu thông tin đơn hàng #${response.data.booking_code} thành công!`,
          );
        } else {
          toast.error(
            `Không tìm thấy thông tin đơn đặt tour với mã #${bookingCode}!`,
          );
        }
      })
      .catch(() => {
        toast.error("Không thể tra cứu thông tin đơn đặt tour!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!code) {
      setInputCode("");
      setBooking(null);
      setLoading(false);
      return;
    }

    const bookingCode = code.trim().toUpperCase();
    fetchBooking(bookingCode);
  }, [code]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const bookingCode = inputCode.trim().toUpperCase();

    if (!bookingCode) {
      toast.error("Vui lòng nhập mã đơn hàng!");
      return;
    }

    if (code && code.trim().toUpperCase() === bookingCode) {
      fetchBooking(bookingCode);
    } else {
      navigate(`/booking/lookup/${encodeURIComponent(bookingCode)}`);
    }
  };

  return (
    <div className="booking-lookup-page">
      <Breadcrumb
        title="Tra cứu đơn hàng"
        thumbnail="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
        list={[
          { title: "Trang chủ", url: "/" },
          { title: "Tra cứu đơn hàng", url: "/booking/lookup" },
        ]}
      />

      <div className="container booking-lookup-container">
        {/* Khối nhập mã booking */}
        <div className="b-box lookup-search-box">
          <h2 className="lookup-title">
            <i className="fa-solid fa-magnifying-glass lookup-title-icon"></i>
            Tra Cứu Thông Tin Đơn Đặt Tour
          </h2>

          <p className="lookup-desc">
            Nhập mã đơn hàng, mã đặt tour bắt đầu bằng{" "}
            <strong>BKG-*********</strong>, để kiểm tra tình trạng vé và thông
            tin chuyến đi.
          </p>

          <form onSubmit={handleSearchSubmit} className="lookup-form">
            <input
              type="text"
              className="b-input lookup-input"
              placeholder="Nhập mã booking, ví dụ: BKG-123456"
              value={inputCode}
              onChange={(event) =>
                setInputCode(event.target.value.toUpperCase())
              }
            />

            <button
              type="submit"
              className="btn-action btn-fill lookup-submit-btn"
              disabled={loading}
            >
              <i className="fa-solid fa-search"></i>
              {loading ? " Tra cứu..." : " Tra cứu"}
            </button>
          </form>
        </div>

        {/* Trạng thái đang tải */}
        {loading && (
          <div className="client-loading-state">
            <div className="client-spinner"></div>
            <p>Đang tìm kiếm thông tin đơn hàng...</p>
          </div>
        )}

        {/* Chi tiết booking */}
        {!loading && booking && (
          <div className="profile-main b-box lookup-detail-card">
            <div className="profile-header lookup-detail-header">
              <div className="lookup-header-inner">
                <h2 className="profile-title lookup-header-title">
                  Mã đơn hàng:{" "}
                  <span className="lookup-highlight-code">
                    #{booking.booking_code}
                  </span>
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

              <BookingContactInfo
                contact={booking.contact}
                note={booking.note}
              />

              <BookingPassengerList passengers={booking.passengers} />

              <BookingPaymentSummary
                payment={booking.payment}
                pricing={booking.pricing}
                status={booking.status}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
