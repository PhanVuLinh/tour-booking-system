import { useState, useEffect } from "react";
import { useParams, Link, data } from "react-router-dom";
import { Breadcrumb } from "../../../shared";
import { BlogSidebar } from "../components";
import { getBlogDetail } from "../services";
import { formatDate } from "../../../utils/format.helper";

function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    getBlogDetail(slug).then((response) => {
      if (response.success && response.data) {
        setBlog(response.data.blog);
        setRecentBlogs(response.data.recentBlogs);
      } else {
        setBlog(null);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="client-loading-state" style={{ height: "60vh" }}>
        <div className="client-spinner"></div>
        <p>Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="search-empty-state" style={{ margin: "100px auto" }}>
        <h3>Không tìm thấy bài viết!</h3>
        <p>Bài viết có thể đã bị xóa hoặc đường dẫn không chính xác.</p>
        <Link to="/blog" className="btn-view-all">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title={blog.title}
        thumbnail="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&h=550&q=85"
        list={[
          { title: "Trang chủ", url: "/" },
          { title: "Tin tức", url: "/blog" },
          { title: blog.title, url: `/blog/detail/${blog.slug}` },
        ]}
      />

      <div className="container bd-container">
        <div className="bd-layout">
          <main className="bd-main">
            <div className="bd-article">
              <h1 className="bd-title">{blog.title}</h1>

              <div className="bd-meta">
                <span className="meta-item">
                  <i className="fa-regular fa-calendar"></i>{" "}
                  {formatDate(blog.createdAt)}
                </span>
                <span className="meta-item">
                  <i className="fa-regular fa-eye"></i> 1,234 lượt xem
                </span>
              </div>

              <div className="bd-thumbnail">
                <img src={blog.thumbnail} alt={blog.title} />
              </div>

              <div
                className="bd-content-html"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></div>

              <div className="bd-share">
                <span>Chia sẻ bài viết:</span>
                <button className="share-btn fb">
                  <i className="fa-brands fa-facebook-f"></i>
                </button>
                <button className="share-btn tw">
                  <i className="fa-brands fa-twitter"></i>
                </button>
                <button className="share-btn link">
                  <i className="fa-solid fa-link"></i>
                </button>
              </div>
            </div>
          </main>

          <BlogSidebar recentBlogs={recentBlogs} />
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
