import React, { useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { toast } from "sonner";

export default function BookingSuccess() {
  // Lấy dữ liệu từ OrderBooking truyền xuống qua context
  const contextData = useOutletContext();

  useEffect(() => {
    toast.success("Đặt tour thành công!", {
      description: "Cảm ơn bạn đã sử dụng dịch vụ của TravelGo.",
    });
  }, []);

  // Tránh lỗi khi người dùng F5 lại trang (mất context)
  const contactInfo = contextData?.contactInfo || {
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "email@travelgo.com",
    address: "190 Pasteur, Phường Xuân Hòa, TP.HCM",
  };
  const adultCount = contextData?.adultCount || 1;
  const childCount = contextData?.childCount || 0;
  const infantCount = contextData?.infantCount || 0;

  // Hàm render danh sách hành khách minh họa dựa trên số lượng
  const renderPassengerList = (type, count) => {
    if (count === 0) return null;
    let list = [];
    for (let i = 0; i < count; i++) {
      list.push(
        <div className="ps-row" key={`${type}-${i}`}>
          <div className="ps-col-name">
            <i className="fa-solid fa-user"></i> Hành khách {i + 1}
          </div>
          <div className="ps-col-type">
            <span className="type-badge">{type}</span>
          </div>
          <div className="ps-col-status">
            <span className="status-text text-green">
              <i className="fa-solid fa-check-circle"></i> Xác nhận
            </span>
          </div>
        </div>,
      );
    }
    return list;
  };

  return (
    <div className="step3-success-wrapper">
      {/* 1. HEADER THÀNH CÔNG */}
      <div className="b-box success-header-box">
        <div className="success-icon-wrap">
          <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="success-title">Đặt Tour Thành Công!</h2>
        <p className="success-desc">
          Cảm ơn <strong>{contactInfo.fullName || "Quý khách"}</strong> đã tin
          tưởng lựa chọn dịch vụ của chúng tôi.
          <br />
          Thông tin xác nhận đã được gửi tới email{" "}
          <strong>{contactInfo.email || "của bạn"}</strong>.
        </p>

        <div className="order-ref-card">
          <span className="ref-label">Mã đơn hàng của bạn</span>
          <strong className="ref-number">
            #TVG-{Math.floor(100000 + Math.random() * 900000)}
          </strong>
        </div>
      </div>

      {/* 2. THÔNG TIN LIÊN HỆ */}
      <div className="b-box">
        <div className="box-header-flex">
          <h3>Thông tin liên hệ</h3>
          <span className="status-badge bg-green">Đã thanh toán</span>
        </div>
        <div className="contact-info-grid">
          <div className="ci-item">
            <span className="ci-label">Người đặt</span>
            <strong className="ci-value">
              {contactInfo.fullName || "Chưa cập nhật"}
            </strong>
          </div>
          <div className="ci-item">
            <span className="ci-label">Số điện thoại</span>
            <strong className="ci-value">
              {contactInfo.phone || "Chưa cập nhật"}
            </strong>
          </div>
          <div className="ci-item">
            <span className="ci-label">Email</span>
            <strong className="ci-value">
              {contactInfo.email || "Chưa cập nhật"}
            </strong>
          </div>
          <div className="ci-item">
            <span className="ci-label">Địa chỉ</span>
            <strong className="ci-value">
              {contactInfo.address || "Chưa cập nhật"}
            </strong>
          </div>
        </div>
      </div>

      {/* 3. DANH SÁCH HÀNH KHÁCH */}
      <div className="b-box">
        <h3>Danh sách hành khách</h3>
        <p className="box-subtext mb-15">
          Danh sách các thành viên tham gia chuyến đi.
        </p>

        <div className="passenger-success-list">
          {renderPassengerList("Người lớn", adultCount)}
          {renderPassengerList("Trẻ em", childCount)}
          {renderPassengerList("Em bé", infantCount)}
        </div>
      </div>

      {/* 4. NÚT ĐIỀU HƯỚNG */}
      <div className="success-actions-flex">
        <Link to="/" className="btn-action btn-outline">
          <i className="fa-solid fa-house"></i> Về trang chủ
        </Link>
        <Link to="/my-tours" className="btn-action btn-fill">
          Xem chuyến đi của tôi <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
