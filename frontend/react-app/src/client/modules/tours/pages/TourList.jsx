import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, Pagination } from "../../../shared";
import { TourFilter, TourCard } from "../components";
import { buildCategoryBreadcrumb } from "../../../utils/breadcrumb.helper";

function TourList() {
  const { slug } = useParams();
  const [tours, setTours] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);

  const [activeSort, setActiveSort] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories/${slug}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setCategoryInfo(result.data.category);
          setTours(result.data.tours);
        }
      })
      .catch((error) => console.log("Lỗi khi tải danh mục: ", error));
  }, [slug]);

  const breadcrumbList = buildCategoryBreadcrumb(categoryInfo, slug);

  const breadcrumbData = {
    title: categoryInfo?.title || "Đang tải...",
    thumbnail:
      categoryInfo?.thumbnail ||
      "https://ik.imagekit.io/tvlk/blog/2024/03/du-lich-nuoc-ngoai-cover.jpg",
    list: breadcrumbList,
  };
  return (
    <div className="tour-list-page">
      <Breadcrumb
        title={breadcrumbData.title}
        list={breadcrumbData.list}
        thumbnail={breadcrumbData.thumbnail}
      />

      <div className="container">
        <div className="tour-list-layout">
          <TourFilter />
          <main className="tour-list-content">
            <h2 className="tour-list-title">{breadcrumbData.title}</h2>

            {/* <p className="tour-list-desc">
              Du lịch Châu Á: là châu lục lớn và đông dân nhất thế giới... Hãy
              cùng TravelGo du lịch Châu Á để tận hưởng những dịch vụ tốt nhất.
            </p> */}

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
                Tất cả: <strong>{tours.length} Tour</strong>
              </div>
            </div>

            <div className="tour-grid-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            <Pagination />
          </main>
        </div>
      </div>
    </div>
  );
}

export default TourList;
