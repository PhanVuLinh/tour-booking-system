import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

const PassengerCard = ({ type, index, isAdult, groupKey, passengerData = {}, onDataChange, formErrors = {}, arrayIndex }) => {
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
                  className={`b-input ${formErrors[`passengerDetails.${groupKey}.${arrayIndex}.full_name`] ? "error-border" : ""}`}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={passengerData.full_name || ""}
                  onChange={(e) => onDataChange("full_name", e.target.value)}
                />
                {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.full_name`] && (
                  <span className="error-text">
                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "4px" }}></i>
                    {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.full_name`]}
                  </span>
                )}
              </div>

              <div className="form-group custom-datepicker-wrapper">
                <label className="form-label">
                  Ngày sinh <span className="text-red">(*)</span>
                </label>
                <DatePicker
                  selected={passengerData.dob ? parseISO(passengerData.dob) : null}
                  onChange={(date) => onDataChange("dob", date ? format(date, "yyyy-MM-dd") : "")}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  maxDate={new Date()}
                  minDate={new Date("1920-01-01")}
                  className={`b-input ${formErrors[`passengerDetails.${groupKey}.${arrayIndex}.dob`] ? "error-border" : ""}`}
                  placeholderText="dd/mm/yyyy"
                />
                {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.dob`] && (
                  <span className="error-text">
                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "4px" }}></i>
                    {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.dob`]}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Giới tính <span className="text-red">(*)</span>
                </label>
                <select
                  className={`b-input ${formErrors[`passengerDetails.${groupKey}.${arrayIndex}.gender`] ? "error-border" : ""}`}
                  value={passengerData.gender || "Nam"}
                  onChange={(e) => onDataChange("gender", e.target.value)}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.gender`] && (
                  <span className="error-text">
                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "4px" }}></i>
                    {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.gender`]}
                  </span>
                )}
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  CMND/CCCD/Passport (Nếu có)
                </label>
                <input
                  type="text"
                  className={`b-input ${formErrors[`passengerDetails.${groupKey}.${arrayIndex}.identity_card`] ? "error-border" : ""}`}
                  placeholder="Ví dụ: 079099123456"
                  value={passengerData.identity_card || ""}
                  onChange={(e) => onDataChange("identity_card", e.target.value)}
                />
                {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.identity_card`] && (
                  <span className="error-text">
                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "4px" }}></i>
                    {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.identity_card`]}
                  </span>
                )}
              </div>

              {isAdult && (
                <div className="form-group full-width">
                  <label className="form-label">
                    Số điện thoại <span className="text-red">(*)</span>
                  </label>
                  <input
                    type="text"
                    className={`b-input ${formErrors[`passengerDetails.${groupKey}.${arrayIndex}.phone`] ? "error-border" : ""}`}
                    placeholder="Ví dụ: 0901234567"
                    value={passengerData.phone || ""}
                    onChange={(e) => onDataChange("phone", e.target.value)}
                  />
                  {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.phone`] && (
                    <span className="error-text">
                      <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "4px" }}></i>
                      {formErrors[`passengerDetails.${groupKey}.${arrayIndex}.phone`]}
                    </span>
                  )}
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
