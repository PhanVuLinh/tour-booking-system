import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BlogCard } from "../components";
import { Breadcrumb, Pagination } from "../../../shared";
import { getBlogList } from "../services/blogService";

function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "newest";

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
  });
  const [loading, setLoading] = useState(true);

  const breadcrumbData = {
    title: "Tin tức & Cẩm nang du lịch",
    thumbnail:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&h=550&q=85",
    list: [
      { title: "Trang chủ", url: "/" },
      { title: "Tin tức", url: "/blog" },
    ],
  };

  const handleSort = (sortType) => {
    const params = new URLSearchParams(searchParams);
    if (sortType === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sortType);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    getBlogList({ page, sort }).then((response) => {
      if (response.data) {
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
      }
      setLoading(false);
    });
  }, [page, sort]);

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title={breadcrumbData.title}
        thumbnail={breadcrumbData.thumbnail}
        list={breadcrumbData.list}
      />

      <div className="container blog-container">
        <main className="blog-list-content">
          <h2 className="tour-list-title">Tin tức & Cẩm nang du lịch</h2>

          <div className="sort-bar">
            <div className="sort-options">
              <span>Sắp xếp:</span>
              <button
                className={`sort-btn ${sort === "newest" ? "active" : ""}`}
                onClick={() => handleSort("newest")}
              >
                Mới nhất <i className="fa-solid fa-arrow-down-short-wide"></i>
              </button>
              <button
                className={`sort-btn ${sort === "oldest" ? "active" : ""}`}
                onClick={() => handleSort("oldest")}
              >
                Cũ nhất <i className="fa-solid fa-arrow-up-short-wide"></i>
              </button>
              {/* <button
                className={`sort-btn ${sort === "popular" ? "active" : ""}`}
                onClick={() => handleSort("popular")}
              >
                Nổi bật <i className="fa-solid fa-fire"></i>
              </button> */}
            </div>
            <div className="sort-count">
              Tất cả: <strong>{pagination.totalBlogs} Bài viết</strong>
            </div>
          </div>

          {loading ? (
            <div className="client-loading-state">
              <div className="client-spinner"></div>
              <p>Đang tải danh sách bài viết...</p>
            </div>
          ) : (
            <>
              {blogs.length > 0 ? (
                <div className="blog-grid">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="search-empty-state">
                  <h3>Chưa có bài viết nào!</h3>
                  <p>Hệ thống đang cập nhật tin tức, vui lòng quay lại sau.</p>
                </div>
              )}

              {blogs.length > 0 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default BlogPage;
