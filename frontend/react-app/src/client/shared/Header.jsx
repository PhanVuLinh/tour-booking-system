import { Link } from "react-router-dom";

import logoTravelGo from "../../assets/Client/images/logotravelgo.png";

function Header() {
  const miniCart = 1; // Giữ nguyên số 1 để khớp với ảnh mẫu

  return (
    <header>
      {/* ================= TOP BAR ================= */}
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

      {/* ================= MAIN NAVBAR ================= */}
      <nav className="navbar">
        <div className="navbar__inner container">
          {/* Nút Hamburger cho Mobile */}
          <button className="mobile-toggle-btn">
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Logo (Sẽ được CSS căn giữa tuyệt đối trên Mobile) */}
          <Link to="/" className="logo">
            <img className="logo__img" src={logoTravelGo} alt="TRAVELGO" />
          </Link>

          {/* Lớp phủ màn hình tối cho menu Mobile */}
          <div className="mobile-overlay"></div>

          {/* Menu Điều Hướng */}
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
              <li>
                <Link to="/category/tour-trong-nuoc">
                  Tour Trong Nước{" "}
                  <i className="fa-solid fa-chevron-down arrow"></i>
                </Link>
                <div className="dropdown">
                  <Link to="/category/tour-mien-bac">Du lịch Miền Bắc</Link>
                  <Link to="/category/tour-mien-trung">Du lịch Miền Trung</Link>
                  <Link to="/category/tour-mien-nam">Du lịch Miền Nam</Link>
                </div>
              </li>
              <li>
                <Link to="/category/tour-nuoc-ngoai">
                  Tour Nước Ngoài{" "}
                  <i className="fa-solid fa-chevron-down arrow"></i>
                </Link>
                <div className="dropdown">
                  <Link to="/category/tour-chau-a">Du lịch Châu Á</Link>
                  <Link to="/category/tour-chau-au">Du lịch Châu Âu</Link>
                </div>
              </li>
              <li>
                <Link to="/article">Tin Tức</Link>
              </li>
              <li>
                <Link to="/contact">Liên Hệ</Link>
              </li>
            </ul>
          </div>

          {/* KÊU GỌI HÀNH ĐỘNG - Chỉ có GIỎ HÀNG giống hệt ảnh */}
          <div className="nav-actions">
            <Link to="/cart" className="action-btn">
              <i className="fa-solid fa-cart-shopping"></i>
              {miniCart > 0 && (
                <span className="action-badge badge-red">{miniCart}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
