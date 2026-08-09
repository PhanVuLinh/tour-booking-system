import PassengerCard from "./PassengerCard";
import { Link } from "react-router-dom";

const Step1Info = ({
  adultCount,
  childCount,
  infantCount,
  updatePassenger,
  formData,
  setFormData,
  formErrors,
}) => {

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handlePassengerChange = (groupKey, index, field, value) => {
    setFormData((prev) => {
      const newDetails = { ...prev.passengerDetails };
      if (!newDetails[groupKey]) newDetails[groupKey] = [];
      newDetails[groupKey][index] = {
        ...newDetails[groupKey][index],
        [field]: value,
      };
      return { ...prev, passengerDetails: newDetails };
    });
  };

  const renderPassengerGroup = (type, count, isAdult, subtitle) => {
    if (count === 0) return null;

    const groupKey =
      type === "Người lớn"
        ? "adults"
        : type === "Trẻ em"
          ? "children"
          : "infants";

    return (
      <div className="passenger-group" key={type}>
        <div className="pg-header">
          <i className="fa-solid fa-user-group pg-icon"></i>
          <span className="pg-title">{type}</span>
          <span className="pg-subtitle">{subtitle}</span>
        </div>

        <div className="pg-list">
          {Array.from({ length: count }).map((_, i) => {
            const passengerData =
              formData.passengerDetails?.[groupKey]?.[i] || {};
            return (
              <PassengerCard
                key={`${type}-${i}`}
                type={type}
                index={i + 1}
                isAdult={isAdult}
                groupKey={groupKey}
                passengerData={passengerData}
                onDataChange={(field, value) =>
                  handlePassengerChange(groupKey, i, field, value)
                }
                formErrors={formErrors}
                arrayIndex={i}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Khối Thông tin liên lạc */}
      <div className="b-box contact-box">
        <h3>Thông tin liên lạc</h3>
        {/* <div className="login-banner blue-banner">
          <i className="fa-solid fa-circle-user"></i>
          <span>
            <a href="#" className="login-link">
              Đăng nhập
            </a>{" "}
            để nhận ưu đãi và quản lý đơn hàng dễ dàng hơn!
          </span>
        </div> */}
        {localStorage.getItem("client_token") ? (
          <div className="login-banner blue-banner">
            <i className="fa-solid fa-circle-check"></i>
            <span>
              Tuyệt vời! Thông tin liên hệ của bạn đã được điền tự động.
            </span>
          </div>
        ) : (
          <div className="login-banner blue-banner">
            <i className="fa-solid fa-circle-user"></i>
            <span>
              <Link to="/login" className="login-link">
                Đăng nhập
              </Link>{" "}
              để nhận ưu đãi và quản lý đơn hàng dễ dàng hơn!
            </span>
          </div>
        )}
        <div className="b-grid-2">
          <div className="form-group">
            <label className="form-label">
              Họ tên <span className="text-red">(*)</span>
            </label>
            <input
              type="text"
              className={`b-input ${formErrors["contact.full_name"] ? "error-border" : ""}`}
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData?.contact?.full_name || ""}
              onChange={(e) => handleContactChange("full_name", e.target.value)}
            />
            {formErrors["contact.full_name"] && (
              <span className="error-text">
                <i
                  className="fa-solid fa-circle-exclamation"
                  style={{ marginRight: "4px" }}
                ></i>
                {formErrors["contact.full_name"]}
              </span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">
              Số điện thoại <span className="text-red">(*)</span>
            </label>
            <input
              type="text"
              className={`b-input ${formErrors["contact.phone"] ? "error-border" : ""}`}
              placeholder="Ví dụ: 0901234567"
              value={formData?.contact?.phone || ""}
              onChange={(e) => handleContactChange("phone", e.target.value)}
            />
            {formErrors["contact.phone"] && (
              <span className="error-text">
                <i
                  className="fa-solid fa-circle-exclamation"
                  style={{ marginRight: "4px" }}
                ></i>
                {formErrors["contact.phone"]}
              </span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">
              Email <span className="text-red">(*)</span>
            </label>
            <input
              type="email"
              className={`b-input ${formErrors["contact.email"] ? "error-border" : ""}`}
              placeholder="Ví dụ: email@travelgo.com"
              value={formData?.contact?.email || ""}
              onChange={(e) => handleContactChange("email", e.target.value)}
            />
            {formErrors["contact.email"] && (
              <span className="error-text">
                <i
                  className="fa-solid fa-circle-exclamation"
                  style={{ marginRight: "4px" }}
                ></i>
                {formErrors["contact.email"]}
              </span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input
              type="text"
              className="b-input"
              placeholder="Ví dụ: 190 Pasteur, Phường Xuân Hòa, TP.HCM"
              value={formData?.contact?.address || ""}
              onChange={(e) => handleContactChange("address", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Khối Tăng / Giảm số lượng số người */}
      <div className="b-box passenger-quantity-box">
        <h3>Hành khách</h3>
        <div className="pq-grid">
          <div className="pq-item">
            <div className="pq-info">
              <div className="pq-name">Người lớn</div>
              <div className="pq-desc">
                Từ 12 tuổi trở lên <i className="fa-solid fa-circle-info"></i>
              </div>
            </div>
            <div className="pq-stepper">
              <button
                type="button"
                className="pq-btn"
                onClick={() => updatePassenger("adult", "sub")}
                disabled={adultCount <= 1}
              >
                -
              </button>
              <span className="pq-count">{adultCount}</span>
              <button
                type="button"
                className="pq-btn"
                onClick={() => updatePassenger("adult", "add")}
              >
                +
              </button>
            </div>
          </div>

          <div className="pq-item">
            <div className="pq-info">
              <div className="pq-name">Trẻ em</div>
              <div className="pq-desc">
                Từ 2 - 11 tuổi <i className="fa-solid fa-circle-info"></i>
              </div>
            </div>
            <div className="pq-stepper">
              <button
                type="button"
                className="pq-btn"
                onClick={() => updatePassenger("child", "sub")}
                disabled={childCount <= 0}
              >
                -
              </button>
              <span className="pq-count">{childCount}</span>
              <button
                type="button"
                className="pq-btn"
                onClick={() => updatePassenger("child", "add")}
              >
                +
              </button>
            </div>
          </div>

          <div className="pq-item">
            <div className="pq-info">
              <div className="pq-name">Em bé</div>
              <div className="pq-desc">
                Dưới 2 tuổi <i className="fa-solid fa-circle-info"></i>
              </div>
            </div>
            <div className="pq-stepper">
              <button
                type="button"
                className="pq-btn"
                onClick={() => updatePassenger("infant", "sub")}
                disabled={infantCount <= 0}
              >
                -
              </button>
              <span className="pq-count">{infantCount}</span>
              <button
                type="button"
                className="pq-btn"
                onClick={() => updatePassenger("infant", "add")}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Khối Danh sách nhập dữ liệu các hành khách */}
      <div className="b-box passenger-box">
        <h3>Thông tin hành khách</h3>
        {renderPassengerGroup(
          "Người lớn",
          adultCount,
          true,
          "(Từ 12 tuổi trở lên)",
        )}
        {renderPassengerGroup("Trẻ em", childCount, false, "(Từ 2 - 11 tuổi)")}
        {renderPassengerGroup("Em bé", infantCount, false, "(Dưới 2 tuổi)")}
      </div>

      {/* Khối Ghi chú */}
      <div className="b-box">
        <h3>Ghi chú</h3>
        <p className="box-subtext">
          Vui lòng cho chúng tôi biết nếu Quý khách có ghi chú hoặc yêu cầu đặc
          biệt.
        </p>
        <textarea
          className="b-input"
          rows="4"
          placeholder="Ví dụ: Bữa ăn chay, đến muộn,..."
          value={formData?.note || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, note: e.target.value }))
          }
        ></textarea>
      </div>
    </>
  );
};

export default Step1Info;
