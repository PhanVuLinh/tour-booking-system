import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import { formatDate, formatPrice } from "../../../utils/format.helper";
import {
  getVnPayBookingResultService,
} from "../services";

export default function BookingSuccess() {
  const contextData = useOutletContext();
  const location = useLocation();
  const { id: bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const bookingState = location.state || {};

  const formData =
    bookingData?.formData ||
    contextData?.formData ||
    bookingState.formData ||
    {};
  const contactInfo = formData?.contact || {};
  const selectedDate =
    bookingData?.selectedDate || bookingState.selectedDate || {};
  const tour = bookingData?.tour || bookingState.tour || {};

  const adultCount =
    bookingData?.passengers?.adults ??
    contextData?.adultCount ??
    bookingState.passengers?.adults ??
    0;
  const childCount =
    bookingData?.passengers?.children ??
    contextData?.childCount ??
    bookingState.passengers?.children ??
    0;
  const infantCount =
    bookingData?.passengers?.infants ??
    contextData?.infantCount ??
    bookingState.passengers?.infants ??
    0;

  const subtotal = Number(bookingData?.subtotal ?? bookingState.subtotal) || 0;
  const discount = Number(bookingData?.discount ?? bookingState.discount) || 0;
  const total = Number(bookingData?.total ?? bookingState.total) || 0;
  const payable_amount =
    Number(
      bookingData?.payable_amount ??
      bookingState.payable_amount
    ) || total;
  const remainingAmount =
    Number(bookingData?.remainingAmount ?? bookingState.remainingAmount) || 0;
  const payment_type =
    bookingData?.payment_type ||
    contextData?.payment_type ||
    bookingState.payment_type;
  const booking_code =
    bookingData?.booking_code ||
    bookingState.booking_code ||
    searchParams.get("booking_code") ||
    "Đang cập nhật";
  const payment_status =
    bookingData?.payment_status || bookingState.payment_status;

  useEffect(() => {
    if (!bookingId) return;

    getVnPayBookingResultService(bookingId)
      .then((response) => {
        if (response?.success) setBookingData(response.data);
      })
      .catch(() => {
        toast.error("Không thể tải đầy đủ thông tin đơn hàng");
      });
  }, [bookingId]);



  useEffect(() => {
    const toastKey = `booking-success-toast-${booking_code}`;
    if (booking_code && !sessionStorage.getItem(toastKey)) {
      toast.success("Đặt tour thành công!", {
        description: "Thông tin xác nhận đã được ghi nhận trong hệ thống.",
      });
      sessionStorage.setItem(toastKey, "shown");
    }
  }, [booking_code]);

  // Tính toán trực tiếp không cần dùng useMemo
  const details = formData?.passengerDetails || {};
  const buildRows = (items = [], label) =>
    items.map((passenger, index) => ({
      ...passenger,
      label,
      displayIndex: index + 1,
    }));

  const passengerRows = [
    ...buildRows(details.adults, "Người lớn"),
    ...buildRows(details.children, "Trẻ em"),
    ...buildRows(details.infants, "Em bé"),
  ];

  const totalPassengers = adultCount + childCount + infantCount;
  const paymentLabel =
    payment_type === "50" ? "Đặt cọc 50%" : "Thanh toán toàn bộ 100%";

  return (
    <div className="step3-success-wrapper">
      <section className="booking-success-panel b-box">
        <div className="success-icon-wrap">
          <i className="fa-solid fa-check"></i>
        </div>

        <h2 className="success-title">Đặt tour thành công!</h2>
        <p className="success-desc">
          Cảm ơn <strong>{contactInfo.full_name || "Quý khách"}</strong> đã tin
          tưởng và đặt tour tại TravelGo. Đơn tour của bạn đã được hệ thống ghi
          nhận và đang chờ xác nhận.
        </p>

        <div className="order-ref-card">
          <span className="ref-label">Mã đơn đặt tour:</span>
          <strong className="ref-number">{booking_code}</strong>
        </div>

        <div className="success-card-grid">
          {/* Card Thông tin hành khách */}
          <div className="success-info-card">
            <div className="success-card-title">
              <div className="sct-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3>Thông tin hành khách</h3>
            </div>

            <div className="success-info-list">
              <div className="success-info-row">
                <span>Người liên hệ:</span>
                <strong>{contactInfo.full_name || "Chưa cập nhật"}</strong>
              </div>
              <div className="success-info-row">
                <span>Số điện thoại:</span>
                <strong>{contactInfo.phone || "Chưa cập nhật"}</strong>
              </div>
              <div className="success-info-row">
                <span>Email liên hệ:</span>
                <strong>{contactInfo.email || "Chưa cập nhật"}</strong>
              </div>
              <div className="success-info-row">
                <span>Số lượng:</span>
                <strong>{totalPassengers} khách</strong>
              </div>
              <div className="success-info-row">
                <span>Ghi chú:</span>
                <strong>{formData?.note || "Không có ghi chú"}</strong>
              </div>
            </div>

            <div className="success-passenger-list">
              {passengerRows.length > 0 ? (
                passengerRows.map((passenger, index) => (
                  <div className="success-passenger-item" key={index}>
                    <div className="success-passenger-avatar">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="success-passenger-detail">
                      <strong>
                        {passenger.full_name ||
                          `${passenger.label} ${passenger.displayIndex}`}
                      </strong>
                      <span>
                        {passenger.label}
                        {passenger.dob
                          ? ` - Sinh ngày: ${formatDate(passenger.dob)}`
                          : ""}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="success-empty-text">
                  Chưa có dữ liệu hành khách.
                </p>
              )}
            </div>
          </div>

          {/* Card Thông tin thanh toán */}
          <div className="success-info-card">
            <div className="success-card-title">
              <div className="sct-icon">
                <i className="fa-solid fa-file-invoice-dollar"></i>
              </div>
              <h3>Thông tin thanh toán</h3>
            </div>

            <div className="success-info-list">
              <div className="success-info-row">
                <span>Tên tour:</span>
                <strong className="text-primary">
                  {tour.title || "Chưa cập nhật"}
                </strong>
              </div>
              <div className="success-info-row">
                <span>Khởi hành:</span>
                <strong>{formatDate(selectedDate.start_date)} </strong>
              </div>
              <div className="success-info-row">
                <span>Phương thức:</span>
                <strong>{paymentLabel}</strong>
              </div>
              <div className="success-info-row">
                <span>Trạng thái:</span>
                <strong
                  className={
                    payment_status === "paid"
                      ? "text-success"
                      : "success-warning-text"
                  }
                >
                  <i
                    className={
                      payment_status === "paid"
                        ? "fa-solid fa-circle-check"
                        : "fa-solid fa-clock-rotate-left"
                    }
                  ></i>{" "}
                  {payment_status === "paid" ? "Đã thanh toán" : "Chờ xác nhận"}
                </strong>
              </div>

              <div className="success-divider"></div>

              {/* <div className="success-info-row">
                <span>Tạm tính:</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="success-info-row">
                <span>Khuyến mãi:</span>
                <strong className="text-success">
                  - {formatPrice(discount)}
                </strong>
              </div>
              {payment_type === "50" && (
                <div className="success-info-row">
                  <span>Còn lại phải thu:</span>
                  <strong className="text-warning">
                    {formatPrice(remainingAmount)}
                  </strong>
                </div>
              )}

              <div className="success-total-row">
                <span>Đã thanh toán:</span>
                <strong className="text-red">
                  {formatPrice(payable_amount)}
                </strong>
              </div> */}
              <div className="success-info-row">
                <span>Tạm tính:</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="success-info-row">
                <span>Khuyến mãi:</span>
                <strong className="text-success">
                  - {formatPrice(discount)}
                </strong>
              </div>

              <div className="success-info-row">
                <span>Tổng sau giảm:</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              {payment_type === "50" ? (
                <>
                  <div className="success-info-row">
                    <span>Đặt cọc 50%:</span>
                    <strong className="text-red">
                      {formatPrice(payable_amount)}
                    </strong>
                  </div>

                  <div className="success-info-row">
                    <span>Còn lại phải thu:</span>
                    <strong className="text-warning">
                      {formatPrice(remainingAmount)}
                    </strong>
                  </div>
                </>
              ) : (
                <div className="success-info-row">
                  <span>Thanh toán 100%:</span>
                  <strong className="text-red">
                    {formatPrice(payable_amount)}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="success-actions-flex">
          <Link to="/" className="btn-action btn-outline">
            <i className="fa-solid fa-house"></i> Về trang chủ
          </Link>
          <Link to="/profile/history" className="btn-action btn-fill">
            Xem lịch sử đơn tour <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
