import React from "react";

const Step2Payment = () => {
  return (
    <div className="b-box payment-method-box">
      <h3>Phương thức thanh toán</h3>
      <p className="box-subtext">
        Vui lòng chọn phương thức thanh toán thích hợp dưới đây:
      </p>

      {/* Đây là khung chứa giao diện thanh toán mẫu, bạn có thể custom thêm radio button chọn ngân hàng */}
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          color: "#888",
          border: "1px dashed #ccc",
          borderRadius: "16px",
          background: "#fafafa",
        }}
      >
        <i
          className="fa-solid fa-credit-card"
          style={{ fontSize: "32px", marginBottom: "12px", color: "#007aff" }}
        ></i>
        <p style={{ margin: 0, fontSize: "15px", fontWeight: 500 }}>
          Giao diện Cổng thanh toán (VNPAY / MoMo / Chuyển khoản)
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#aaa" }}>
          Sẽ hiển thị tích hợp tại đây ở Bước 2
        </p>
      </div>
    </div>
  );
};

export default Step2Payment;
