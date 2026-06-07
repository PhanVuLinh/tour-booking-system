import { useState } from "react";
import { Breadcrumb } from "../../../shared";
import { useNavigate } from "react-router-dom";

function TourDetail() {
  const navigate = useNavigate();

  // ================= 1. DỮ LIỆU ĐỘNG VỚI ẢNH THẬT ================= //
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

  const galleryThumbnails = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=100",
      alt: "Hà Nội",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=100",
      alt: "Ninh Bình",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=100",
      alt: "Hạ Long Flycam",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=100",
      alt: "Sapa",
    },
  ];

  const itineraries = [
    {
      id: 1,
      dayTitle: "NGÀY 1 | TP.HCM - THỦ ĐÔ HÀ NỘI",
      morning:
        "HDV TOPTEN TRAVEL® Đón Quý Khách tại sân bay Tân Sơn Nhất làm thủ tục check in cho đoàn đi Hà Nội (Quý Khách vui lòng có mặt ở sân bay trước 2 tiếng so với giờ bay). Đến sân bay Hà Nội - Xe và HDV đón Đoàn đưa về Khách sạn nghỉ ngơi. Đoàn dùng bữa trưa tại Nhà Hàng.",
      afternoon:
        "Tham quan Viếng Chùa Trấn Quốc - Ngôi chùa Trấn Bắc cổ kính nhất Việt Nam với 1.500 năm tuổi nằm trên bán đảo cồn Quy linh thiêng, với truyền thuyết và huyền thoại về Hồ Tây, hồ Trúc Bạch. Đến Ngọc Sơn, Cầu Thê Húc, hồ Hoàn Kiếm - Trực tiếp chứng kiến cụ Rùa dài 2,1m, ngang 1,2m được trưng bày tại đền Ngọc Sơn. Văn Miếu Quốc Tử Giám - Nơi được xem như Trường Đại học đầu tiên của Việt Nam với 82 tấm bia Tiến sỹ còn lưu danh sử sách.",
      evening:
        "Đoàn dùng cơm tối tại nhà hàng. Đoàn tự do nghỉ ngơi hoặc dạo chơi thăm phố cổ Hà Nội, dạo Hồ Gươm, mua sắm tại Chợ đêm Hà Nội sầm uất...",
      image:
        "https://images.unsplash.com/photo-1599708153386-62b1dfafc192?auto=format&fit=crop&w=1200&q=100",
      imageAlt: "Góc phố Thủ Đô Hà Nội",
    },
    {
      id: 2,
      dayTitle: "NGÀY 2 | HÀ NỘI - NINH BÌNH - HẠ LONG",
      morning:
        "Quý khách dùng điểm tâm sáng. Xe đưa đoàn khởi hành đi Ninh Bình. Đến Ninh Bình đoàn tham quan Quần thể Danh thắng Tràng An...",
      afternoon:
        "Rời Ninh Bình, đoàn di chuyển về Vịnh Hạ Long. Đến nơi, Quý khách nhận phòng khách sạn nghỉ ngơi.",
      evening:
        "Đoàn dùng cơm tối. Tự do dạo chơi Hạ Long về đêm, khám phá chợ đêm hoặc đi dạo dọc bờ biển...",
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=100",
      imageAlt: "Tràng An Ninh Bình",
    },
    // Bạn có thể tiếp tục copy thêm obj cho Ngày 3, Ngày 4 vào đây
  ];

  // --- MẢNG DỮ LIỆU NGÀY KHỞI HÀNH ---
  const availableDates = [
    { id: 1, dayMonth: "11/07", year: "2026", priceLabel: "10tr" },
    { id: 2, dayMonth: "18/07", year: "2026", priceLabel: "10tr" },
    { id: 3, dayMonth: "25/07", year: "2026", priceLabel: "10tr" },
    { id: 4, dayMonth: "01/08", year: "2026", priceLabel: "10tr" },
    { id: 5, dayMonth: "08/08", year: "2026", priceLabel: "10tr" },
    { id: 6, dayMonth: "15/08", year: "2026", priceLabel: "10tr" },
    { id: 7, dayMonth: "22/08", year: "2026", priceLabel: "10tr" },
    { id: 8, dayMonth: "29/08", year: "2026", priceLabel: "10tr" },
  ];

  // ================= 2. LOGIC XỬ LÝ ================= //
  const [mainImage, setMainImage] = useState(galleryThumbnails[0].src);

  // State lưu trữ ngày đang được chọn (Mặc định chọn ngày id = 7)
  const [selectedDate, setSelectedDate] = useState(availableDates[6]);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const priceAdult = 10000000;
  const priceChild = 7990000;
  const priceInfant = 5990000;

  const totalPrice =
    adults * priceAdult + children * priceChild + infants * priceInfant;

  const formatPriceTotal = (price) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  const handleBooking = () => {
    // Chuyển sang trang /booking và mang theo dữ liệu (state)
    navigate("/booking", {
      state: {
        adults,
        children,
        infants,
        selectedDate,
        totalPrice,
      },
    });
  };
  // ================= 3. RENDER GIAO DIỆN ================= //
  return (
    <div className="tour-detail-page">
      <Breadcrumb
        title={breadcrumbData.title}
        list={breadcrumbData.list}
        image={breadcrumbData.image}
      />

      <div className="container">
        <div className="tour-detail-layout">
          {/* CỘT TRÁI: THÔNG TIN */}
          <div className="tour-detail-left">
            <div className="tour-gallery">
              <img
                key={mainImage}
                src={mainImage}
                alt="Main"
                className="gallery-main-img"
              />
              <div className="gallery-thumbnails">
                {galleryThumbnails.map((thumb) => (
                  <img
                    key={thumb.id}
                    src={thumb.src}
                    alt={thumb.alt}
                    onClick={() => setMainImage(thumb.src)}
                    className={mainImage === thumb.src ? "active" : ""}
                  />
                ))}
              </div>
            </div>

            <div className="detail-box">
              <h2 className="box-title">Thông Tin Tour</h2>
              <p className="box-desc">
                Nói về dịch vụ, chắc chắn rồi, với một tiêu chí của một khách
                sạn 5 sao đẳng cấp...
              </p>
            </div>

            <div className="detail-box">
              <h2 className="box-title">Lịch Trình Tour</h2>
              <div className="itinerary-timeline">
                {itineraries.map((item) => (
                  <div className="timeline-item" key={item.id}>
                    <div className="timeline-day">{item.dayTitle}</div>
                    <div className="timeline-content">
                      {item.morning && (
                        <p>
                          <strong>Sáng: </strong> {item.morning}
                        </p>
                      )}
                      {item.afternoon && (
                        <p>
                          <strong>Chiều: </strong> {item.afternoon}
                        </p>
                      )}
                      {item.evening && (
                        <p>
                          <strong>Tối: </strong> {item.evening}
                        </p>
                      )}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="timeline-img"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: ĐẶT TOUR */}
          <aside className="tour-detail-right">
            <div className="booking-box">
              <h3 className="booking-title">Chuyến Đi Của Bạn</h3>

              <div className="booking-mini-card">
                <img
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=80&h=60&q=80"
                  alt="Tour mini"
                />
                <div className="mini-card-info">
                  <h4>Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa |...</h4>
                  <div className="stars">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <span>500 lượt đánh giá</span>
                  </div>
                </div>
              </div>

              <ul className="booking-meta">
                <li>
                  <i className="fa-solid fa-ticket"></i> Mã Tour:{" "}
                  <strong>28T00001</strong>
                </li>
                <li>
                  <i className="fa-regular fa-clock"></i> Thời Gian:{" "}
                  <strong>6 Ngày 5 Đêm</strong>
                </li>
                <li>
                  <i className="fa-solid fa-bus"></i> Phương Tiện:{" "}
                  <strong>Ô tô 45 chỗ</strong>
                </li>
                {/* Ngày khởi hành thay đổi theo lựa chọn ở dưới */}
                <li>
                  <i className="fa-regular fa-calendar"></i> Khởi Hành:{" "}
                  <strong>
                    {selectedDate.dayMonth}/{selectedDate.year}
                  </strong>
                </li>
              </ul>

              <div className="booking-form">
                <div className="form-group">
                  <label>Khởi Hành Tại:</label>
                  <select defaultValue="hanoi">
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                  </select>
                </div>

                {/* --- LƯỚI CHỌN NGÀY KHỞI HÀNH ĐỘNG --- */}
                <div className="form-group">
                  <label className="section-label">Ngày Khởi Hành</label>
                  <div className="date-grid-options">
                    {availableDates.map((item) => (
                      <div
                        key={item.id}
                        className={`date-card ${selectedDate.id === item.id ? "active" : ""}`}
                        onClick={() => setSelectedDate(item)}
                      >
                        <span className="d-date">{item.dayMonth}</span>
                        <span className="d-year">{item.year}</span>
                        <hr className="d-divider" />
                        <span className="d-price">{item.priceLabel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- CHỌN SỐ LƯỢNG KHÁCH (NÚT + -) --- */}
                <div className="passenger-section">
                  <label className="section-label">Số người</label>

                  {/* Người lớn */}
                  <div className="passenger-row-modern">
                    <div className="p-info">
                      <span className="p-name">Người lớn</span>
                      <span className="p-subprice">
                        {formatPriceTotal(priceAdult)}
                      </span>
                    </div>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          setAdults((prev) => Math.max(1, prev - 1))
                        }
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => prev + 1)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  {/* Trẻ em */}
                  <div className="passenger-row-modern">
                    <div className="p-info">
                      <span className="p-name">Trẻ em</span>
                      <span className="p-subprice">
                        {formatPriceTotal(priceChild)}
                      </span>
                    </div>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          setChildren((prev) => Math.max(0, prev - 1))
                        }
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => prev + 1)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  {/* Em bé */}
                  <div className="passenger-row-modern">
                    <div className="p-info">
                      <span className="p-name">Em bé</span>
                      <span className="p-subprice">
                        {formatPriceTotal(priceInfant)}
                      </span>
                    </div>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          setInfants((prev) => Math.max(0, prev - 1))
                        }
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants((prev) => prev + 1)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="booking-total">
                  <span>Tổng cộng:</span>
                  <strong>{formatPriceTotal(totalPrice)}</strong>
                </div>

                <button className="btn-add-cart" onClick={handleBooking}>
                  Đặt tour ngay
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default TourDetail;
