import React from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* CỘT TRÁI: HÌNH ẢNH DU LỊCH */}
        <div className="login-left">
          <div className="login-overlay">
            <h2>Khôi phục tài khoản</h2>
            <p>
              Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài
              khoản của mình chỉ trong giây lát.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM QUÊN MẬT KHẨU */}
        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-header">
              <h2 style={{ fontSize: "22px" }}>Quên mật khẩu?</h2>
              <p>
                Nhập email đã đăng ký, chúng tôi sẽ gửi link khôi phục mật khẩu
                cho bạn.
              </p>
            </div>

            <form className="login-form">
              <div className="form-group">
                <label>Email xác nhận</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-login-submit">
                Gửi yêu cầu
              </button>
            </form>

            <div className="login-footer">
              <Link to="/login">
                <i
                  className="fa-solid fa-arrow-left"
                  style={{ marginRight: "8px" }}
                ></i>
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
