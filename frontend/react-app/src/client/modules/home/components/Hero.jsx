import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import { getSuggestions, searchTours } from "../../tours/services/tourService";
import { LiveSearchDropdown } from "../../../shared";

function Hero() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    destination: "",
    quantity: "",
    departureDate: "",
  });

  const [suggestions, setSuggestions] = useState({
    locations: [],
    popularTours: [],
  });
  const [richPopularTours, setRichPopularTours] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputGroupRef = useRef(null);

  useEffect(() => {
    // 1. Tải gợi ý danh mục và điểm đi
    getSuggestions()
      .then((result) => {
        if (result.success && result.data) {
          setSuggestions(result.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải gợi ý:", error);
      });

    // 2. Tải tour nổi bật có đầy đủ ảnh, giá, thời gian
    searchTours({ limit: 6 })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const uniqueMap = new Map();
          res.data.forEach((t) => {
            if (!uniqueMap.has(t.slug)) {
              uniqueMap.set(t.slug, t);
            }
          });
          setRichPopularTours(Array.from(uniqueMap.values()));
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải tour nổi bật:", err);
      });
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputGroupRef.current && !inputGroupRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.destination.trim())
      params.append("destination", searchData.destination.trim());
    if (searchData.quantity) params.append("quantity", searchData.quantity);
    if (searchData.departureDate)
      params.append("date", searchData.departureDate);
    setShowSuggestions(false);
    navigate(`/search?${params.toString()}`);
  };

  const handleSelectTour = (tour) => {
    setShowSuggestions(false);
    navigate(`/tours/detail/${tour.slug}`);
  };

  const handleSelectLocation = (loc) => {
    setSearchData((prev) => ({ ...prev, destination: loc }));
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (
      suggestions.locations.some(
        (d) => d.toLowerCase() === loc.toLowerCase(),
      )
    ) {
      params.append("departure_from", loc);
    } else {
      params.append("destination", loc);
    }
    if (searchData.quantity) params.append("quantity", searchData.quantity);
    if (searchData.departureDate)
      params.append("date", searchData.departureDate);
    navigate(`/search?${params.toString()}`);
  };

  const handleViewAll = (term) => {
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (term?.trim()) params.append("destination", term.trim());
    if (searchData.quantity) params.append("quantity", searchData.quantity);
    if (searchData.departureDate)
      params.append("date", searchData.departureDate);
    navigate(`/search?${params.toString()}`);
  };

  const handleQuickTagClick = (tagText) => {
    const params = new URLSearchParams();
    params.append("destination", tagText);
    navigate(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      handleSearch();
    }
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className="hero-badge-line">
          <span className="hero-badge">
            <i className="fa-solid fa-fire"></i> Hơn 500+ tour đang chờ bạn
          </span>
        </div>
        <h1 className="hero-title">
          Du lịch Châu Á - Khám phá Mỹ, Úc, Âu <br />
          Đi nơi đâu bạn muốn
        </h1>
        <p className="hero-desc">
          Trải nghiệm dịch vụ đặt tour du lịch uy tín, tiện lợi với hàng ngàn
          hành trình hấp dẫn trong và ngoài nước cùng TravelGo!
        </p>

        <div className="hero-search-box">
          {/* Hàng 1: Bạn muốn đi đâu? */}
          <div className="search-row">
            <div className="search-input-group full-width" ref={inputGroupRef}>
              <i className="fa-solid fa-location-dot icon-left"></i>
              <input
                type="text"
                placeholder="Bạn muốn đi đâu? (ví dụ: Đà Lạt, Phú Quốc, Thái Lan...)"
                name="destination"
                value={searchData.destination}
                autoComplete="off"
                onChange={(e) => {
                  setSearchData({ ...searchData, destination: e.target.value });
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
              />
              {searchData.destination && (
                <button
                  className="hero-input-clear"
                  onClick={() => {
                    setSearchData({ ...searchData, destination: "" });
                  }}
                  type="button"
                  title="Xoá tìm kiếm"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}

              {/* Modern Live Search Dropdown */}
              <LiveSearchDropdown
                isOpen={showSuggestions}
                onClose={() => setShowSuggestions(false)}
                keyword={searchData.destination}
                onSelectTour={handleSelectTour}
                onSelectLocation={handleSelectLocation}
                onViewAll={handleViewAll}
                popularLocations={suggestions.locations}
                popularTours={
                  richPopularTours.length > 0
                    ? richPopularTours
                    : suggestions.popularTours
                }
              />
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

        {/* Quick Tags */}
        {suggestions.popularTours.length > 0 && (
          <div className="hero-quick-tags">
            <span className="hero-qt-label">
              <i className="fa-solid fa-bolt"></i> Phổ biến:
            </span>
            {suggestions.popularTours.map((tour, index) => (
              <button
                key={index}
                className="hero-qt-chip"
                onClick={() => handleQuickTagClick(tour.title)}
                type="button"
              >
                {tour.title.length > 25
                  ? tour.title.substring(0, 25) + "..."
                  : tour.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
