import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { login, loginGoogle } from "../services/authService";
import { validateLoginForm } from "../validations/auth.validator";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateLoginForm(loginData);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }

    try {
      const response = await login(loginData);
      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(`Chào mừng ${response.data.user.fullName} quay trở lại!`);
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi máy chủ. Vui lòng thử lại sau!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Google chưa trả token. Vui lòng kiểm tra cấu hình OAuth.");
        return;
      }

      const response = await loginGoogle(credentialResponse.credential);

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(`Chào mừng ${response.data.user.fullName} quay trở lại!`);
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <div className="login-overlay">
            <h2>Khám phá thế giới cùng chúng tôi</h2>
            <p>
              Đăng nhập để nhận những ưu đãi tour tốt nhất và quản lý chuyến đi
              của bạn dễ dàng hơn.
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-header">
              <h2>Chào mừng trở lại!</h2>
              <p>Vui lòng đăng nhập vào tài khoản của bạn.</p>
            </div>

            <div className="social-login">
              {/* <button className="btn-social btn-google">
                <i className="fa-brands fa-google"></i>
                Đăng nhập với Google
              </button> */}
              <div>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Đăng nhập Google thất bại!");
                  }}
                  useOneTap // Tự động hiện popup hỏi tài khoản mà không cần click (siêu tiện)
                />
              </div>
              <button className="btn-social btn-facebook">
                <i className="fa-brands fa-facebook-f"></i>
                Đăng nhập với Facebook
              </button>
            </div>

            <div className="login-divider">
              <span>hoặc đăng nhập bằng email</span>
            </div>

            <form className="login-form">
              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ email"
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
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
                    placeholder="Nhập mật khẩu"
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    autoComplete="current-password"
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

              <button
                type="submit"
                className="btn-login-submit"
                onClick={handleLogin}
              >
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
