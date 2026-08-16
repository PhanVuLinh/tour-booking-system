import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { getHeaderCategories } from "./services/sharedService";

function Header() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  const [openDropdowns, setOpenDropdowns] = useState({});
  const canCurrentUserChangePassword =
    currentUser &&
    (!currentUser.auth_provider || currentUser.auth_provider === "local");

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
        [id]: !prev[id],
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

    //LocalStorage lấy user
    const token = localStorage.getItem("client_token");
    const userStr = localStorage.getItem("client_user");
    if (token && userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Lỗi parse thông tin user:", error);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  // Đăng xuất
  const handleLogout = () => {
    setIsLoading(true);

    setTimeout(() => {
      localStorage.removeItem("client_token");
      localStorage.removeItem("client_user");
      setCurrentUser(null);
      toast.success("Đăng xuất thành công");
      setIsLoading(false);
      navigate("/");
    }, 800);
  };
  return (
    <>
      {isLoading && (
        <div className="client-loading-state client-spinner-logout">
          <div className="client-spinner"></div>
        </div>
      )}

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
              <img className="logo__img" src="https://res.cloudinary.com/dlxbhq8pw/image/upload/v1785948618/lgmhzfeeoal2bblfdp6s.png" alt="TRAVELGO" />
            </Link>

            <div
              className={`mobile-overlay ${isMobileMenuOpen ? "active" : ""}`}
              onClick={toggleMobileMenu}
            ></div>

            <div
              className={`nav-menu-wrapper ${isMobileMenuOpen ? "active" : ""}`}
            >
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
                          (parent.children &&
                            parent.children.some(
                              (child) =>
                                location.pathname === `/category/${child.slug}`,
                            ))
                          ? "active"
                          : ""
                      }
                      onClick={(e) => {
                        if (
                          window.innerWidth <= 992 &&
                          parent.children &&
                          parent.children.length > 0
                        ) {
                          toggleDropdown(e, parent.id);
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      {parent.title}
                      {parent.children && parent.children.length > 0 && (
                        <i
                          className={`fa-solid fa-chevron-down arrow ${openDropdowns[parent.id] ? "active" : ""}`}
                        ></i>
                      )}
                    </Link>

                    {parent.children && parent.children.length > 0 && (
                      <div
                        className={`dropdown ${openDropdowns[parent.id] ? "active" : ""}`}
                      >
                        {parent.children.map((child) => (
                          <Link
                            key={child.id}
                            to={`/category/${child.slug}`}
                            className={
                              location.pathname === `/category/${child.slug}`
                                ? "active"
                                : ""
                            }
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
                    to="/blog"
                    className={
                      location.pathname.startsWith("/blog") ? "active" : ""
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tin Tức
                  </Link>
                </li>
                <li>
                  <Link
                    to="/booking/lookup"
                    className={
                      location.pathname.startsWith("/booking/lookup")
                        ? "active"
                        : ""
                    }
                  >
                    Tra Cứu Đơn
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/support"
                    className={
                      location.pathname.startsWith("/support") ? "active" : ""
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hỗ Trợ
                  </Link>
                </li> */}
              </ul>
            </div>
            <div className="nav-actions">
              {currentUser ? (
                <div className="user-dropdown-wrapper">
                  <button className="btn-login-header user-profile-btn">
                    <i className="fa-solid fa-circle-user"></i>
                    <span>{currentUser.full_name}</span>
                    <i className="fa-solid fa-chevron-down user-profile-chevron"></i>
                  </button>

                  <div className="user-dropdown-menu">
                    <div className="ud-user-info">
                      <strong>{currentUser.full_name}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <div className="ud-divider"></div>

                    <Link
                      to="/profile/info"
                      className={
                        location.pathname === "/profile/info" ? "active" : ""
                      }
                    >
                      <i className="fa-regular fa-id-card"></i> Thông tin cá
                      nhân
                    </Link>
                    <Link
                      to="/profile/history"
                      className={
                        location.pathname === "/profile/history" ? "active" : ""
                      }
                    >
                      <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử
                      đặt tour
                    </Link>

                    {canCurrentUserChangePassword && (
                      <Link
                        to="/profile/change-password"
                        className={
                          location.pathname === "/profile/change-password"
                            ? "active"
                            : ""
                        }
                      >
                        <i className="fa-solid fa-lock"></i> Đổi mật khẩu
                      </Link>
                    )}

                    <div className="ud-divider"></div>
                    <button onClick={handleLogout} className="btn-logout">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="action-btn">
                  <button className="btn-login-header">
                    <i className="fa-solid fa-circle-user"></i>
                    <span>Đăng nhập</span>
                  </button>
                </Link>
              )}

              {/* Nút Admin */}
              {/* <div className="nav-actions">
                <Link to="/admin/login" className="action-btn">
                  <button className="btn-login-header">
                    <i className="fa-solid fa-user-shield"></i>
                    <span>Admin</span>
                  </button>
                </Link>
              </div> */}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
