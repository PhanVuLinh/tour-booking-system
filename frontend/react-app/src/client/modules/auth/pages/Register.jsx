import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Đang test nên để password dạng text luôn cho dễ nhìn
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Đang gửi dữ liệu:", { name, email, password });

    try {
      const data = await register({ name, email, password });

      console.log("Kết quả từ Backend trả về:", data);
      alert("Đã gọi API! Bấm F12 mở tab Console để xem kết quả.");
    } catch (error) {
      console.error("Lỗi không gọi được Backend:", error);
      alert("Lỗi mạng hoặc Backend chưa chạy. Xem Console!");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* CỘT TRÁI: HÌNH ẢNH DU LỊCH (Dùng chung style với Login) */}
        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-header">
              <h2>Tạo tài khoản mới</h2>
              <p>Chào mừng bạn gia nhập cộng đồng du lịch!</p>
            </div>

            <form className="login-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label>Họ và tên</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-user"></i>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i
                    className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} show-pass`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>

              <div className="form-group">
                <label>Nhập lại mật khẩu</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-login-submit">
                Đăng ký tài khoản
              </button>
            </form>

            <div className="login-footer">
              Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG KÝ */}

        <div className="login-left">
          <div className="login-overlay">
            <h2>Bắt đầu hành trình của bạn</h2>
            <p>
              Đăng ký tài khoản để khám phá hàng ngàn tour du lịch hấp dẫn và
              nhận ưu đãi độc quyền.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
