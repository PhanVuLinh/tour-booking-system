import TourCard from "./TourCard";

function DomesticTours() {
  // Tự động tạo mảng 8 tour mẫu (sau này bạn map dữ liệu từ API vào đây)
  const domesticToursData = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    image: `https://travel.com.vn/api/image-proxy?url=https%3A%2F%2Fs3-cmc.travel.com.vn%2Fvtv-image%2FImages%2FDestination%2Ftf__2_3329_thiet-ke-chua-co-ten-2.webp&w=592&q=90`,
    title: `Combo Du Lịch Trong Nước Đặc Biệt ${index + 1}`,
    oldPrice: "13.650.000đ",
    newPrice: "2.590.000 đ",
    code: `12345678${index}`,
    date: "22/07/2026", // Giữ đúng năm 2026 như data cũ của bạn
    time: "10 Ngày 9 Đêm",
    slots: 10,
  }));

  return (
    <section className="tour-section">
      <div className="container">
        {/* Tái sử dụng lại class section-title ở phần Khuyến Mại */}
        <h2 className="section-title">Tour Trong Nước</h2>

        {/* Lưới 4 cột chứa 8 sản phẩm */}
        <div className="tour-grid-4">
          {domesticToursData.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="btn-view-all-wrap">
          <a href="#" className="btn-view-all">
            Xem tất cả
          </a>
        </div>
      </div>
    </section>
  );
}

export default DomesticTours;
