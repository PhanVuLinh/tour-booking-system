import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { lookupBookingService } from "../services/bookingService";
import {
  Breadcrumb,
  TicketQRCode,
  QRScannerModal,
} from "../../../shared";
import { BookingStatusBadge } from "../../user/components/StatusBadge";
import { formatDate } from "../../../utils/format.helper";

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
  const [searchedCode, setSearchedCode] = useState(code || "");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const fetchBooking = (bookingCode) => {
    const cleanCode = bookingCode.trim().toUpperCase();
    setInputCode(cleanCode);
    setSearchedCode(cleanCode);
    setBooking(null);
    setLoading(true);

    lookupBookingService(cleanCode)
      .then((response) => {
        if (response.success && response.data) {
          setBooking(response.data);
          toast.success(
            `Tra cứu thông tin đơn hàng #${response.data.booking_code} thành công!`,
          );
        } else {
          setBooking(null);
          toast.error(
            `Không tìm thấy thông tin đơn đặt tour với mã #${cleanCode}!`,
          );
        }
      })
      .catch(() => {
        setBooking(null);
        toast.error("Không thể tra cứu thông tin đơn đặt tour!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!code) {
      setInputCode("");
      setSearchedCode("");
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

  const handleClearInput = () => {
    setInputCode("");
  };

  const handleResetSearch = () => {
    setInputCode("");
    setSearchedCode("");
    setBooking(null);
    navigate("/booking/lookup");
  };

  const handleCopyCode = (bookingCode) => {
    if (!bookingCode) return;
    navigator.clipboard.writeText(bookingCode);
    toast.success(`Đã sao chép mã #${bookingCode} vào bộ nhớ tạm!`);
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
        {/* 1. HERO SEARCH HUB */}
        <div className="lookup-hero-card">
          <div className="lookup-hero-badge">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Cổng Tra Cứu Vé Điện Tử & Lịch Trình Khách Hàng</span>
          </div>

          <h1 className="lookup-hero-title">
            Tra Cứu Thông Tin Đơn Hàng & Vé Điện Tử
          </h1>

          <p className="lookup-hero-desc">
            Kiểm tra trạng thái thanh toán, xem thông tin hành khách, tải thẻ lên tour (E-Ticket Boarding Pass)
            và xem chi tiết lịch trình của bạn chỉ với một thao tác.
          </p>

          {/* Form nhập mã tra cứu */}
          <form onSubmit={handleSearchSubmit} className="lookup-search-form">
            <div className="lookup-input-wrap">
              <i className="fa-solid fa-ticket lookup-input-icon"></i>
              <input
                type="text"
                className="lookup-input-field"
                placeholder="Nhập mã đơn hàng, ví dụ: BKG-2024-X1Y2"
                value={inputCode}
                onChange={(event) =>
                  setInputCode(event.target.value.toUpperCase())
                }
              />
              {inputCode && (
                <button
                  type="button"
                  className="lookup-clear-btn"
                  onClick={handleClearInput}
                  title="Xóa mã"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="lookup-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang tra cứu...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>Tra cứu ngay</span>
                </>
              )}
            </button>
          </form>

          {/* Thanh công cụ quét nhanh */}
          <div className="lookup-quick-bar">
            <div className="lookup-quick-label">
              <i className="fa-solid fa-bolt"></i>
              <span>Hoặc tra cứu nhanh bằng:</span>
            </div>

            <div className="lookup-quick-actions">
              <button
                type="button"
                className="lookup-pill-btn"
                onClick={() => setIsScannerOpen(true)}
              >
                <i className="fa-solid fa-camera icon-cam"></i>
                <span>Quét camera trực tiếp</span>
              </button>

              <button
                type="button"
                className="lookup-pill-btn"
                onClick={() => setIsScannerOpen(true)}
              >
                <i className="fa-solid fa-image icon-img"></i>
                <span>Tải ảnh vé / QR lên</span>
              </button>
            </div>
          </div>

          <div className="lookup-hint-text">
            <i className="fa-solid fa-circle-info"></i>
            <span>Mã đơn hàng được gửi kèm trong email hoặc SMS xác nhận sau khi quý khách hoàn tất đặt tour.</span>
          </div>
        </div>

        {/* 2. TRẠNG THÁI ĐANG TẢI */}
        {loading && (
          <div className="client-loading-state">
            <div className="client-spinner"></div>
            <p>Đang kiểm tra và tải thông tin đơn hàng #{searchedCode}...</p>
          </div>
        )}

        {/* 3. TRẠNG THÁI KHÔNG TÌM THẤY (NOT FOUND) */}
        {!loading && searchedCode && !booking && (
          <div className="lookup-not-found-card">
            <div className="lookup-nf-icon-wrap">
              <i className="fa-solid fa-file-circle-question"></i>
            </div>

            <h3 className="lookup-nf-title">
              Không tìm thấy đơn hàng #{searchedCode}
            </h3>

            <p className="lookup-nf-desc">
              Hệ thống không tìm thấy dữ liệu phù hợp với mã <strong>#{searchedCode}</strong>.
              Vui lòng kiểm tra lại thông tin mã đơn hàng của bạn.
            </p>

            <div className="lookup-nf-tips">
              <div className="lookup-nf-tips-heading">
                <i className="fa-solid fa-lightbulb"></i>
                <span>Một số lưu ý khi tra cứu:</span>
              </div>
              <ul className="lookup-nf-tips-list">
                <li>Kiểm tra lại chính tả mã đơn hàng (thường bắt đầu bằng BKG- và không có khoảng trắng thừa).</li>
                <li>Mở lại email xác nhận đặt tour hoặc tin nhắn SMS để sao chép chính xác mã đơn.</li>
                <li>Nếu bạn vừa chuyển khoản ngân hàng, hệ thống có thể mất từ 1 - 3 phút để đồng bộ dữ liệu.</li>
              </ul>
            </div>

            <div className="lookup-nf-actions">
              <button
                type="button"
                className="lookup-btn-secondary"
                onClick={handleResetSearch}
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>Tra cứu lại</span>
              </button>

              <a
                href="tel:19006868"
                className="lookup-btn-hotline"
              >
                <i className="fa-solid fa-phone-volume"></i>
                <span>Tổng đài hỗ trợ 1900 6868</span>
              </a>
            </div>
          </div>
        )}

        {/* 4. TRẠNG THÁI MẶC ĐỊNH KHI CHƯA TRA CỨU */}
        {!loading && !searchedCode && !booking && (
          <div className="lookup-guide-section">
            <div className="lookup-guide-header">
              <div className="lookup-guide-tag">Quy trình tiện lợi & nhanh chóng</div>
              <h2 className="lookup-guide-title">
                3 Bước Tra Cứu & Nhận Vé Điện Tử
              </h2>
            </div>

            <div className="lookup-steps-grid">
              <div className="lookup-step-card">
                <div className="lookup-step-badge">01</div>
                <h4 className="lookup-step-card-title">Nhập mã hoặc Quét QR</h4>
                <p className="lookup-step-card-desc">
                  Nhập mã đặt tour BKG-XXXXXX nhận từ email xác nhận, hoặc sử dụng camera quét trực tiếp mã QR trên vé.
                </p>
              </div>

              <div className="lookup-step-card">
                <div className="lookup-step-badge">02</div>
                <h4 className="lookup-step-card-title">Xác thực & Xem lịch trình</h4>
                <p className="lookup-step-card-desc">
                  Kiểm tra chi tiết tình trạng thanh toán, thông tin điểm đón, hướng dẫn viên và hành trình xe/máy bay.
                </p>
              </div>

              <div className="lookup-step-card">
                <div className="lookup-step-badge">03</div>
                <h4 className="lookup-step-card-title">Xuất thẻ lên tour Boarding Pass</h4>
                <p className="lookup-step-card-desc">
                  In vé khổ A4 tiêu chuẩn hoặc lưu mã QR trên điện thoại để hướng dẫn viên check-in tức thì khi khởi hành.
                </p>
              </div>
            </div>

            <div className="lookup-trust-bar">
              <div className="lookup-trust-item">
                <i className="fa-solid fa-bolt-lightning"></i>
                <span>Tra cứu tức thì không cần đăng nhập tài khoản</span>
              </div>

              <div className="lookup-trust-item">
                <i className="fa-solid fa-lock"></i>
                <span>Bảo mật dữ liệu cá nhân chuẩn SSL 256-bit</span>
              </div>

              <div className="lookup-trust-item">
                <i className="fa-solid fa-headset"></i>
                <span>Hỗ trợ khách hàng 24/7 qua Hotline 1900 6868</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. DASHBOARD KẾT QUẢ TRA CỨU KHI TÌM THẤY ĐƠN HÀNG */}
        {!loading && booking && (
          <div className="lookup-result-dashboard">
            {/* Thanh thông tin & thao tác nhanh */}
            <div className="lookup-order-header-bar">
              <div className="lookup-oh-left">
                <div className="lookup-oh-code-box">
                  <span className="lookup-oh-code-title">Mã đơn hàng:</span>
                  <span className="lookup-oh-code-value">#{booking.booking_code}</span>
                  <button
                    type="button"
                    className="lookup-oh-copy-btn"
                    onClick={() => handleCopyCode(booking.booking_code)}
                    title="Sao chép mã đơn hàng"
                  >
                    <i className="fa-regular fa-copy"></i>
                    <span>Sao chép</span>
                  </button>
                </div>

                {booking.created_at && (
                  <div className="lookup-oh-date">
                    <i className="fa-regular fa-calendar-check"></i>
                    <span>Ngày đặt: {formatDate(booking.created_at)}</span>
                  </div>
                )}
              </div>

              <div className="lookup-oh-right">
                <BookingStatusBadge status={booking.status} />

                <button
                  type="button"
                  className="lookup-btn-reset"
                  onClick={handleResetSearch}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>Tra cứu mã khác</span>
                </button>
              </div>
            </div>

            {/* Lưới chi tiết 2 cột sang trọng */}
            <div className="lookup-dashboard-grid">
              {/* Cột chính (Trái) */}
              <div className="lookup-col-main">
                {/* Thẻ Vé Điện Tử QR Check-in */}
                <TicketQRCode
                  bookingCode={booking.booking_code}
                  tourTitle={booking.tour?.title}
                  startDate={formatDate(booking.tour?.start_date)}
                  customerName={booking.contact?.full_name}
                  booking={booking}
                />

                {/* Thông tin Chuyến đi & Tour */}
                <BookingTripInfo
                  tour={booking.tour}
                  passengersCount={booking.passengers?.length || 0}
                  createdAt={booking.created_at}
                />

                {/* Danh sách hành khách */}
                <BookingPassengerList passengers={booking.passengers} />
              </div>

              {/* Cột phụ (Phải) */}
              <div className="lookup-col-side">
                {/* Tóm tắt thanh toán & Chi phí */}
                <BookingPaymentSummary
                  payment={booking.payment}
                  pricing={booking.pricing}
                  status={booking.status}
                />

                {/* Thông tin người liên hệ */}
                <BookingContactInfo
                  contact={booking.contact}
                  note={booking.note}
                />

                {/* Card Hỗ trợ & Lưu ý chuyến đi */}
                <div className="lookup-support-card">
                  <div className="lookup-sc-header">
                    <i className="fa-solid fa-circle-question lookup-sc-icon"></i>
                    <h4 className="lookup-sc-title">Bạn Cần Trợ Giúp?</h4>
                  </div>

                  <p className="lookup-sc-body">
                    Nếu quý khách cần điều chỉnh thông tin hành khách hoặc có bất kỳ câu hỏi nào về điểm tập trung,
                    đội ngũ chăm sóc khách hàng luôn sẵn sàng phục vụ.
                  </p>

                  <div className="lookup-sc-list">
                    <div className="lookup-sc-item">
                      <i className="fa-solid fa-phone"></i>
                      <span>Hotline 24/7: </span>
                      <a href="tel:19006868" className="lookup-sc-link">1900 6868</a>
                    </div>

                    <div className="lookup-sc-item">
                      <i className="fa-solid fa-envelope"></i>
                      <span>Email: </span>
                      <a href="mailto:support@vietroute.vn" className="lookup-sc-link">support@vietroute.vn</a>
                    </div>
                  </div>

                  <div className="lookup-sc-note">
                    <i className="fa-solid fa-clock"></i> Quý khách vui lòng có mặt tại điểm đón trước 30 phút so với giờ khởi hành để hoàn tất thủ tục check-in.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Quét Mã QR Camera & File Ảnh */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedCode) => {
          setInputCode(scannedCode);
          navigate(`/booking/lookup/${encodeURIComponent(scannedCode)}`);
        }}
      />
    </div>
  );
}
