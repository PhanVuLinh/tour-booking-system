import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "../../../shared"; // Đảm bảo đường dẫn này đúng với project của bạn

// Component con xử lý giao diện từng hành khách (Đóng/Mở accordion)
const PassengerCard = ({ type, index, isAdult }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`passenger-card-wrapper ${isOpen ? "open" : ""}`}>
      <div className="pc-index">#{index}</div>

      <div className="pc-content">
        <div
          className={`pc-collapsed ${isOpen ? "hidden" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          <span className="pc-label">
            {type} <span className="text-red">(*)</span>
          </span>
          <span className="pc-action text-red">Nhập thông tin &rarr;</span>
        </div>

        <div className={`pc-panel ${isOpen ? "open" : ""}`}>
          <div className="pc-panel-inner">
            <div
              className="pc-expanded-header"
              onClick={() => setIsOpen(false)}
            >
              <span className="pc-label">
                {type} <span className="text-red">(*)</span>
              </span>
              <span className="pc-action text-gray">Thu gọn &uarr;</span>
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Họ tên <span className="text-red">(*)</span>
              </label>
              <input
                type="text"
                className="b-input"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div className="form-group-flex">
              <div className="form-group">
                <label className="form-label">
                  Ngày sinh <span className="text-red">(*)</span>
                </label>
                <input type="date" className="b-input" />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Giới tính <span className="text-red">(*)</span>
                </label>
                <select className="b-input" defaultValue="Nam">
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
            </div>

            {isAdult && (
              <div className="form-group full-width">
                <label className="form-label">
                  Số điện thoại <span className="text-red">(*)</span>
                </label>
                <input
                  type="text"
                  className="b-input"
                  placeholder="Ví dụ: 0901234567"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
      {
        title: "Đặt tour",
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

  const [adultCount, setAdultCount] = useState(adults);
  const [childCount, setChildCount] = useState(children);
  const [toddlerCount, setToddlerCount] = useState(1);
  const [infantCount, setInfantCount] = useState(infants);

  // Hàm xử lý tăng/giảm số lượng
  const updatePassenger = (type, action) => {
    if (type === "adult") {
      setAdultCount((prev) =>
        action === "add" ? prev + 1 : Math.max(1, prev - 1),
      );
    } else if (type === "child") {
      setChildCount((prev) =>
        action === "add" ? prev + 1 : Math.max(0, prev - 1),
      );
    } else if (type === "toddler") {
      setToddlerCount((prev) =>
        action === "add" ? prev + 1 : Math.max(0, prev - 1),
      );
    } else if (type === "infant") {
      setInfantCount((prev) =>
        action === "add" ? prev + 1 : Math.max(0, prev - 1),
      );
    }
  };

  const priceAdult = 10000000;
  const priceChild = 7990000;
  const priceToddler = 6990000; // Giá giả định cho Trẻ nhỏ
  const priceInfant = 5990000;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " đ";

  const subtotal = useMemo(() => {
    return (
      adultCount * priceAdult +
      childCount * priceChild +
      toddlerCount * priceToddler +
      infantCount * priceInfant
    );
  }, [adultCount, childCount, toddlerCount, infantCount]);

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

  // Render từng nhóm hành khách theo giao diện mới
  const renderPassengerGroup = (type, count, isAdult, subtitle) => {
    if (count === 0) return null;

    return (
      <div className="passenger-group" key={type}>
        <div className="pg-header">
          <i className="fa-solid fa-user-group pg-icon"></i>
          <span className="pg-title">{type}</span>
          <span className="pg-subtitle">{subtitle}</span>
        </div>

        <div className="pg-list">
          {Array.from({ length: count }).map((_, i) => (
            <PassengerCard
              key={`${type}-${i}`}
              type={type}
              index={i + 1} // Đánh số lại từ 1 cho mỗi nhóm
              isAdult={isAdult}
            />
          ))}
        </div>
      </div>
    );
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
        </div>

        <div className="booking-layout">
          <div className="b-left">
            <div className="b-box contact-box">
              <h3>Thông tin liên lạc</h3>

              <div className="login-banner blue-banner">
                <i className="fa-solid fa-circle-user"></i>
                <span>
                  <a href="#" className="login-link">
                    Đăng nhập
                  </a>{" "}
                  để nhận ưu đãi, tích điểm và quản lý đơn hàng dễ dàng hơn!
                </span>
              </div>

              <div className="b-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Họ tên <span className="text-red">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Số điện thoại <span className="text-red">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: 0901234567"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span className="text-red">(*)</span>
                  </label>
                  <input
                    type="email"
                    className="b-input"
                    placeholder="Ví dụ: email@travelgo.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: 190 Pasteur, Phường Xuân Hòa, TP.HCM"
                  />
                </div>
              </div>
            </div>

            {/* Khối chọn số lượng Hành khách (mới thêm) */}
            <div className="b-box passenger-quantity-box">
              <h3>Hành khách</h3>

              <div className="pq-grid">
                {/* Người lớn */}
                <div className="pq-item">
                  <div className="pq-info">
                    <div className="pq-name">Người lớn</div>
                    <div className="pq-desc">
                      Từ 12 tuổi trở lên{" "}
                      <i className="fa-solid fa-circle-info"></i>
                    </div>
                  </div>
                  <div className="pq-stepper">
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("adult", "sub")}
                      disabled={adultCount <= 1}
                    >
                      -
                    </button>
                    <span className="pq-count">{adultCount}</span>
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("adult", "add")}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Trẻ em */}
                <div className="pq-item">
                  <div className="pq-info">
                    <div className="pq-name">Trẻ em</div>
                    <div className="pq-desc">
                      Từ 5 - 11 tuổi <i className="fa-solid fa-circle-info"></i>
                    </div>
                  </div>
                  <div className="pq-stepper">
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("child", "sub")}
                      disabled={childCount <= 0}
                    >
                      -
                    </button>
                    <span className="pq-count">{childCount}</span>
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("child", "add")}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Trẻ nhỏ */}
                <div className="pq-item">
                  <div className="pq-info">
                    <div className="pq-name">Trẻ nhỏ</div>
                    <div className="pq-desc">
                      Từ 2 - 4 tuổi <i className="fa-solid fa-circle-info"></i>
                    </div>
                  </div>
                  <div className="pq-stepper">
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("toddler", "sub")}
                      disabled={toddlerCount <= 0}
                    >
                      -
                    </button>
                    <span className="pq-count">{toddlerCount}</span>
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("toddler", "add")}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Em bé */}
                <div className="pq-item">
                  <div className="pq-info">
                    <div className="pq-name">Em bé</div>
                    <div className="pq-desc">
                      Dưới 2 tuổi <i className="fa-solid fa-circle-info"></i>
                    </div>
                  </div>
                  <div className="pq-stepper">
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("infant", "sub")}
                      disabled={infantCount <= 0}
                    >
                      -
                    </button>
                    <span className="pq-count">{infantCount}</span>
                    <button
                      type="button"
                      className="pq-btn"
                      onClick={() => updatePassenger("infant", "add")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="b-box passenger-box">
              <h3>Thông tin hành khách</h3>

              {renderPassengerGroup(
                "Người lớn",
                adultCount,
                1,
                true,
                "(Người lớn sinh trước ngày 25/06/2014)",
              )}
              {renderPassengerGroup(
                "Trẻ em",
                childCount,
                adultCount + 1,
                false,
                "(Từ 5 - 11 tuổi)",
              )}
              {renderPassengerGroup(
                "Trẻ nhỏ",
                toddlerCount,
                adultCount + childCount + 1,
                false,
                "(Từ 2 - 4 tuổi)",
              )}
              {renderPassengerGroup(
                "Em bé",
                infantCount,
                adultCount + childCount + toddlerCount + 1,
                false,
                "(Dưới 2 tuổi)",
              )}
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
                      {adultCount} x {formatPrice(priceAdult)}
                    </span>
                  </div>
                  <div className="spd-right">
                    <strong>{formatPrice(adultCount * priceAdult)}</strong>
                  </div>
                </div>

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

                <div className="spd-row">
                  <div className="spd-left">
                    <span className="spd-name">Em bé</span>
                    <span className="spd-meta">
                      {toddlerCount} x {formatPrice(priceToddler)}
                    </span>
                  </div>
                  <div className="spd-right">
                    <strong>{formatPrice(toddlerCount * priceToddler)}</strong>
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
