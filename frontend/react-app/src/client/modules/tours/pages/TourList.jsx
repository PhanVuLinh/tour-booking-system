import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Pagination } from "../../../shared";
import { TourFilter, TourCard } from "../components";
import { buildCategoryBreadcrumb } from "../../../utils/breadcrumb.helper";
import { getToursByCategory } from "../services/tourService";

function TourList() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;

  const [tours, setTours] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalTours: 0 });

  const [activeSort, setActiveSort] = useState(null);

  useEffect(() => {
    getToursByCategory(slug, page)
      .then((result) => {
        if (result.success) {
          setCategoryInfo(result.data.category);
          setTours(result.data.tours);
          if (result.data.pagination) {
            setPagination(result.data.pagination);
          }
        }
      })
      .catch((error) => console.log("Lỗi khi tải danh mục: ", error));
  }, [slug, page]);

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
                Tất cả: <strong>{pagination.totalTours} Tour</strong>
              </div>
            </div>

            <div className="tour-grid-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            <Pagination
              currentPage={Number(pagination.currentPage)}
              totalPages={Number(pagination.totalPages)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default TourList;
