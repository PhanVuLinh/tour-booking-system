import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Pagination } from "../../../shared";
import { TourFilter, TourCard } from "../components";
import { buildCategoryBreadcrumb } from "../../../utils/breadcrumb.helper";
import { getToursByCategory } from "../services/tourService";

function TourList() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const departureFrom = searchParams.get('departureFrom') || null;
  const priceLevel = searchParams.get('priceLevel') || null;
  const startDate = searchParams.get('startDate') || null;
  const adults = parseInt(searchParams.get('adults')) || 0;
  const children = parseInt(searchParams.get('children')) || 0;
  const babies = parseInt(searchParams.get('babies')) || 0;
  const sort = searchParams.get('sort') || null;

  const [tours, setTours] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalTours: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const [activeSort, setActiveSort] = useState(sort);

  useEffect(() => {
    setIsLoading(true);
    const filterParams = { departureFrom, priceLevel, startDate, adults, children, babies };
    getToursByCategory(slug, page, filterParams, sort)
      .then((result) => {
        if (result.success) {
          setCategoryInfo(result.data.category);
          setTours(result.data.tours);
          if (result.data.pagination) {
            setPagination(result.data.pagination);
          }
        }
      })
      .catch((error) => console.log("Lỗi khi tải danh mục: ", error))
      .finally(() => setIsLoading(false));
  }, [slug, page, departureFrom, priceLevel, startDate, adults, children, babies, sort]);

  const handleSort = (sortType) => {
    setActiveSort(sortType);
    const params = new URLSearchParams(searchParams);
    if (sortType) {
      params.set("sort", sortType);
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

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
                  onClick={() => handleSort("priceAsc")}
                >
                  Giá tăng dần{" "}
                  <i className="fa-solid fa-arrow-up-short-wide"></i>
                </button>
                <button
                  className={`sort-btn ${activeSort === "priceDesc" ? "active" : ""}`}
                  onClick={() => handleSort("priceDesc")}
                >
                  Giá giảm dần{" "}
                  <i className="fa-solid fa-arrow-down-wide-short"></i>
                </button>
                <button
                  className={`sort-btn ${activeSort === "hot" ? "active" : ""}`}
                  onClick={() => handleSort("hot")}
                >
                  Khuyến Mại Hot <i className="fa-solid fa-fire"></i>
                </button>
                <button
                  className={`sort-btn ${activeSort === "view" ? "active" : ""}`}
                  onClick={() => handleSort("view")}
                >
                  Xem Nhiều <i className="fa-solid fa-eye"></i>
                </button>
                {activeSort && (
                  <button
                    className="sort-btn reset-sort-btn"
                    onClick={() => handleSort(null)}
                  >
                    Đặt lại <i className="fa-solid fa-rotate-right"></i>
                  </button>
                )}
              </div>
              <div className="sort-total">
                Tất cả: <strong>{pagination.totalTours} Tour</strong>
              </div>
            </div>

            <div className="tour-grid-3">
              {isLoading ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px 0", color: "#666" }}>
                  <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: "#ff5722", marginBottom: "15px" }}></i>
                  <p style={{ fontSize: "1.1rem" }}>Hệ thống đang tìm kiếm Tour tốt nhất cho bạn...</p>
                </div>
              ) : tours.length > 0 ? (
                tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#666", backgroundColor: "#f9f9f9", borderRadius: "12px", border: "1px dashed #ccc" }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png"
                    alt="No tours"
                    style={{ width: "120px", marginBottom: "20px", opacity: 0.6 }}
                  />
                  <h3 style={{ fontSize: "1.3rem", color: "#333", marginBottom: "10px" }}>Rất tiếc, không có Tour nào phù hợp!</h3>
                  <p>Không tìm thấy Tour nào khớp với tiêu chí tìm kiếm của bạn.<br />Bạn hãy thử thay đổi Mức giá hoặc Điểm đi nhé.</p>
                </div>
              )}
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
