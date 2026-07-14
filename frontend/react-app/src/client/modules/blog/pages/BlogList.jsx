import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Pagination } from "../../../shared";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX CỨNG DỮ LIỆU (MOCK DATA) GIỐNG HỆT DATABASE CỦA BẠN
  const mockBlogs = [
    {
      id: 1,
      title: "Kinh nghiệm du lịch Sapa mùa lúa chín tuyệt đẹp",
      slug: "kinh-nghiem-du-lich-sapa-mua-lua-chin",
      thumbnail:
        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
      description:
        "Sapa tháng 9, tháng 10 khoác lên mình màu áo vàng rực rỡ của những thửa ruộng bậc thang. Cùng khám phá bí kíp săn ảnh mùa lúa chín.",
      createdAt: "2026-06-21T15:45:37",
    },
    {
      id: 2,
      title: "Lịch trình vi vu Đà Nẵng – Hội An 4 ngày 3 đêm",
      slug: "lich-trinh-vi-vu-da-nang-hoi-an-4n3d",
      thumbnail:
        "https://images.unsplash.com/photo-1557315360-6a350ab4eccd?auto=format&fit=crop&w=800&q=80",
      description:
        "Bạn đang lên kế hoạch khám phá miền Trung? Lưu ngay lịch trình chi tiết từ ăn uống, di chuyển đến các điểm check-in không thể bỏ lỡ.",
      createdAt: "2026-06-21T15:45:37",
    },
    {
      id: 3,
      title: "Top 5 bãi biển đẹp nhất Phú Quốc không thể bỏ lỡ",
      slug: "top-5-bai-bien-dep-nhat-phu-quoc",
      thumbnail:
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
      description:
        "Đảo ngọc Phú Quốc nổi tiếng với những bãi biển cát trắng mịn và nước trong xanh. Điểm danh 5 bãi biển bạn nhất định phải ghé thăm.",
      createdAt: "2026-06-21T15:45:37",
    },
    {
      id: 4,
      title: "Trải nghiệm ngủ đêm trên du thuyền Vịnh Hạ Long",
      slug: "ngu-dem-tren-du-thuyen-vinh-ha-long",
      thumbnail:
        "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
      description:
        "Chuyến du lịch Hạ Long của bạn sẽ trở nên đáng nhớ hơn bao giờ hết với trải nghiệm đón bình minh và ngủ đêm giữa kỳ quan thế giới.",
      createdAt: "2026-06-21T15:45:37",
    },
    {
      id: 5,
      title: "Cẩm nang săn mây Đà Lạt thành công 100%",
      slug: "cam-nang-san-may-da-lat",
      thumbnail:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
      description:
        "Đà Lạt mộng mơ luôn làm say lòng du khách bởi những buổi sáng mù sương. Chia sẻ tọa độ và thời gian lý tưởng để săn mây tuyệt đẹp.",
      createdAt: "2026-06-21T15:45:37",
    },
    {
      id: 6,
      title: "5 món ăn đường phố Bangkok nhất định phải thử",
      slug: "am-thuc-duong-pho-bangkok-thai-lan",
      thumbnail:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      description:
        "Thái Lan không chỉ thu hút bởi những ngôi chùa vàng mà còn bởi nền ẩm thực đường phố phong phú. Cùng nếm thử Pad Thai, Som Tum...",
      createdAt: "2026-06-21T15:45:37",
    },
  ];

  // Giả lập độ trễ tải dữ liệu để thấy hiệu ứng loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 800); // Trễ 0.8s

    return () => clearTimeout(timer);
  }, []);

  // Hàm chuyển đổi định dạng ngày (VD: "2026-06-21T15:45:37" -> "21/06/2026")
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title="Tin tức & Cẩm nang du lịch"
        thumbnail="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&h=550&q=85"
        list={[
          { title: "Trang chủ", url: "/" },
          { title: "Tin tức", url: "/blog" },
        ]}
      />

      <div className="container blog-container">
        <main className="blog-list-content" style={{ width: "100%" }}>
          <h2 className="tour-list-title">Tin tức & Cẩm nang du lịch</h2>

          <div className="sort-bar">
            <div className="sort-options">
              <span>Sắp xếp:</span>
              <button className="sort-btn active">
                Mới nhất <i className="fa-solid fa-arrow-down-short-wide"></i>
              </button>
              <button className="sort-btn">
                Cũ nhất <i className="fa-solid fa-arrow-up-short-wide"></i>
              </button>
              <button className="sort-btn">
                Nổi bật <i className="fa-solid fa-fire"></i>
              </button>
            </div>
            <div className="sort-count">
              Tất cả: <strong>{blogs.length} Bài viết</strong>
            </div>
          </div>

          {loading ? (
            <div className="client-loading-state" >
              <div className="client-spinner"></div>
              <p>Đang tải danh sách bài viết...</p>
            </div>
          ) : (
            <>
              {blogs.length > 0 ? (
                <div className="blog-grid">
                  {blogs.map((blog) => (
                    <div className="blog-card" key={blog.id}>
                      {/* Ảnh Nền Background */}
                      <div className="bc-img-wrap">
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="bc-image"
                        />
                      </div>

                      {/* Khối Nội Dung Đè Lên Ảnh */}
                      <div className="bc-content">
                        <div className="bc-meta">
                          <i className="fa-regular fa-calendar"></i>{" "}
                          {formatDate(blog.createdAt)}
                        </div>

                        <h3 className="bc-title">
                          <Link to={`/blog/detail/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h3>

                        {/* Khối Bị Ẩn (Sẽ trượt lên khi hover) */}
                        <div className="bc-hidden-info">
                          <p className="bc-excerpt">{blog.description}</p>
                          <Link
                            to={`/blog/detail/${blog.slug}`}
                            className="bc-readmore"
                          >
                            Đọc tiếp <i className="fa-solid fa-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-empty-state">
                  <h3>Chưa có bài viết nào!</h3>
                  <p>Hệ thống đang cập nhật tin tức, vui lòng quay lại sau.</p>
                </div>
              )}

              {blogs.length > 0 && (
                <Pagination currentPage={1} totalPages={3} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default BlogPage;
