import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import logoTravelGo from "../../assets/Client/images/logotravelgo.png";
import { getHeaderCategories } from "./services/sharedService";

function Header() {
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (e, id) => {
    // Only intercept if on mobile
    if (window.innerWidth <= 992) {
      e.preventDefault();
      e.stopPropagation();
      setOpenDropdowns((prev) => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  useEffect(() => {
    getHeaderCategories()
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
          <button className="mobile-toggle-btn" onClick={toggleMobileMenu}>
            <i className="fa-solid fa-bars"></i>
          </button>

          <Link to="/" className="logo">
            <img className="logo__img" src={logoTravelGo} alt="TRAVELGO" />
          </Link>

          <div
            className={`mobile-overlay ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
          ></div>

          <div className={`nav-menu-wrapper ${isMobileMenuOpen ? "active" : ""}`}>
            <button className="mobile-close-btn" onClick={toggleMobileMenu}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === "/" ? "active" : ""} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trang Chủ
                </Link>
              </li>

              {categories.map((parent) => (
                <li key={parent.id}>
                  <Link
                    to={`/category/${parent.slug}`}
                    className={
                      location.pathname === `/category/${parent.slug}` ||
                      (parent.children && parent.children.some(child => location.pathname === `/category/${child.slug}`))
                        ? "active" 
                        : ""
                    }
                    onClick={(e) => {
                      if (window.innerWidth <= 992 && parent.children && parent.children.length > 0) {
                        toggleDropdown(e, parent.id);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    {parent.title}
                    {parent.children && parent.children.length > 0 && (
                      <i className={`fa-solid fa-chevron-down arrow ${openDropdowns[parent.id] ? "active" : ""}`}></i>
                    )}
                  </Link>

                  {parent.children && parent.children.length > 0 && (
                    <div className={`dropdown ${openDropdowns[parent.id] ? "active" : ""}`}>
                      {parent.children.map((child) => (
                        <Link 
                          key={child.id} 
                          to={`/category/${child.slug}`} 
                          className={location.pathname === `/category/${child.slug}` ? "active" : ""}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Link 
                  to="/article" 
                  className={location.pathname.startsWith("/article") ? "active" : ""} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={location.pathname.startsWith("/contact") ? "active" : ""} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Liên Hệ
                </Link>
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
          {/* Xin miếng điều hướng:)) */}
          <div className="nav-actions">
            <Link to="/admin/login" className="action-btn">
              <button className="btn-login-header">
                <i className="fa-solid fa-user-shield"></i>
                <span>Admin</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
