import TourCard from "./TourCard";

function FlashSale() {
  // Dữ liệu mẫu (sau này bạn có thể map từ API)
  const tours = [
    {
      id: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdeWlMKbtuouVVFgxVTZcUgMFAg69DGLq6gA&s",
      title: "Hà Nội - Lào Cai - SaPa 4N3Đ",
      oldPrice: "13.650.000đ",
      newPrice: "2.590.000 đ",
      code: "123456789",
      date: "22/07/2026",
      time: "10 Ngày 9 Đêm",
      slots: 10,
    },
    {
      id: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKI9T9qERj6SwONzi-NysVP7teUnRQJ-h8fA&s",
      title: "Tour 2026 Phú Quốc - Thiên Đường Đảo Ngọc (3N2D)",
      oldPrice: "13.650.000đ",
      newPrice: "2.590.000 đ",
      code: "123456789",
      date: "22/07/2026",
      time: "10 Ngày 9 Đêm",
      slots: 10,
    },
    {
      id: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdMadsoH9dgFVmJCZwsPKI7Eizq12E_h-wmA&s",
      title: "Combo Đà Nẵng 2026: ĐÀ NẴNG - HỘI AN - BÀ NÀ HILL",
      oldPrice: "13.650.000đ",
      newPrice: "2.590.000 đ",
      code: "123456789",
      date: "22/07/2026",
      time: "10 Ngày 9 Đêm",
      slots: 10,
    },
  ];

  return (
    <section className="flash-sale">
      <div className="container">
        <div className="flash-sale__inner">
          {/* Cột trái: Thông tin ưu đãi */}
          <div className="flash-sale__info">
            <h2 className="fs-title">
              ƯU ĐÃI 2026 <br /> TOUR GIỜ CHÓT
            </h2>
            <p className="fs-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>

            <div className="fs-countdown-wrap">
              <p className="fs-end-text">Kết thúc sau</p>
              <div className="fs-countdown">
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Ngày</span>
                </div>
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Giờ</span>
                </div>
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Phút</span>
                </div>
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Giây</span>
                </div>
              </div>
            </div>

            <div className="fs-huge-discount">
              <p>GIẢM ĐẾN</p>
              <h3>990.000đ</h3>
            </div>
          </div>

          {/* Cột phải: Danh sách Tour */}
          <div className="flash-sale__tours">
            {/* Nút điều hướng ảo */}
            <button className="slider-nav prev">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button className="slider-nav next">
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="tour-grid">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlashSale;
