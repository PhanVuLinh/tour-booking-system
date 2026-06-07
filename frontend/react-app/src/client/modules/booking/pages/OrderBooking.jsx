import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "../../../shared";

function OrderBooking() {
  const location = useLocation();

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
    duration = "6 Ngày 5 Đêm",
    tourTitle = "Tour Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5Đ",
    tourImage = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
  } = location.state || {};

  const priceAdult = 10000000;
  const priceChild = 7990000;
  const priceInfant = 5990000;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " đ";

  const subtotal = useMemo(() => {
    return adults * priceAdult + children * priceChild + infants * priceInfant;
  }, [adults, children, infants]);

  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setDiscountAmount(0);
      return;
    }

    if (code === "GIAM10") {
      setDiscountAmount(Math.min(subtotal * 0.1, subtotal));
      return;
    }

    if (code === "GIAM500K") {
      setDiscountAmount(Math.min(500000, subtotal));
      return;
    }

    setDiscountAmount(0);
    alert("Mã giảm giá không hợp lệ");
  };

  const finalPrice = Math.max(subtotal - discountAmount, 0);

  const renderPassengerForms = (type, count, startIndex) => {
    const forms = [];

    for (let i = 0; i < count; i++) {
      forms.push(
        <div className="p-form-card" key={`${type}-${i}`}>
          <div className="p-form-header">
            <h4>
              #{startIndex + i} {type} (*)
            </h4>
          </div>

          <div className="p-form-grid">
            <div className="form-group full-width">
              <label>Họ tên (*)</label>
              <input
                type="text"
                className="b-input"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div className="form-group-flex">
              <div className="form-group w-60">
                <label>Ngày sinh (*)</label>
                <input type="date" className="b-input" />
              </div>

              <div className="form-group w-40">
                <label>Giới tính (*)</label>
                <select className="b-input" defaultValue="Nam">
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
            </div>

            {type === "Người lớn" && (
              <div className="form-group full-width">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="b-input"
                  placeholder="Ví dụ: 0901234567"
                />
              </div>
            )}
          </div>
        </div>,
      );
    }

    return forms;
  };

  return (
    <div className="booking-page-wrapper">
      <Breadcrumb
        title={breadcrumbData.title}
        list={breadcrumbData.list}
        image={breadcrumbData.image}
      />

      <div className="b-container">
        <div className="b-page-title">
          <h2>Đặt tour của bạn</h2>
          <p>
            Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính xác
            trước khi tiến hành thanh toán.
          </p>
        </div>

        <div className="booking-stepper-wrap">
          <div className="b-stepper">
            <div className="step active">
              <span className="step-num">1</span> Nhập thông tin
            </div>
            <i className="fa-solid fa-chevron-right step-arrow"></i>
            <div className="step">
              <span className="step-num">2</span> Thanh toán
            </div>
            <i className="fa-solid fa-chevron-right step-arrow"></i>
            <div className="step">
              <span className="step-num">3</span> Hoàn tất
            </div>
          </div>
        </div>

        <div className="booking-layout">
          <div className="b-left">
            <div className="b-box contact-box">
              <h3>Thông tin liên lạc</h3>

              <div className="login-banner">
                <i className="fa-solid fa-circle-user"></i>
                <span>
                  <strong>Đăng nhập</strong> để nhận ưu đãi, tích điểm và quản
                  lý đơn hàng dễ dàng hơn!
                </span>
              </div>

              <div className="b-grid-2">
                <div className="form-group">
                  <label>
                    Họ tên <span>(*)</span>
                  </label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Số điện thoại <span>(*)</span>
                  </label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: 0901234567 / +84901234567"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Email <span>(*)</span>
                  </label>
                  <input
                    type="email"
                    className="b-input"
                    placeholder="Ví dụ: email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: 190 Pasteur, Phường Xuân Hòa, TP.HCM"
                  />
                </div>
              </div>
            </div>

            <div className="b-box">
              <h3>Thông tin hành khách</h3>
              {renderPassengerForms("Người lớn", adults, 1)}
              {renderPassengerForms("Trẻ em", children, adults + 1)}
              {renderPassengerForms("Em bé", infants, adults + children + 1)}
            </div>

            <div className="b-box">
              <h3>Ghi chú</h3>
              <p className="box-subtext">
                Vui lòng cho chúng tôi biết nếu Quý khách có ghi chú hoặc yêu
                cầu đặc biệt.
              </p>
              <textarea
                className="b-input"
                rows="4"
                placeholder="Ví dụ: Bữa ăn chay, đến muộn,..."
              ></textarea>
            </div>
          </div>

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

                <div className="spd-row">
                  <div className="spd-left">
                    <span className="spd-name">Người lớn</span>
                    <span className="spd-meta">
                      {adults} x {formatPrice(priceAdult)}
                    </span>
                  </div>
                  <div className="spd-right">
                    <strong>{formatPrice(adults * priceAdult)}</strong>
                  </div>
                </div>

                <div className="spd-row">
                  <div className="spd-left">
                    <span className="spd-name">Trẻ em</span>
                    <span className="spd-meta">
                      {children} x {formatPrice(priceChild)}
                    </span>
                  </div>
                  <div className="spd-right">
                    <strong>{formatPrice(children * priceChild)}</strong>
                  </div>
                </div>

                <div className="spd-row">
                  <div className="spd-left">
                    <span className="spd-name">Em bé</span>
                    <span className="spd-meta">
                      {infants} x {formatPrice(priceInfant)}
                    </span>
                  </div>
                  <div className="spd-right">
                    <strong>{formatPrice(infants * priceInfant)}</strong>
                  </div>
                </div>
              </div>

              <div className="b-divider"></div>

              <div className="checkout-section">
                <div className="promo-box">
                  <div className="promo-input-group">
                    <input
                      type="text"
                      className="promo-input"
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

                <button
                  type="button"
                  className="btn-checkout"
                  onClick={() => alert("Đã chốt thanh toán")}
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderBooking;
