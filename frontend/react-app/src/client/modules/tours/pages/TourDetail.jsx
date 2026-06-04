import { useState } from "react";
import { Breadcrumb } from "../../../shared";

function TourDetail() {
  // ================= 1. DỮ LIỆU ĐỘNG VỚI ẢNH THẬT ================= //

  // Dữ liệu Breadcrumb (Ảnh bìa ngang rộng)
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

  // Mảng dữ liệu thư viện ảnh nhỏ (Thumbnails)
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

  // Mảng dữ liệu Lịch trình Tour (Kèm ảnh thật minh họa từng ngày)
  const itineraries = [
    {
      id: 1,
      dayTitle: "NGÀY 1 | TP.HCM - THỦ ĐÔ HÀ NỘI",
      morning:
        "HDV TOPTEN TRAVEL® Đón Quý Khách tại sân bay Tân Sơn Nhất làm thủ tục check in cho đoàn đi Hà Nội (Quý Khách vui lòng có mặt ở sân bay trước 2 tiếng so với giờ bay. Đến sân bay Hà Nội - Xe và HDV đón Đoàn đưa về Khách sạn nghỉ ngơi. Đoàn dùng bữa trưa tại Nhà Hàng.",
      afternoon:
        "Tham quan Viếng Chùa Trấn Quốc - Ngôi chùa Trấn Bắc cổ kính nhất Việt Nam với 1.500 năm tuổi nằm trên bán đảo cồn Quy linh thiêng, với truyền thuyết và huyền thoại về Hồ Tây, hồ Trúc Bạch. Đến Ngọc Sơn, Cầu Thê Húc, hồ Hoàn Kiếm - Trực tiếp chứng kiến cụ Rùa dài 2,1m, ngang 1,2m được trưng bày tại đền Ngọc Sơn. Văn Miếu Quốc Tử Giám - Nơi được xem như Trường Đại học đầu tiên của Việt Nam với 82 tấm bia Tiến sỹ còn lưu danh sử sách.",
      evening:
        "Đoàn dùng cơm tối tại nhà hàng. Đoàn tự do nghỉ ngơi hoặc dạo chơi thăm phố cổ Hà Nội, dạo Hồ Gươm, mua sắm tại Chợ đêm Hà Nội sầm uất...",
      image:
        "data:image/jpeg;base64,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",
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
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&h=350&q=80",
      imageAlt: "Tràng An Ninh Bình",
    },
    {
      id: 3,
      dayTitle: "NGÀY 3 | HẠ LONG - YÊN TỬ",
      morning:
        "Sáng, đoàn khởi hành đi Yến Tử. Đến nơi, Quý khách tham quan chùa Bái Đính...",
      afternoon:
        "Rời Yến Tử, đoàn di chuyển về Hà Nội. Đến nơi, Quý khách nhận phòng khách sạn nghỉ ngơi.",
      evening:
        "Đoàn dùng cơm tối. Tự do dạo chơi Hạ Long về đêm, khám phá chợ đêm hoặc đi dạo dọc bờ biển...",
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&h=350&q=80",
      imageAlt: "Tràng An Ninh Bình",
    },
  ];

  // ================= 2. LOGIC XỬ LÝ (Tính tiền) ================= //
  const [mainImage, setMainImage] = useState(galleryThumbnails[0].src);

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

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
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
            {/* 1. Thư viện ảnh */}
            <div className="tour-gallery">
              <img
                key={mainImage}
                src={mainImage}
                alt="Main"
                className="gallery-main-img"
              />
              <div className="gallery-thumbnails">
                {/* Lặp mảng ảnh nhỏ */}
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

            {/* 2. Thông tin chung */}
            <div className="detail-box">
              <h2 className="box-title">Thông Tin Tour</h2>
              <p className="box-desc">
                Nói về dịch vụ, chắc chắn rồi, với một tiêu chí của một khách
                sạn 5 sao đẳng cấp, mình tin rằng Indochine Palace đủ để cho bạn
                đánh giá 6 sao. Từ nhà hàng, cà phê, đến trung tâm thể dục thể
                thao hiện đại đến Spa, xông hơi... tất tần tật các dịch vụ mà
                bạn mong muốn đều có ở đây.. Từ nhà hàng, cà phê, đến trung tâm
                thể dục thể thao hiện đại đến Spa, xông hơi... tất tần tật các
                dịch vụ mà bạn mong muốn đều có ở đây..
              </p>
            </div>

            {/* 3. Lịch trình (Timeline) */}
            <div className="detail-box">
              <h2 className="box-title">Lịch Trình Tour</h2>

              <div className="itinerary-timeline">
                {/* Lặp mảng lịch trình */}
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

                      {/* Nếu API có trả về hình ảnh thì mới in ra */}
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

          {/* CỘT PHẢI: ĐẶT TOUR (SIDEBAR) */}
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
                <li>
                  <i className="fa-regular fa-calendar"></i> Ngày Khởi Hành:{" "}
                  <strong>20/10/2026</strong>
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

                <div className="passenger-section">
                  <label>Số Lượng Hành Khách</label>

                  <div className="passenger-row">
                    <span className="p-label">Người lớn:</span>
                    <input
                      type="number"
                      min="1"
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                    />
                    <span className="p-price">
                      {adults}x{formatPrice(priceAdult)}
                    </span>
                  </div>

                  <div className="passenger-row">
                    <span className="p-label">Trẻ em:</span>
                    <input
                      type="number"
                      min="0"
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                    />
                    <span className="p-price">
                      {children}x{formatPrice(priceChild)}
                    </span>
                  </div>

                  <div className="passenger-row">
                    <span className="p-label">Em bé:</span>
                    <input
                      type="number"
                      min="0"
                      value={infants}
                      onChange={(e) => setInfants(Number(e.target.value))}
                    />
                    <span className="p-price">
                      {infants}x{formatPrice(priceInfant)}
                    </span>
                  </div>
                </div>

                <div className="booking-total">
                  <span>Tổng cộng:</span>
                  <strong>{formatPriceTotal(totalPrice)}</strong>
                </div>

                <button className="btn-add-cart">Thêm Vào Giỏ Hàng</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default TourDetail;
