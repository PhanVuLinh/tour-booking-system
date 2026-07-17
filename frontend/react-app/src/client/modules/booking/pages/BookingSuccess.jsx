import moment from "moment";
import { useEffect } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { toast } from "sonner";

export default function BookingSuccess() {
  const contextData = useOutletContext();
  const location = useLocation();
  const bookingState = location.state || {};

  const formData = contextData?.formData || bookingState.formData || {};
  const contactInfo = formData?.contact || {};
  const selectedDate = bookingState.selectedDate || {};
  const tour = bookingState.tour || {};

  const adultCount =
    contextData?.adultCount || bookingState.passengers?.adults || 0;
  const childCount =
    contextData?.childCount || bookingState.passengers?.children || 0;
  const infantCount =
    contextData?.infantCount || bookingState.passengers?.infants || 0;

  const subtotal = Number(bookingState.subtotal) || 0;
  const discount = Number(bookingState.discount) || 0;
  const total = Number(bookingState.total) || 0;
  const payableAmount = Number(bookingState.payableAmount) || total;
  const remainingAmount = Number(bookingState.remainingAmount) || 0;
  const paymentType = contextData?.paymentType || bookingState.paymentType;
  const bookingCode = bookingState.bookingCode || "Đang cập nhật";

  useEffect(() => {
    const toastKey = `booking-success-toast-${bookingCode}`;
    if (bookingCode && !sessionStorage.getItem(toastKey)) {
      toast.success("Đặt tour thành công!", {
        description: "Thông tin xác nhận đã được ghi nhận trong hệ thống.",
      });
      sessionStorage.setItem(toastKey, "shown");
    }
  }, [bookingCode]);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("vi-VN") + " đ";

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
    paymentType === "50" ? "Đặt cọc 50%" : "Thanh toán toàn bộ 100%";

  return (
    <div className="step3-success-wrapper">
      <section className="booking-success-panel b-box">
        <div className="success-icon-wrap">
          <i className="fa-solid fa-check"></i>
        </div>

        <h2 className="success-title">Đặt tour thành công!</h2>
        <p className="success-desc">
          Cảm ơn <strong>{contactInfo.fullName || "Quý khách"}</strong> đã tin
          tưởng và đặt tour tại TravelGo. Đơn tour của bạn đã được hệ thống ghi
          nhận và đang chờ xác nhận.
        </p>

        <div className="order-ref-card">
          <span className="ref-label">Mã đơn đặt tour:</span>
          <strong className="ref-number">{bookingCode}</strong>
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
                <strong>{contactInfo.fullName || "Chưa cập nhật"}</strong>
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
                        {passenger.fullName ||
                          `${passenger.label} ${passenger.displayIndex}`}
                      </strong>
                      <span>
                        {passenger.label}
                        {passenger.dob
                          ? ` - Sinh ngày: ${moment(passenger.dob).format("DD/MM/YYYY")}`
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
                <strong>
                  {moment(selectedDate.startDate).format("DD/MM/YYYY")}{" "}
                </strong>
              </div>
              <div className="success-info-row">
                <span>Phương thức:</span>
                <strong>{paymentLabel}</strong>
              </div>
              <div className="success-info-row">
                <span>Trạng thái:</span>
                <strong className="success-warning-text">
                  <i className="fa-solid fa-clock-rotate-left"></i> Chờ xác nhận
                </strong>
              </div>

              <div className="success-divider"></div>

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
              {paymentType === "50" && (
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
                  {formatPrice(payableAmount)}
                </strong>
              </div>
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
