import moment from "moment";
import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  return (
    <div className="blog-card">
      <div className="bc-img-wrap">
        <img src={blog.thumbnail} alt={blog.title} className="bc-image" />
      </div>

      <div className="bc-content">
        <div className="bc-meta">
          <i className="fa-regular fa-calendar"></i>{" "}
          {moment(blog.startDate).format("DD/MM/YYYY")}
        </div>

        <h3 className="bc-title">
          <Link to={`/blog/detail/${blog.slug}`}>{blog.title}</Link>
        </h3>

        <div className="bc-hidden-info">
          <p className="bc-excerpt">{blog.description}</p>
          <Link to={`/blog/detail/${blog.slug}`} className="bc-readmore">
            Đọc tiếp
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
