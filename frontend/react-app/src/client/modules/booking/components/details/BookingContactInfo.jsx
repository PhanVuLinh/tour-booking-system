import React from "react";

export default function BookingContactInfo({ contact, note }) {
  if (!contact) return null;

  return (
    <div className="bd-section lookup-section">
      <h3 className="bd-section-title lookup-section-title">
        <i className="fa-solid fa-address-book lookup-section-icon"></i>
        Thông tin người đặt tour
      </h3>

      <div className="bd-grid-info">
        <div className="bd-info-item">
          <span className="label">Họ và tên:</span>
          <span className="value">
            <strong>{contact.full_name || "Chưa cập nhật"}</strong>
          </span>
        </div>

        <div className="bd-info-item">
          <span className="label">Số điện thoại:</span>
          <span className="value">
            <strong>{contact.phone || "Chưa cập nhật"}</strong>
          </span>
        </div>

        <div className="bd-info-item">
          <span className="label">Email:</span>
          <span className="value">
            <strong>{contact.email || "Chưa cập nhật"}</strong>
          </span>
        </div>

        <div className="bd-info-item">
          <span className="label">Địa chỉ:</span>
          <span className="value">{contact.address || "Không có"}</span>
        </div>
      </div>

      {note && (
        <div className="bd-note-box lookup-note-box">
          <strong>Ghi chú:</strong> {note}
        </div>
      )}
    </div>
  );
}
