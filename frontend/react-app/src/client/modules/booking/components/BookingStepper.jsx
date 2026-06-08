import React from "react";

export default function BookingStepper({ currentStep }) {
  return (
    <div className="booking-stepper-wrap">
      <div className="b-stepper">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
          <span className="step-num">1</span> Nhập thông tin
        </div>
        <i className="fa-solid fa-chevron-right step-arrow"></i>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
          <span className="step-num">2</span> Thanh toán
        </div>
        <i className="fa-solid fa-chevron-right step-arrow"></i>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <span className="step-num">3</span> Hoàn tất
        </div>
      </div>
    </div>
  );
}
