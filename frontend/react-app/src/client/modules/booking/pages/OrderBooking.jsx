import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "../../../shared";

import { Step1Info, Step2Payment, BookingStepper } from "../components";

function OrderBooking() {
  const location = useLocation();

  // STATE QUẢN LÝ BƯỚC HIỆN TẠI (1: Nhập thông tin, 2: Thanh toán)
  const [currentStep, setCurrentStep] = useState(1);

  const breadcrumbData = {
    title: "Tour Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5Đ",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
    list: [
      { url: "/", title: "Trang Chủ" },
      { url: "/tours", title: "Tour Trong Nước" },
      { url: "#", title: "Tour Miền Bắc" },
      {
        url: "#",
        title: "Tour Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5Đ",
      },
      { title: "Đặt tour" },
    ],
  };

  const {
    adults = 1,
    children = 0,
    infants = 0,
    selectedDate = { dayMonth: "22/08", year: "2026" },
    tourCode = "28T00001",
    transport = "Ô tô 45 chỗ",
    departure = "Hà Nội",
    tourTitle = "Tour Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5Đ",
    tourImage = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
  } = location.state || {};

  const [adultCount, setAdultCount] = useState(adults);
  const [childCount, setChildCount] = useState(children);
  const [infantCount, setInfantCount] = useState(infants);

  const updatePassenger = (type, action) => {
    if (type === "adult")
      setAdultCount((prev) =>
        action === "add" ? prev + 1 : Math.max(1, prev - 1),
      );
    else if (type === "child")
      setChildCount((prev) =>
        action === "add" ? prev + 1 : Math.max(0, prev - 1),
      );
    else if (type === "infant")
      setInfantCount((prev) =>
        action === "add" ? prev + 1 : Math.max(0, prev - 1),
      );
  };

  const priceAdult = 10000000;
  const priceChild = 7990000;
  const priceInfant = 5990000;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " đ";

  const subtotal = useMemo(() => {
    return (
      adultCount * priceAdult +
      childCount * priceChild +
      infantCount * priceInfant
    );
  }, [adultCount, childCount, infantCount]);

  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return setDiscountAmount(0);
    if (code === "GIAM10")
      return setDiscountAmount(Math.min(subtotal * 0.1, subtotal));
    if (code === "GIAM500K")
      return setDiscountAmount(Math.min(500000, subtotal));
    setDiscountAmount(0);
    alert("Mã giảm giá không hợp lệ");
  };

  const finalPrice = Math.max(subtotal - discountAmount, 0);

  // LOGIC ĐIỀU HƯỚNG NÚT BẤM CỘT PHẢI
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2); // Tráo đổi giao diện sang bước 2
      window.scrollTo(0, 0); // Cuộn lên đầu trang mượt mà
    } else if (currentStep === 2) {
      alert("Xử lý kích hoạt API đặt đơn và thanh toán cổng ngân hàng...");
    }
  };

  return (
    <div className="booking-page-wrapper">
      <Breadcrumb
        title={breadcrumbData.title}
        list={breadcrumbData.list}
        image={breadcrumbData.image}
      />

      <div className="b-container">
        <div className="b-page-header-flex">
          <div className="b-page-title">
            <h2>Đặt tour của bạn</h2>
            <p>
              Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính xác
              trước khi tiến hành thanh toán.
            </p>
          </div>

          {/* THANH TIẾN TRÌNH ĐỘNG DỰA THEO currentStep */}
          <BookingStepper currentStep={currentStep} />
        </div>

        <div className="booking-layout">
          {/* CỘT TRÁI: THAY ĐỔI RUỘT ĐỘNG THEO TRẠNG THÁI currentStep */}
          <div className="b-left">
            {currentStep === 1 && (
              <Step1Info
                adultCount={adultCount}
                childCount={childCount}
                infantCount={infantCount}
                updatePassenger={updatePassenger}
              />
            )}
            {currentStep === 2 && <Step2Payment />}
          </div>

          {/* CỘT PHẢI: GIỮ NGUYÊN (CHỈ ĐỔI TEXT NÚT BẤM) */}
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
                  <strong>
                    {selectedDate.dayMonth}/{selectedDate.year}
                  </strong>
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
                    : "Xác nhận thanh toán"}
                </button>

                {/* Nút quay lại bổ sung ở Bước 2 để tăng trải nghiệm người dùng */}
                {currentStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{
                      width: "100%",
                      marginTop: "12px",
                      background: "transparent",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    &larr; Quay lại chỉnh sửa thông tin hành khách
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderBooking;
