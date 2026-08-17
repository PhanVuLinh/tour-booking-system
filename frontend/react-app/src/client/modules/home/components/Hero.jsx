import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

function Hero() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    destination: "",
    quantity: "",
    departureDate: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.destination)
      params.append("destination", searchData.destination);
    if (searchData.quantity) params.append("quantity", searchData.quantity);
    if (searchData.departureDate)
      params.append("date", searchData.departureDate);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <h1 className="hero-title">
          Du lịch Châu Á - Khám phá Mỹ, Úc, Âu <br />
          Đi nơi đâu bạn muốn
        </h1>
        <p className="hero-desc">
          Trải nghiệm dịch vụ đặt tour du lịch uy tín, tiện lợi với hàng ngàn hành trình hấp dẫn trong và ngoài nước cùng TravelGo!
        </p>

        <div className="hero-search-box">
          {/* Hàng 1: Bạn muốn đi đâu? */}
          <div className="search-row">
            <div className="search-input-group full-width">
              <i className="fa-solid fa-location-dot icon-left"></i>
              <input
                type="text"
                placeholder="Bạn muốn đi đâu?"
                name="destination"
                value={searchData.destination}
                onChange={(e) =>
                  setSearchData({ ...searchData, destination: e.target.value })
                }
              />
              <i className="fa-solid fa-chevron-down icon-right"></i>
            </div>
          </div>

          <div className="search-row grid-3">
            <div className="search-input-group">
              <i className="fa-regular fa-user icon-left"></i>
              <input
                type="text"
                placeholder="Số lượng"
                name="quantity"
                min="1"
                value={searchData.quantity}
                onChange={(e) => {
                  setSearchData({ ...searchData, quantity: e.target.value });
                }}
              />
              <i className="fa-solid fa-chevron-down icon-right"></i>
            </div>

            <div className="search-input-group custom-datepicker-wrapper">
              <i className="fa-regular fa-calendar icon-left"></i>
              <DatePicker
                selected={
                  searchData.departureDate
                    ? parseISO(searchData.departureDate)
                    : null
                }
                onChange={(date) =>
                  setSearchData({
                    ...searchData,
                    departureDate: date ? format(date, "yyyy-MM-dd") : "",
                  })
                }
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={10}
                scrollableYearDropdown
                minDate={new Date()}
                placeholderText="Lịch khởi hành (dd/mm/yyyy)"
                className="hero-date-picker-input"
              />
            </div>

            <button className="btn-search" onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i> Tìm Kiếm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
