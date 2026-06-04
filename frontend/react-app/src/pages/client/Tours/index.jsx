import { useState } from "react";
import Breadcrumb from "../../../components/client/Breadcrumb";
import TourFilter from "../../../components/client/TourFilter";
import TourCard from "../../../components/client/TourCard";
import Pagination from "../../../components/client/Pagination";

function Tours() {
  // Trạng thái lưu tiêu chí sắp xếp đang được chọn
  const [activeSort, setActiveSort] = useState("hot");

  // Dữ liệu này sau này bạn dùng fetch() hoặc axios để gọi từ API Node.js về nhé
  const breadcrumbData = {
    title: "Tour Nước Ngoài",
    image:
      "https://ik.imagekit.io/tvlk/blog/2024/03/du-lich-nuoc-ngoai-cover.jpg",
    list: [
      { url: "/", title: "Trang Chủ" },
      { url: "/tours", title: "Tour Nước Ngoài" },
      { url: "/tours/detail", title: "phú quốc" },
    ],
  };

  const tours = Array.from({ length: 6 }).map((_, index) => ({
    id: index + 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdeWlMKbtuouVVFgxVTZcUgMFAg69DGLq6gA&s",
    title: "Combo Đà Nẵng 2026: ĐÀ NẴNG - HỘI AN - BÀ NÀ HILL",
    oldPrice: "13.650.000đ",
    newPrice: "2.590.000 đ",
    code: "123456789",
    date: "22/07/2026",
    time: "10 Ngày 9 Đêm",
    slots: 10,
  }));

  return (
    <div className="tour-list-page">
      <Breadcrumb
        title={breadcrumbData.title}
        list={breadcrumbData.list}
        image={breadcrumbData.image}
      />

      <div className="container">
        <div className="tour-list-layout">
          {/* CỘT TRÁI: BỘ LỌC */}
          <TourFilter />

          {/* CỘT PHẢI: NỘI DUNG TOUR */}
          <main className="tour-list-content">
            {/* THÊM TIÊU ĐỀ Ở ĐÂY: Tự động lấy tên từ breadcrumbData */}
            <h2 className="tour-list-title">{breadcrumbData.title}</h2>

            <p className="tour-list-desc">
              Du lịch Châu Á: là châu lục lớn và đông dân nhất thế giới... Hãy
              cùng TravelGo du lịch Châu Á để tận hưởng những dịch vụ tốt nhất.
            </p>

            {/* Thanh sắp xếp */}
            <div className="sort-bar">
              <div className="sort-options">
                <span>Sắp xếp:</span>
                <button
                  className={`sort-btn ${activeSort === "priceAsc" ? "active" : ""}`}
                  onClick={() => setActiveSort("priceAsc")}
                >
                  Giá tăng dần{" "}
                  <i className="fa-solid fa-arrow-up-short-wide"></i>
                </button>
                <button
                  className={`sort-btn ${activeSort === "priceDesc" ? "active" : ""}`}
                  onClick={() => setActiveSort("priceDesc")}
                >
                  Giá giảm dần{" "}
                  <i className="fa-solid fa-arrow-down-wide-short"></i>
                </button>
                <button
                  className={`sort-btn ${activeSort === "hot" ? "active" : ""}`}
                  onClick={() => setActiveSort("hot")}
                >
                  Khuyến Mại Hot <i className="fa-solid fa-fire"></i>
                </button>
                <button
                  className={`sort-btn ${activeSort === "view" ? "active" : ""}`}
                  onClick={() => setActiveSort("view")}
                >
                  Xem Nhiều <i className="fa-solid fa-eye"></i>
                </button>
              </div>
              <div className="sort-total">
                Tất cả: <strong>101 Tour</strong>
              </div>
            </div>

            {/* Lưới chứa danh sách Tour (3 cột) */}
            <div className="tour-grid-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            {/* Thanh phân trang */}
            <Pagination />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Tours;
