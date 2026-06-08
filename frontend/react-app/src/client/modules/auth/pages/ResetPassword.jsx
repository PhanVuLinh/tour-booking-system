import React, { useState } from "react";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* CỘT TRÁI: HÌNH ẢNH */}
        <div className="login-left">
          <div className="login-overlay">
            <h2>Thiết lập mật khẩu mới</h2>
            <p>Hãy tạo một mật khẩu mới đủ mạnh để bảo vệ tài khoản của bạn.</p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐẶT LẠI MẬT KHẨU */}
        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-header">
              <h2 style={{ fontSize: "22px" }}>Đặt lại mật khẩu</h2>
              <p>Nhập mật khẩu mới bên dưới.</p>
            </div>

            <form className="login-form">
              {/* Mật khẩu mới */}
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    required
                  />
                  <i
                    className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} show-pass`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="form-group">
                <label>Nhập lại mật khẩu</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-login-submit">
                Lưu mật khẩu
              </button>
            </form>

            <div className="login-footer">
              <Link to="/login">Quay lại trang đăng nhập</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
