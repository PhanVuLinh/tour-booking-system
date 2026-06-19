import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import logoTravelGo from "../../assets/Client/images/logotravelgo.png";

function Header() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setCategories(result.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh mục:", error);
      });
  }, []);

  return (
    <header>
      <div className="top-bar">
        <div className="top-bar__inner container">
          <div className="top-bar__item">
            <i className="fa-solid fa-phone"></i> 0123.456.789
          </div>
          <div className="top-bar__item">
            <i className="fa-solid fa-envelope"></i> contact@travelgo.com
          </div>
          <div className="top-bar__item">
            <i className="fa-solid fa-location-dot"></i> Số 123, đường ABC,
            thành phố XYZ
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="navbar__inner container">
          <button className="mobile-toggle-btn">
            <i className="fa-solid fa-bars"></i>
          </button>

          <Link to="/" className="logo">
            <img className="logo__img" src={logoTravelGo} alt="TRAVELGO" />
          </Link>

          <div className="mobile-overlay"></div>

          <div className="nav-menu-wrapper">
            <button className="mobile-close-btn">
              <i className="fa-solid fa-xmark"></i>
            </button>

            <ul className="nav-links">
              <li>
                <Link to="/" className="active">
                  Trang Chủ
                </Link>
              </li>

              {categories.map((parent) => (
                <li key={parent.id}>
                  <Link to={`/category/${parent.slug}`}>
                    {parent.title}
                    {parent.children && parent.children.length > 0 && (
                      <i className="fa-solid fa-chevron-down arrow"></i>
                    )}
                  </Link>

                  {parent.children && parent.children.length > 0 && (
                    <div className="dropdown">
                      {parent.children.map((child) => (
                        <Link key={child.id} to={`/category/${child.slug}`}>
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Link to="/article">Tin Tức</Link>
              </li>
              <li>
                <Link to="/contact">Liên Hệ</Link>
              </li>
            </ul>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="action-btn">
              <button className="btn-login-header">
                <i className="fa-solid fa-circle-user"></i>
                <span>Đăng nhập</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
