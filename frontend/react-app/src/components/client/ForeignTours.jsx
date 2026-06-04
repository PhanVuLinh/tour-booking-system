import TourCard from "./TourCard";

function ForeignTours() {
  // Tự động tạo mảng 8 tour mẫu (sau này bạn map dữ liệu từ API vào đây)
  const foreignToursData = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    image: `https://saigontourist.net/_next/image?url=https%3A%2F%2Fsaigontourist.net%2Fstorage%2Fmedia%2Fco-tran-thanh-nham-qingyan-ancient-town-1828072274_1776743040.jpg&w=640&q=75`,
    title: `Combo Du Lịch nước ngoài Đặc Biệt ${index + 1}`,
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
        <h2 className="section-title">Tour Nước Ngoài</h2>

        {/* Lưới 4 cột chứa 8 sản phẩm */}
        <div className="tour-grid-4">
          {foreignToursData.map((tour) => (
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

export default ForeignTours;
