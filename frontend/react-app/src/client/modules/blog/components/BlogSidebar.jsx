import moment from "moment";
import { Link } from "react-router-dom";

function BlogSidebar({ recentBlogs }) {
  return (
    <aside className="bd-sidebar">
      <div className="sidebar-widget">
        <h3 className="widget-title">Bài viết mới nhất</h3>
        <div className="widget-content">
          {recentBlogs.map((item) => (
            <div className="recent-post-card" key={item.id}>
              <Link to={`/blog/detail/${item.slug}`} className="rp-img">
                <img src={item.thumbnail} alt={item.title} />
              </Link>
              <div className="rp-info">
                <h4 className="rp-title">
                  <Link to={`/blog/detail/${item.slug}`}>{item.title}</Link>
                </h4>
                <span className="rp-date">
                  {moment(item.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default BlogSidebar;
