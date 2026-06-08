import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* CỘT TRÁI: HÌNH ẢNH DU LỊCH */}
        <div className="login-left">
          <div className="login-overlay">
            <h2>Khám phá thế giới cùng chúng tôi</h2>
            <p>
              Đăng nhập để nhận những ưu đãi tour tốt nhất và quản lý chuyến đi
              của bạn dễ dàng hơn.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-header">
              <h2>Chào mừng trở lại!</h2>
              <p>Vui lòng đăng nhập vào tài khoản của bạn.</p>
            </div>

            {/* Nút đăng nhập mạng xã hội */}
            <div className="social-login">
              <button className="btn-social btn-google">
                <i className="fa-brands fa-google"></i>
                Đăng nhập với Google
              </button>
              <button className="btn-social btn-facebook">
                <i className="fa-brands fa-facebook-f"></i>
                Đăng nhập với Facebook
              </button>
            </div>

            {/* Dòng chữ Hoặc */}
            <div className="login-divider">
              <span>hoặc đăng nhập bằng email</span>
            </div>

            {/* Form nhập Email / Password */}
            <form className="login-form">
              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input type="password" placeholder="Nhập mật khẩu" required />
                  <i className="fa-regular fa-eye-slash show-pass"></i>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>

                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password" className="forgot-pass-link">
                  Quên mật khẩu?
                </Link>
              </div>

              <button type="submit" className="btn-login-submit">
                Đăng nhập
              </button>
            </form>

            <div className="login-footer">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
