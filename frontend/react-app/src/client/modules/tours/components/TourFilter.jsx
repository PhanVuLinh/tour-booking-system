import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getDepartureLocations } from "../services/tourService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

function TourFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [departureLocations, setDepartureLocations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getDepartureLocations()
      .then((res) => {
        if (res.success) {
          setDepartureLocations(res.data);
        }
      })
      .catch((err) => console.log("Lỗi tải điểm đi:", err));
  }, []);

  const [filters, setFilters] = useState({
    departure_from: searchParams.get("departure_from") || "",
    priceLevel: searchParams.get("priceLevel") || "",
    start_date: searchParams.get("start_date") || "",
    adults: searchParams.get("adults") || "0",
    children: searchParams.get("children") || "0",
    babies: searchParams.get("babies") || "0",
  });

  // Đồng bộ lại filters khi URL search params thay đổi
  useEffect(() => {
    setFilters({
      departure_from: searchParams.get("departure_from") || "",
      priceLevel: searchParams.get("priceLevel") || "",
      start_date: searchParams.get("start_date") || "",
      adults: searchParams.get("adults") || "0",
      children: searchParams.get("children") || "0",
      babies: searchParams.get("babies") || "0",
    });
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (filters.departure_from) {
      params.set("departure_from", filters.departure_from);
    } else {
      params.delete("departure_from");
    }

    if (filters.priceLevel) {
      params.set("priceLevel", filters.priceLevel);
    } else {
      params.delete("priceLevel");
    }

    if (filters.start_date) {
      params.set("start_date", filters.start_date);
    } else {
      params.delete("start_date");
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

    params.set("page", "1");
    setSearchParams(params);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setFilters({
      departure_from: "",
      priceLevel: "",
      start_date: "",
      adults: "0",
      children: "0",
      babies: "0",
    });

    setSearchParams({ page: "1" });
    setIsOpen(false);
  };

  const hasActiveFilter =
    searchParams.has("departure_from") ||
    searchParams.has("priceLevel") ||
    searchParams.has("start_date") ||
    searchParams.has("adults") ||
    searchParams.has("children") ||
    searchParams.has("babies");

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Trigger & Overlay */}
      <button className="mobile-filter-btn" onClick={toggleFilter}>
        <i className="fa-solid fa-filter"></i> Lọc Tour
      </button>

      <div
        className={`filter-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleFilter}
      ></div>

      <aside className={`tour-filter ${isOpen ? "active" : ""}`}>
        <div className="filter-header">
          <h3>Bộ Lọc</h3>
          <button className="close-filter-btn" onClick={toggleFilter}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <i className="fa-solid fa-filter desktop-filter-icon"></i>
        </div>

        <div className="filter-body">
          <div className="filter-group">
            <label className="filter-label">Điểm đi</label>
            <select
              className="filter-select"
              name="departure_from"
              value={filters.departure_from}
              onChange={handleChange}
            >
              <option value="">-- Tất cả điểm đi --</option>
              {departureLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group custom-datepicker-wrapper">
            <label className="filter-label">Ngày khởi hành</label>
            <DatePicker
              selected={
                filters.start_date ? parseISO(filters.start_date) : null
              }
              onChange={(date) => {
                setFilters((prev) => ({
                  ...prev,
                  start_date: date ? format(date, "yyyy-MM-dd") : "",
                }));
              }}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              yearDropdownItemNumber={10}
              scrollableYearDropdown
              minDate={new Date()}
              className="filter-input"
              placeholderText="dd/mm/yyyy"
            />
          </div>

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

          <div className="filter-group">
            <label className="filter-label">Mức giá</label>
            <select
              className="filter-select"
              name="priceLevel"
              value={filters.priceLevel}
              onChange={handleChange}
            >
              <option value="">-- Tất cả mức giá --</option>
              <option value="1">Dưới 5 triệu</option>
              <option value="2">5 - 10 triệu</option>
              <option value="3">Trên 10 triệu</option>
            </select>
          </div>

          <div
            className="filter-actions"
            style={{ display: "flex", gap: "10px", marginTop: "15px" }}
          >
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
                  cursor: "pointer",
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
