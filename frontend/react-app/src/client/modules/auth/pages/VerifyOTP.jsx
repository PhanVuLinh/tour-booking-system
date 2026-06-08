import React, { useState } from "react";
import { Link } from "react-router-dom";

function VerifyOTP() {
  // State để lưu 6 ô nhập mã
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Tự động nhảy sang ô tiếp theo
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* CỘT TRÁI: HÌNH ẢNH */}
        <div className="login-left">
          <div className="login-overlay">
            <h2>Xác thực tài khoản</h2>
            <p>
              Vui lòng nhập mã OTP gồm 6 chữ số chúng tôi đã gửi tới email của
              bạn.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM NHẬP OTP */}
        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-header">
              <h2 style={{ fontSize: "22px" }}>Nhập mã xác thực</h2>
              <p>
                Mã sẽ hết hạn sau <strong>05:00</strong> phút.
              </p>
            </div>

            <form className="login-form">
              <div className="otp-container">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>

              <button type="submit" className="btn-login-submit">
                Xác thực ngay
              </button>
            </form>

            <div className="login-footer">
              Bạn chưa nhận được mã?{" "}
              <button className="resend-link">Gửi lại mã</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
