import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TourCard } from "../components";
import { Pagination, LiveSearchDropdown } from "../../../shared";
import {
  searchTours,
  getSuggestions,
  getDepartureLocations,
} from "../services/tourService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  // Filters & search state
  const destination = searchParams.get("destination") || "";
  const quantity = searchParams.get("quantity") || "";
  const date = searchParams.get("date") || "";
  const departure_from = searchParams.get("departure_from") || "";
  const priceLevel = searchParams.get("priceLevel") || "";
  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || "1";

  // Inline search bar
  const [inlineSearch, setInlineSearch] = useState(destination);
  const [inlineDate, setInlineDate] = useState(date);
  const [departureLocations, setDepartureLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showInlineSuggestions, setShowInlineSuggestions] = useState(false);
  const inlineSugRef = useRef(null);
  const inlineInputRef = useRef(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTours: 0,
  });

  // Lấy departure locations & suggestions
  useEffect(() => {
    getDepartureLocations()
      .then((res) => {
        if (res.success) setDepartureLocations(res.data);
      })
      .catch((err) => console.log("Lỗi tải điểm đi:", err));

    getSuggestions()
      .then((res) => {
        if (res.success && res.data) {
          const allSugs = [
            ...res.data.locations.map((l) => ({
              type: "location",
              text: l,
            })),
            ...res.data.popularTours.map((t) => ({
              type: "tour",
              text: t.title,
              slug: t.slug,
            })),
          ];
          setSuggestions(allSugs);
        }
      })
      .catch((err) => console.log("Lỗi tải gợi ý:", err));
  }, []);

  // Đóng suggestion dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inlineSugRef.current &&
        !inlineSugRef.current.contains(e.target) &&
        inlineInputRef.current &&
        !inlineInputRef.current.contains(e.target)
      ) {
        setShowInlineSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setAnimateCards(false);

      try {
        let response = await searchTours({
          destination,
          quantity,
          date,
          departure_from,
          priceLevel,
          sort,
          page,
        });

        // Nếu tìm theo destination không có kết quả nhưng từ khóa là một điểm khởi hành (ví dụ: Hà Nội, Hải Phòng)
        if (
          (!response.data || response.data.length === 0) &&
          destination?.trim() &&
          !departure_from
        ) {
          const fallbackRes = await searchTours({
            departure_from: destination.trim(),
            quantity,
            date,
            priceLevel,
            sort,
            page,
          });
          if (fallbackRes.success && fallbackRes.data?.length > 0) {
            response = fallbackRes;
          }
        }

        if (response.success) {
          setTours(response.data || []);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          setTours([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setTours([]);
      } finally {
        setLoading(false);
        // Trigger card animation sau khi load
        setTimeout(() => setAnimateCards(true), 50);
      }
    };

    fetchTours();
  }, [destination, quantity, date, departure_from, priceLevel, sort, page]);

  // Sync inline search khi URL thay đổi
  useEffect(() => {
    setInlineSearch(destination);
    setInlineDate(date);
  }, [destination, date]);

  const handleInlineSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (inlineSearch.trim()) {
      params.set("destination", inlineSearch.trim());
    } else {
      params.delete("destination");
    }
    if (inlineDate) {
      params.set("date", inlineDate);
    } else {
      params.delete("date");
    }
    params.set("page", "1");
    setSearchParams(params);
    setShowInlineSuggestions(false);
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleClearAllFilters = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    params.set("page", "1");
    setSearchParams(params);
  };

  const hasActiveFilter = departure_from || priceLevel || sort;

  const filteredInlineSuggestions = inlineSearch.trim()
    ? suggestions
        .filter((s) =>
          s.text.toLowerCase().includes(inlineSearch.toLowerCase().trim()),
        )
        .slice(0, 5)
    : [];

  const handleInlineSuggestionClick = (item) => {
    if (item.type === "tour") {
      navigate(`/tours/detail/${item.slug}`);
    } else {
      setInlineSearch(item.text);
      setShowInlineSuggestions(false);
      const params = new URLSearchParams(searchParams);
      params.set("destination", item.text);
      params.set("page", "1");
      setSearchParams(params);
    }
  };

  return (
    <div className="search-page-wrapper">
      <div className="container">
        {/* INLINE SEARCH BAR */}
        <div className="sp-search-bar">
          <div className="sp-search-bar-inner">
            <div className="sp-search-input-wrap" ref={inlineInputRef}>
              <i className="fa-solid fa-magnifying-glass sp-search-icon"></i>
              <input
                type="text"
                className="sp-search-input"
                placeholder="Tìm kiếm tour, điểm đến..."
                value={inlineSearch}
                autoComplete="off"
                onChange={(e) => {
                  setInlineSearch(e.target.value);
                  setShowInlineSuggestions(true);
                }}
                onFocus={() => setShowInlineSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setShowInlineSuggestions(false);
                    handleInlineSearch();
                  }
                }}
              />
              {inlineSearch && (
                <button
                  className="sp-search-clear"
                  onClick={() => {
                    setInlineSearch("");
                  }}
                  type="button"
                  title="Xoá tìm kiếm"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}

              {/* Modern Live Search Dropdown */}
              <LiveSearchDropdown
                isOpen={showInlineSuggestions}
                onClose={() => setShowInlineSuggestions(false)}
                keyword={inlineSearch}
                onSelectTour={(tour) => {
                  setShowInlineSuggestions(false);
                  navigate(`/tours/detail/${tour.slug}`);
                }}
                onSelectLocation={(loc) => {
                  setInlineSearch(loc);
                  setShowInlineSuggestions(false);
                  if (
                    departureLocations.some(
                      (d) => d.toLowerCase() === loc.toLowerCase(),
                    )
                  ) {
                    const params = new URLSearchParams(searchParams);
                    params.delete("destination");
                    params.set("departure_from", loc);
                    params.set("page", "1");
                    setSearchParams(params);
                  } else {
                    handleFilterChange("destination", loc);
                  }
                }}
                onViewAll={(term) => {
                  setInlineSearch(term || "");
                  setShowInlineSuggestions(false);
                  handleInlineSearch();
                }}
                popularLocations={departureLocations}
                popularTours={tours.slice(0, 4)}
              />
            </div>

            <div className="sp-search-date-wrap custom-datepicker-wrapper">
              <i className="fa-regular fa-calendar sp-date-icon"></i>
              <DatePicker
                selected={inlineDate ? parseISO(inlineDate) : null}
                onChange={(d) =>
                  setInlineDate(d ? format(d, "yyyy-MM-dd") : "")
                }
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                minDate={new Date()}
                placeholderText="Chọn ngày"
                className="sp-date-input"
              />
            </div>

            <button className="sp-search-btn" onClick={handleInlineSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="sp-filter-bar">
          <div className="sp-filter-pills">
            {/* Điểm đi */}
            <div className="sp-pill-wrap">
              <select
                className="sp-pill-select"
                value={departure_from}
                onChange={(e) =>
                  handleFilterChange("departure_from", e.target.value)
                }
              >
                <option value="">Điểm đi</option>
                {departureLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down sp-pill-chevron"></i>
            </div>

            {/* Mức giá */}
            <div className="sp-pill-wrap">
              <select
                className="sp-pill-select"
                value={priceLevel}
                onChange={(e) =>
                  handleFilterChange("priceLevel", e.target.value)
                }
              >
                <option value="">Mức giá</option>
                <option value="1">Dưới 5 triệu</option>
                <option value="2">5 - 10 triệu</option>
                <option value="3">Trên 10 triệu</option>
              </select>
              <i className="fa-solid fa-chevron-down sp-pill-chevron"></i>
            </div>

            {/* Sắp xếp */}
            <div className="sp-pill-wrap">
              <select
                className="sp-pill-select"
                value={sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="">Sắp xếp</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
                <option value="hot">Khuyến mại hot</option>
              </select>
              <i className="fa-solid fa-chevron-down sp-pill-chevron"></i>
            </div>

            {/* Xóa bộ lọc */}
            {hasActiveFilter && (
              <button
                className="sp-pill-clear"
                onClick={handleClearAllFilters}
                type="button"
              >
                <i className="fa-solid fa-rotate-right"></i> Xóa lọc
              </button>
            )}
          </div>

          <div className="sp-results-count">
            {!loading && (
              <span>
                Tìm thấy <strong>{pagination.totalTours || tours.length}</strong> tour
              </span>
            )}
          </div>
        </div>

        {/* SEARCH SUMMARY */}
        {(destination || quantity || date) && (
          <div className="sp-search-tags">
            <span className="sp-tags-label">Đang tìm:</span>
            {destination && (
              <span className="sp-tag">
                <i className="fa-solid fa-location-dot"></i> {destination}
              </span>
            )}
            {quantity && (
              <span className="sp-tag">
                <i className="fa-solid fa-user-group"></i> {quantity} người
              </span>
            )}
            {date && (
              <span className="sp-tag">
                <i className="fa-regular fa-calendar"></i> {date}
              </span>
            )}
          </div>
        )}

        {/* NỘI DUNG CHÍNH */}
        <div className="search-page-content">
          {loading ? (
            <div className="client-loading-state">
              <div className="client-spinner"></div>
              <p>Đang tìm kiếm các tour tốt nhất...</p>
            </div>
          ) : (
            <>
              {tours.length > 0 ? (
                <>
                  <div
                    className={`tour-grid-4 ${animateCards ? "sp-cards-animated" : ""}`}
                  >
                    {tours.map((tour, index) => (
                      <div
                        key={`${tour.id}-${tour.departure_id}`}
                        className="sp-card-wrap"
                        style={{ animationDelay: `${index * 0.06}s` }}
                      >
                        <TourCard tour={tour} />
                      </div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={Number(pagination.currentPage)}
                    totalPages={Number(pagination.totalPages)}
                  />
                </>
              ) : (
                <div className="search-empty-state">
                  <div className="sp-empty-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <h3>Không tìm thấy tour nào phù hợp!</h3>
                  <p>
                    Hãy thử thay đổi địa điểm, ngày đi hoặc giảm bớt các điều
                    kiện lọc để xem thêm nhiều lựa chọn khác.
                  </p>
                  <button
                    className="btn-reset-search"
                    onClick={() => navigate("/")}
                  >
                    <i className="fa-solid fa-house"></i> Về trang chủ
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
