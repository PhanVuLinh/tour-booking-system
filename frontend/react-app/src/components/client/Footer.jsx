import { Link } from "react-router-dom";

import logoTravelGo from "../../assets/Client/images/logotravelgo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* 1. Khối Đăng Ký Nhận Tin (Newsletter) */}
        <div className="footer-newsletter">
          <h3 className="newsletter-title">
            Đăng Ký Ngay Để Không Bỏ Lỡ Các <br className="hide-on-mobile" />
            Chương Trình Của Chúng Tôi
          </h3>
          <form className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn..." required />
            <button type="submit">Đăng Ký Ngay</button>
          </form>
        </div>

        {/* 2. Khối Menu Giữa & Mạng Xã Hội */}
        <div className="footer-middle">
          <ul className="footer-nav">
            <li>
              <Link to="/">Trang Chủ</Link>
            </li>
            <li>
              <Link to="/category/tour-trong-nuoc">Tour Trong Nước</Link>
            </li>
            <li>
              <Link to="/category/tour-nuoc-ngoai">Tour Nước Ngoài</Link>
            </li>
            <li>
              <Link to="/article">Tin Tức</Link>
            </li>
            <li>
              <Link to="/contact">Liên Hệ</Link>
            </li>
          </ul>

          <div className="footer-socials">
            <a href="#">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* 3. Khối Bản Quyền & Chính Sách */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 TravelGo. All rights reserved.
          </div>

          <Link to="/" className="footer-logo">
            <img src={logoTravelGo} alt="TRAVELGO" />
          </Link>

          <div className="footer-policy">
            <Link to="/terms">Điều khoản dịch vụ</Link>
            <Link to="/privacy">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
