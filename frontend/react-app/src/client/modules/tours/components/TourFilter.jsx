import { useState } from "react";

function TourFilter() {
  // Trạng thái lưu trữ xem bộ lọc trên mobile đang mở hay đóng
  const [isOpen, setIsOpen] = useState(false);

  // Hàm bật/tắt bộ lọc
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 1. NÚT BẤM TRÊN MOBILE (Chỉ hiện trên điện thoại) */}
      <button className="mobile-filter-btn" onClick={toggleFilter}>
        <i className="fa-solid fa-filter"></i> Lọc Tour
      </button>

      {/* 2. LỚP PHỦ NỀN ĐEN TRÊN MOBILE (Bấm vào đây để đóng bộ lọc) */}
      <div
        className={`filter-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleFilter}
      ></div>

      {/* 3. KHỐI BỘ LỌC CHÍNH */}
      {/* Thêm class "active" nếu state isOpen = true */}
      <aside className={`tour-filter ${isOpen ? "active" : ""}`}>
        <div className="filter-header">
          <h3>Bộ Lọc</h3>

          {/* Nút X để đóng (Chỉ hiện trên mobile) */}
          <button className="close-filter-btn" onClick={toggleFilter}>
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Icon phễu mặc định (Chỉ hiện trên máy tính) */}
          <i className="fa-solid fa-filter desktop-filter-icon"></i>
        </div>

        <div className="filter-body">
          {/* Điểm đi */}
          <div className="filter-group">
            <label className="filter-label">Điểm đi</label>
            <select className="filter-select" defaultValue="">
              <option value="" disabled>
                -- Chọn điểm đi --
              </option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
            </select>
          </div>

          {/* Điểm đến */}
          <div className="filter-group">
            <label className="filter-label">Điểm đến</label>
            <select className="filter-select" defaultValue="">
              <option value="" disabled>
                -- Chọn điểm đến --
              </option>
              <option value="singapore">Singapore</option>
              <option value="thailand">Thái Lan</option>
            </select>
          </div>

          {/* Ngày khởi hành */}
          <div className="filter-group">
            <label className="filter-label">Ngày khởi hành</label>
            <input type="date" className="filter-input" />
          </div>

          {/* Số lượng hành khách */}
          <div className="filter-group">
            <label className="filter-label">Số Lượng Hành Khách</label>
            <div className="passenger-inputs">
              <div className="passenger-item">
                <span className="passenger-label">Người lớn:</span>
                <input
                  className="passenger-value"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </div>
              <div className="passenger-item">
                <span className="passenger-label">Trẻ em:</span>
                <input
                  className="passenger-value"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </div>
              <div className="passenger-item">
                <span className="passenger-label">Em bé:</span>
                <input
                  className="passenger-value"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </div>
            </div>
          </div>

          {/* Mức giá */}
          <div className="filter-group">
            <label className="filter-label">Mức giá</label>
            <select className="filter-select" defaultValue="">
              <option value="" disabled>
                -- Chọn khoảng giá --
              </option>
              <option value="1">Dưới 5 triệu</option>
              <option value="2">5 - 10 triệu</option>
              <option value="3">Trên 10 triệu</option>
            </select>
          </div>

          {/* Nút áp dụng - Bấm vào thì tự động đóng menu trên mobile luôn cho xịn */}
          <button
            type="button"
            className="btn-apply-filter"
            onClick={toggleFilter}
          >
            Áp Dụng
          </button>
        </div>
      </aside>
    </>
  );
}

export default TourFilter;
