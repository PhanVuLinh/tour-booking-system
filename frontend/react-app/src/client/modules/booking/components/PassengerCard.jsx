import React, { useState } from "react";

const PassengerCard = ({ type, index, isAdult }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`passenger-card-wrapper ${isOpen ? "open" : ""}`}>
      <div className="pc-index">#{index}</div>

      <div className="pc-content">
        {/* TRẠNG THÁI THU GỌN */}
        <div
          className={`pc-collapsed ${isOpen ? "hidden" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          <span className="pc-label">
            {type} <span className="text-red">(*)</span>
          </span>
          <span className="pc-action text-red">Nhập thông tin &rarr;</span>
        </div>

        {/* TRẠNG THÁI MỞ RỘNG */}
        <div className={`pc-panel ${isOpen ? "open" : ""}`}>
          <div className="pc-panel-inner">
            <div
              className="pc-expanded-header"
              onClick={() => setIsOpen(false)}
            >
              <span className="pc-label">
                {type} <span className="text-red">(*)</span>
              </span>
              <span className="pc-action text-gray">Thu gọn &uarr;</span>
            </div>

            <div className="b-grid-2">
              <div className="form-group full-width">
                <label className="form-label">
                  Họ tên <span className="text-red">(*)</span>
                </label>
                <input
                  type="text"
                  className="b-input"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Ngày sinh <span className="text-red">(*)</span>
                </label>
                <input type="date" className="b-input" />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Giới tính <span className="text-red">(*)</span>
                </label>
                <select className="b-input" defaultValue="Nam">
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>

              {isAdult && (
                <div className="form-group full-width">
                  <label className="form-label">
                    Số điện thoại <span className="text-red">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: 0901234567"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerCard;
