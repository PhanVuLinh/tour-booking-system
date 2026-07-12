import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { register } from "../services/authService";
import { validateRegisterForm } from "../validations/auth.validator";

function Register() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }
    setErrors({});

    try {
      const response = await register(userData);
      if (response.success) {
        const userName = response.data?.user?.fullName || "bạn";
        toast.success(`Chúc mừng ${userName} đã đăng ký tài khoản thành công!`);
        navigate("/login");
      } else {
        toast.error("Đăng ký thất bại: " + response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi máy chủ. Vui lòng thử lại sau!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
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
                    value={userData.fullName}
                    onChange={(e) =>
                      setUserData({ ...userData, fullName: e.target.value })
                    }
                    placeholder="Nhập họ tên của bạn"
                  />
                </div>
                {errors.fullName && (
                  <span className="error-text">
                    <i
                      className="fa-solid fa-circle-exclamation"
                      style={{ marginRight: "4px" }}
                    ></i>
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="error-text">
                    <i
                      className="fa-solid fa-circle-exclamation"
                      style={{ marginRight: "4px" }}
                    ></i>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    autoComplete="new-password"
                  />
                  <i
                    className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} show-pass`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
                {errors.password && (
                  <span className="error-text">
                    <i
                      className="fa-solid fa-circle-exclamation"
                      style={{ marginRight: "4px" }}
                    ></i>
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Nhập lại mật khẩu</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={userData.confirmPassword}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        confirmPassword: e.target.value,
                      })
                    }
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">
                    <i
                      className="fa-solid fa-circle-exclamation"
                      style={{ marginRight: "4px" }}
                    ></i>
                    {errors.confirmPassword}
                  </span>
                )}
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
