import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../services/homeService";
import { formatDate } from "../../../utils/format.helper";

function News() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    getBlogs()
      .then((result) => {
        if (result.success) {
          setBlogs(result.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải tour Blog:", error);
      });
  }, []);

  if (blogs.length === 0) {
    return null;
  }

  const middle = blogs[0];
  const left = blogs.slice(1, 3);
  const right = blogs.slice(3, 5);

  return (
    <section className="news-section">
      <div className="container">
        <h2 className="section-title">Tin Tức Mới</h2>

        <div className="news-grid">
          <div className="news-col side-col">
            {left.map((item) => (
              <Link
                to={`/blog/detail/${item.slug}`}
                className="news-card-small"
                key={item.id}
              >
                <img src={item.thumbnail} alt={item.title} />
                <div className="news-card-small__content">
                  <span className="news-date">
                    {formatDate(item.created_at)}
                  </span>
                  <h3 className="news-title">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="news-col center-col">
            <Link
              to={`/blog/detail/${middle.slug}`}
              className="news-card-large"
              key={middle.id}
            >
              <div className="news-card-large__img">
                <img src={middle.thumbnail} alt={middle.title} />
              </div>
              <div className="news-card-large__content">
                <span className="news-date">
                  {formatDate(middle.created_at)}
                </span>
                <h3 className="news-title">{middle.title}</h3>
                <p className="news-desc">{middle.description}</p>
              </div>
            </Link>
          </div>

          <div className="news-col side-col">
            {right.map((item) => (
              <Link
                to={`/blog/detail/${item.slug}`}
                className="news-card-small"
                key={item.id}
              >
                <img src={item.thumbnail} alt={item.title} />
                <div className="news-card-small__content">
                  <span className="news-date">
                    {formatDate(item.created_at)}
                  </span>
                  <h3 className="news-title">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="btn-view-all-wrap">
          <a href="blog" className="btn-view-all">
            Xem tất cả
          </a>
        </div>
      </div>
    </section>
  );
}

export default News;
