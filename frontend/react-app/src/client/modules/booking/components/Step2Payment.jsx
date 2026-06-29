import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Step2Payment = () => {
  const navigate = useNavigate();

  // State lưu tùy chọn thanh toán: "100" (Toàn bộ) hoặc "50" (Cọc)
  const [paymentType, setPaymentType] = useState("100");

  // State lưu phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  // Giả lập dữ liệu liên hệ lấy từ Step 1 (Sau này bạn thay bằng dữ liệu từ context hoặc location.state)
  const contactInfo = {
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "email@travelgo.com",
    address: "190 Pasteur, Phường Xuân Hòa, TP.HCM",
  };

  return (
    <div className="step2-payment-wrapper">
      {/* 1. KHỐI THÔNG TIN LIÊN HỆ */}
      <div className="b-box contact-summary-box">
        <div className="box-header-flex">
          <h3>Thông tin liên hệ</h3>
          <button
            type="button"
            className="btn-edit-contact"
            onClick={() => navigate("/booking/info")}
          >
            <i className="fa-regular fa-pen-to-square"></i> Chỉnh sửa
          </button>
        </div>

        <div className="contact-info-grid">
          <div className="ci-item">
            <span className="ci-label">Họ và tên</span>
            <strong className="ci-value">{contactInfo.fullName}</strong>
          </div>
          <div className="ci-item">
            <span className="ci-label">Số điện thoại</span>
            <strong className="ci-value">{contactInfo.phone}</strong>
          </div>
          <div className="ci-item">
            <span className="ci-label">Email</span>
            <strong className="ci-value">{contactInfo.email}</strong>
          </div>
          <div className="ci-item">
            <span className="ci-label">Địa chỉ</span>
            <strong className="ci-value">
              {contactInfo.address || "Chưa cung cấp"}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. KHỐI TÙY CHỌN MỨC THANH TOÁN (50% hoặc 100%) */}
      <div className="b-box payment-ratio-box">
        <h3>Quy định thanh toán</h3>
        <p className="box-subtext mb-15">
          Vui lòng chọn mức thanh toán cho đơn hàng của bạn.
        </p>

        <div className="ratio-cards-grid">
          <label
            className={`ratio-card ${paymentType === "100" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="paymentType"
              value="100"
              checked={paymentType === "100"}
              onChange={(e) => setPaymentType(e.target.value)}
            />
            <div className="rc-content">
              <span className="rc-title">Thanh toán toàn bộ (100%)</span>
              <span className="rc-desc">
                Thanh toán 100% giá trị đơn hàng để giữ chỗ chắc chắn nhất.
              </span>
            </div>
            <div className="rc-check">
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </label>

          <label
            className={`ratio-card ${paymentType === "50" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="paymentType"
              value="50"
              checked={paymentType === "50"}
              onChange={(e) => setPaymentType(e.target.value)}
            />
            <div className="rc-content">
              <span className="rc-title">Đặt cọc trước (50%)</span>
              <span className="rc-desc">
                Thanh toán 50% giá trị để giữ chỗ. Phần còn lại thanh toán trước
                ngày khởi hành 7 ngày.
              </span>
            </div>
            <div className="rc-check">
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </label>
        </div>
      </div>

      {/* 3. KHỐI PHƯƠNG THỨC THANH TOÁN */}
      <div className="b-box payment-method-box">
        <h3>Phương thức thanh toán</h3>
        <p className="box-subtext mb-15">
          Lựa chọn cổng thanh toán phù hợp với bạn.
        </p>

        <div className="methods-list">
          {/* VNPAY */}
          <label
            className={`method-item ${paymentMethod === "vnpay" ? "active" : ""}`}
          >
            <div className="mi-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                checked={paymentMethod === "vnpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="custom-radio"></span>
            </div>
            <img
              src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
              alt="VNPAY"
              className="mi-logo vnpay-logo"
            />
            <div className="mi-info">
              <span className="mi-name">Thanh toán qua VNPAY</span>
              <span className="mi-desc">
                Hỗ trợ quét mã QR, thẻ ATM nội địa và tài khoản ngân hàng.
              </span>
            </div>
          </label>

          {/* MoMo */}
          <label
            className={`method-item ${paymentMethod === "momo" ? "active" : ""}`}
          >
            <div className="mi-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={paymentMethod === "momo"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="custom-radio"></span>
            </div>
            <img
              src="https://developers.momo.vn/v3/assets/images/MOMO-Logo-App-6262c3743a290ef02396a24ea2b66c35.png"
              alt="MoMo"
              className="mi-logo momo-logo"
            />
            <div className="mi-info">
              <span className="mi-name">Ví điện tử MoMo</span>
              <span className="mi-desc">
                Thanh toán nhanh chóng, an toàn qua ứng dụng MoMo.
              </span>
            </div>
          </label>

          {/* Chuyển khoản ngân hàng */}
          <label
            className={`method-item ${paymentMethod === "bank" ? "active" : ""}`}
          >
            <div className="mi-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="custom-radio"></span>
            </div>
            {/* <div className="mi-logo bank-logo">
              <i className="fa-solid fa-building-columns"></i>
            </div> */}
            <img
              src="https://png.pngtree.com/png-vector/20220821/ourmid/pngtree-bank-transfer-icon-house-selected-transfer-vector-png-image_19626578.png"
              alt="Bank"
              className="mi-logo bank-logo"
            />
            <div className="mi-info">
              <span className="mi-name">Chuyển khoản ngân hàng</span>
              <span className="mi-desc">
                Chuyển khoản thủ công qua Internet Banking (Vietcombank,
                MBBank...).
              </span>
            </div>
          </label>
        </div>

        {/* Hướng dẫn chuyển khoản hiển thị khi chọn Bank */}
        {paymentMethod === "bank" && (
          <div className="bank-transfer-details">
            <h4 className="btd-title">Thông tin chuyển khoản:</h4>
            <ul>
              <li>
                Ngân hàng: <strong>Vietcombank - Chi nhánh TP.HCM</strong>
              </li>
              <li>
                Tên tài khoản: <strong>CÔNG TY TNHH DU LỊCH TRAVELGO</strong>
              </li>
              <li>
                Số tài khoản: <strong className="text-red">1023456789</strong>
              </li>
              <li>
                Nội dung CK:{" "}
                <strong>THANH TOAN TOUR 28T00001 - NGUYEN VAN A</strong>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2Payment;
