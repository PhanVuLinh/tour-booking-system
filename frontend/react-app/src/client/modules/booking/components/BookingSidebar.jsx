import moment from "moment";

function BookingSidebar({
  tourImage,
  tourTitle,
  tourCode,
  transport,
  departure,
  selectedDate,

  adultCount,
  childCount,
  infantCount,

  priceAdult,
  priceChild,
  priceInfant,

  subtotal,
  discountAmount,
  finalPrice,

  promoCode,
  setPromoCode,

  formatPrice,
  currentStep,

  handleApplyPromo,
  handleNextStep,
  handleBackStep,
}) {
  return (
    <aside className="b-right">
      <div className="b-box sticky-box">
        <h3 className="booking-title">Chuyến đi của bạn</h3>
        <div className="summary-tour-card">
          <img src={tourImage} alt={tourTitle} />
          <div className="st-info">
            <h4>{tourTitle}</h4>
            <p className="tour-code">Mã tour: {tourCode}</p>
          </div>
        </div>

        <ul className="booking-meta-mini">
          <li>
            <span>Phương tiện:</span> <strong>{transport}</strong>
          </li>
          <li>
            <span>Ngày khởi hành:</span>{" "}
            <strong>{moment(selectedDate).format("DD/MM/YYYY")}</strong>
          </li>
          <li>
            <span>Khởi hành tại:</span> <strong>{departure}</strong>
          </li>
        </ul>

        <div className="summary-price-details">
          <div className="spd-head">Số lượng hành khách</div>
          {adultCount > 0 && (
            <div className="spd-row">
              <div className="spd-left">
                <span className="spd-name">Người lớn</span>
                <span className="spd-meta">
                  {adultCount} x {formatPrice(priceAdult)}
                </span>
              </div>
              <div className="spd-right">
                <strong>{formatPrice(adultCount * priceAdult)}</strong>
              </div>
            </div>
          )}
          {childCount > 0 && (
            <div className="spd-row">
              <div className="spd-left">
                <span className="spd-name">Trẻ em</span>
                <span className="spd-meta">
                  {childCount} x {formatPrice(priceChild)}
                </span>
              </div>
              <div className="spd-right">
                <strong>{formatPrice(childCount * priceChild)}</strong>
              </div>
            </div>
          )}
          {infantCount > 0 && (
            <div className="spd-row">
              <div className="spd-left">
                <span className="spd-name">Em bé</span>
                <span className="spd-meta">
                  {infantCount} x {formatPrice(priceInfant)}
                </span>
              </div>
              <div className="spd-right">
                <strong>{formatPrice(infantCount * priceInfant)}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="b-divider"></div>

        <div className="checkout-section">
          <div className="promo-box">
            <div className="promo-input-group">
              <input
                type="text"
                className="promo-input-coupon"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
              />
              <button
                type="button"
                className="btn-apply"
                onClick={handleApplyPromo}
              >
                Dùng mã
              </button>
            </div>
          </div>

          <div className="price-summary">
            <div className="price-item">
              <span>Tổng tiền:</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="price-item">
              <span>Giảm:</span>
              <strong className="discount-price">
                {discountAmount > 0
                  ? `- ${formatPrice(discountAmount)}`
                  : formatPrice(0)}
              </strong>
            </div>
            <div className="booking-total">
              <span>Thanh toán:</span>
              <strong>{formatPrice(finalPrice)}</strong>
            </div>
          </div>

          {/* Chữ hiển thị nút bấm thay đổi linh động dựa theo Bước */}
          <button
            type="button"
            className="btn-checkout"
            onClick={handleNextStep}
          >
            {currentStep === 1
              ? "Tiến hành thanh toán"
              : currentStep === 2
                ? "Xác nhận thanh toán"
                : "Về trang chủ"}
          </button>
          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleBackStep}
              style={{
                width: "100%",
                marginTop: "12px",
                background: "transparent",
                border: "none",
                color: "#666",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ← Quay lại chỉnh sửa thông tin hành khách
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default BookingSidebar;
