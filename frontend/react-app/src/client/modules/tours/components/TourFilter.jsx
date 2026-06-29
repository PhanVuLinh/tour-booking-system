import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getDepartureLocations } from "../services/tourService";

function TourFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [departureLocations, setDepartureLocations] = useState([]);
  
  // Lấy danh sách điểm đi từ backend khi render lần đầu
  useEffect(() => {
    getDepartureLocations()
      .then(res => {
        if (res.success) {
          setDepartureLocations(res.data);
        }
      })
      .catch(err => console.log("Lỗi tải điểm đi:", err));
  }, []);

  // Trạng thái lưu trữ xem bộ lọc trên mobile đang mở hay đóng
  const [isOpen, setIsOpen] = useState(false);

  // Trạng thái lưu các giá trị lọc cục bộ trước khi Áp Dụng
  const [filters, setFilters] = useState({
    departureFrom: searchParams.get("departureFrom") || "",
    priceLevel: searchParams.get("priceLevel") || "",
    startDate: searchParams.get("startDate") || "",
    adults: searchParams.get("adults") || "0",
    children: searchParams.get("children") || "0",
    babies: searchParams.get("babies") || "0",
  });

  // Đồng bộ lại filters nếu URL thay đổi
  useEffect(() => {
    setFilters({
      departureFrom: searchParams.get("departureFrom") || "",
      priceLevel: searchParams.get("priceLevel") || "",
      startDate: searchParams.get("startDate") || "",
      adults: searchParams.get("adults") || "0",
      children: searchParams.get("children") || "0",
      babies: searchParams.get("babies") || "0",
    });
  }, [searchParams]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Nút Áp Dụng: Đẩy filters lên URL
  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    
    if (filters.departureFrom) {
      params.set("departureFrom", filters.departureFrom);
    } else {
      params.delete("departureFrom");
    }

    if (filters.priceLevel) {
      params.set("priceLevel", filters.priceLevel);
    } else {
      params.delete("priceLevel");
    }

    if (filters.startDate) {
      params.set("startDate", filters.startDate);
    } else {
      params.delete("startDate");
    }

    if (filters.adults && parseInt(filters.adults) > 0) {
      params.set("adults", filters.adults);
    } else {
      params.delete("adults");
    }

    if (filters.children && parseInt(filters.children) > 0) {
      params.set("children", filters.children);
    } else {
      params.delete("children");
    }

    if (filters.babies && parseInt(filters.babies) > 0) {
      params.set("babies", filters.babies);
    } else {
      params.delete("babies");
    }

    // Reset về trang 1
    params.set("page", "1");
    
    setSearchParams(params);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setFilters({
      departureFrom: "",
      priceLevel: "",
      startDate: "",
      adults: "0",
      children: "0",
      babies: "0",
    });

    setSearchParams({ page: "1" });
    setIsOpen(false);
  };

  // Kiểm tra xem có bất kỳ bộ lọc nào đang active trên URL không
  const hasActiveFilter = 
    searchParams.has("departureFrom") || 
    searchParams.has("priceLevel") || 
    searchParams.has("startDate") || 
    searchParams.has("adults") || 
    searchParams.has("children") || 
    searchParams.has("babies");

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
            <select 
              className="filter-select" 
              name="departureFrom"
              value={filters.departureFrom}
              onChange={handleChange}
            >
              <option value="">
                -- Tất cả điểm đi --
              </option>
              {departureLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày khởi hành */}
          <div className="filter-group">
            <label className="filter-label">Ngày khởi hành</label>
            <input 
              type="date" 
              className="filter-input"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
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
                  name="adults"
                  min="0"
                  value={filters.adults}
                  onChange={handleChange}
                />
              </div>
              <div className="passenger-item">
                <span className="passenger-label">Trẻ em:</span>
                <input
                  className="passenger-value"
                  type="number"
                  name="children"
                  min="0"
                  value={filters.children}
                  onChange={handleChange}
                />
              </div>
              <div className="passenger-item">
                <span className="passenger-label">Em bé:</span>
                <input
                  className="passenger-value"
                  type="number"
                  name="babies"
                  min="0"
                  value={filters.babies}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Mức giá */}
          <div className="filter-group">
            <label className="filter-label">Mức giá</label>
            <select 
              className="filter-select" 
              name="priceLevel"
              value={filters.priceLevel}
              onChange={handleChange}
            >
              <option value="">
                -- Tất cả mức giá --
              </option>
              <option value="1">Dưới 5 triệu</option>
              <option value="2">5 - 10 triệu</option>
              <option value="3">Trên 10 triệu</option>
            </select>
          </div>

          {/* Nút tác vụ */}
          <div className="filter-actions" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              type="button"
              className="btn-apply-filter"
              style={{ flex: 1 }}
              onClick={handleApply}
            >
              Áp Dụng
            </button>
            
            {hasActiveFilter && (
              <button
                type="button"
                className="btn-clear-filter"
                style={{ 
                  flex: 1, 
                  backgroundColor: "#f4f4f4", 
                  color: "#333", 
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
                onClick={handleClearFilter}
              >
                Xóa Lọc
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default TourFilter;
