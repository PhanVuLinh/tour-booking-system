import { useState, useEffect, useRef, useMemo } from "react";
import { formatPrice } from "../utils/format.helper";
import { searchTours } from "../modules/tours/services/tourService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80";

// Helper component để làm nổi bật từ khóa trong tiêu đề
function HighlightText({ text = "", highlight = "" }) {
  if (!highlight.trim() || !text) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="ls-highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

function LiveSearchDropdown({
  isOpen,
  onClose,
  keyword = "",
  onSelectTour,
  onSelectLocation,
  onViewAll,
  popularLocations = [],
  popularTours = [],
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  // Load recent searches từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("travelgo_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Lỗi đọc recent searches:", e);
    }
  }, []);

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    try {
      const filtered = recentSearches.filter(
        (item) => item.toLowerCase() !== cleanTerm.toLowerCase()
      );
      const updated = [cleanTerm, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("travelgo_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Lỗi lưu recent search:", e);
    }
  };

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== termToRemove);
    setRecentSearches(updated);
    localStorage.setItem("travelgo_recent_searches", JSON.stringify(updated));
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("travelgo_recent_searches");
  };

  // Debounced search khi người dùng gõ từ khóa
  useEffect(() => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const [destRes, depRes] = await Promise.all([
          searchTours({ destination: trimmed, limit: 6 }).catch(() => ({
            success: false,
          })),
          searchTours({ departure_from: trimmed, limit: 6 }).catch(() => ({
            success: false,
          })),
        ]);

        const allTours = [
          ...(destRes.success && Array.isArray(destRes.data)
            ? destRes.data
            : []),
          ...(depRes.success && Array.isArray(depRes.data) ? depRes.data : []),
        ];

        if (allTours.length > 0) {
          // Lọc trùng theo slug vì mỗi tour có thể có nhiều ngày khởi hành
          const uniqueMap = new Map();
          allTours.forEach((tour) => {
            if (!uniqueMap.has(tour.slug)) {
              uniqueMap.set(tour.slug, tour);
            }
          });
          setResults(Array.from(uniqueMap.values()).slice(0, 6));
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm trực tiếp:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 240);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Lọc địa điểm khớp với từ khóa
  const matchedLocations = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed || !popularLocations.length) return [];
    return popularLocations
      .filter((loc) => loc.toLowerCase().includes(trimmed))
      .slice(0, 4);
  }, [keyword, popularLocations]);

  // Điều hướng bằng bàn phím
  const flatItems = useMemo(() => {
    if (keyword.trim()) {
      return [
        ...matchedLocations.map((loc) => ({ type: "location", data: loc })),
        ...results.map((tour) => ({ type: "tour", data: tour })),
      ];
    }
    return popularTours.slice(0, 4).map((tour) => ({ type: "tour", data: tour }));
  }, [keyword, matchedLocations, results, popularTours]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [keyword]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < flatItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const selected = flatItems[activeIndex];
        if (selected) {
          if (selected.type === "tour") {
            handleTourClick(selected.data);
          } else if (selected.type === "location") {
            handleLocationClick(selected.data);
          }
        }
      } else if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, flatItems]);

  const handleTourClick = (tour) => {
    saveRecentSearch(tour.title);
    onSelectTour?.(tour);
  };

  const handleLocationClick = (loc) => {
    saveRecentSearch(loc);
    onSelectLocation?.(loc);
  };

  const handleViewAllSubmit = () => {
    if (keyword.trim()) {
      saveRecentSearch(keyword.trim());
    }
    onViewAll?.(keyword.trim());
  };

  if (!isOpen) return null;

  const isTyping = keyword.trim().length > 0;

  return (
    <div className="live-search-dropdown" ref={dropdownRef}>
      {/* 1. Thanh trạng thái Header */}
      <div className="ls-header">
        {isTyping ? (
          <div className="ls-header-left">
            <i className="fa-solid fa-sparkles ls-header-icon"></i>
            <span className="ls-header-title">
              Kết quả tìm kiếm cho <strong>"{keyword.trim()}"</strong>
            </span>
          </div>
        ) : (
          <div className="ls-header-left">
            <i className="fa-solid fa-fire ls-header-icon hot"></i>
            <span className="ls-header-title">Khám phá tour & điểm đến nổi bật</span>
          </div>
        )}

        {isTyping && results.length > 0 && (
          <span className="ls-badge-count">{results.length} tour gợi ý</span>
        )}
      </div>

      <div className="ls-body custom-scrollbar">
        {/* 2. Lịch sử tìm kiếm gần đây (Khi chưa gõ chữ) */}
        {!isTyping && recentSearches.length > 0 && (
          <div className="ls-section">
            <div className="ls-section-header">
              <span className="ls-section-title">
                <i className="fa-regular fa-clock"></i> Tìm kiếm gần đây
              </span>
              <button
                type="button"
                className="ls-btn-clear"
                onClick={clearAllRecent}
              >
                Xóa tất cả
              </button>
            </div>
            <div className="ls-recent-chips">
              {recentSearches.map((item, idx) => (
                <div
                  key={idx}
                  className="ls-chip"
                  onClick={() => handleLocationClick(item)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>{item}</span>
                  <button
                    type="button"
                    className="ls-chip-remove"
                    onClick={(e) => removeRecentSearch(e, item)}
                    title="Xóa"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Địa điểm khớp khi gõ */}
        {isTyping && matchedLocations.length > 0 && (
          <div className="ls-section">
            <div className="ls-section-header">
              <span className="ls-section-title">
                <i className="fa-solid fa-map-location-dot"></i> Điểm đến liên quan
              </span>
            </div>
            <div className="ls-locations-list">
              {matchedLocations.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`ls-location-item ${
                    activeIndex === idx ? "active" : ""
                  }`}
                  onClick={() => handleLocationClick(loc)}
                >
                  <div className="ls-loc-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="ls-loc-text">
                    <span className="ls-loc-name">
                      <HighlightText text={loc} highlight={keyword} />
                    </span>
                    <span className="ls-loc-sub">Điểm khởi hành & điểm đến</span>
                  </div>
                  <i className="fa-solid fa-arrow-right ls-loc-arrow"></i>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Gợi ý địa điểm phổ biến (Khi chưa gõ chữ) */}
        {!isTyping && popularLocations.length > 0 && (
          <div className="ls-section">
            <div className="ls-section-header">
              <span className="ls-section-title">
                <i className="fa-solid fa-compass"></i> Điểm đến thịnh hành
              </span>
            </div>
            <div className="ls-popular-locations-pills">
              {popularLocations.slice(0, 6).map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="ls-pill-btn"
                  onClick={() => handleLocationClick(loc)}
                >
                  <i className="fa-solid fa-location-dot"></i>
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Danh sách Tour */}
        <div className="ls-section">
          <div className="ls-section-header">
            <span className="ls-section-title">
              <i className="fa-solid fa-mountain-sun"></i>{" "}
              {isTyping ? "Tour du lịch gợi ý" : "Tour nổi bật tuần này"}
            </span>
          </div>

          {/* Trạng thái Loading Shimmer */}
          {loading && (
            <div className="ls-loading-list">
              {[1, 2, 3].map((n) => (
                <div key={n} className="ls-skeleton-item">
                  <div className="ls-skel-thumb shimmer"></div>
                  <div className="ls-skel-info">
                    <div className="ls-skel-line shimmer w-75"></div>
                    <div className="ls-skel-line shimmer w-40"></div>
                  </div>
                  <div className="ls-skel-price shimmer w-20"></div>
                </div>
              ))}
            </div>
          )}

          {/* Trạng thái kết quả Tour */}
          {!loading && isTyping && results.length === 0 && (
            <div className="ls-empty-state">
              <div className="ls-empty-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <p className="ls-empty-title">
                Không tìm thấy tour phù hợp với "{keyword}"
              </p>
              <p className="ls-empty-desc">
                Thử tìm kiếm với các điểm đến nổi tiếng như{" "}
                <span onClick={() => handleLocationClick("Đà Nẵng")}>Đà Nẵng</span>,{" "}
                <span onClick={() => handleLocationClick("Thái Lan")}>Thái Lan</span> hoặc{" "}
                <span onClick={() => handleLocationClick("Hồ Chí Minh")}>Hồ Chí Minh</span>
              </p>
            </div>
          )}

          {/* Hiển thị danh sách tour khi có kết quả */}
          {!loading && (isTyping ? results : popularTours.slice(0, 4)).map((tour, idx) => {
            const itemIndex = isTyping
              ? matchedLocations.length + idx
              : idx;
            const isHighlight = activeIndex === itemIndex;
            const currentPrice = tour.newPrice || tour.oldPrice || 0;
            const hasDiscount = tour.discount_percentage > 0;

            return (
              <div
                key={tour.id || tour.slug || idx}
                className={`ls-tour-card ${isHighlight ? "active" : ""}`}
                onClick={() => handleTourClick(tour)}
              >
                {/* Ảnh Tour */}
                <div className="ls-tour-thumb-wrapper">
                  <img
                    src={tour.thumbnail || FALLBACK_IMAGE}
                    alt={tour.title}
                    className="ls-tour-thumb"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  {hasDiscount && (
                    <span className="ls-tour-badge-discount">
                      -{tour.discount_percentage}%
                    </span>
                  )}
                </div>

                {/* Thông tin Tour */}
                <div className="ls-tour-details">
                  <h4 className="ls-tour-name">
                    <HighlightText text={tour.title} highlight={keyword} />
                  </h4>
                  <div className="ls-tour-meta">
                    {tour.time && (
                      <span className="ls-meta-tag">
                        <i className="fa-regular fa-clock"></i> {tour.time}
                      </span>
                    )}
                    {tour.departure_from && (
                      <span className="ls-meta-tag">
                        <i className="fa-solid fa-location-dot"></i> Từ {tour.departure_from}
                      </span>
                    )}
                  </div>
                </div>

                {/* Giá & CTA */}
                <div className="ls-tour-action">
                  <div className="ls-price-box">
                    {hasDiscount && tour.oldPrice && (
                      <span className="ls-old-price">
                        {formatPrice(tour.oldPrice)}
                      </span>
                    )}
                    <span className="ls-new-price">
                      {formatPrice(currentPrice)}
                    </span>
                  </div>
                  <div className="ls-arrow-btn">
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Footer: Xem tất cả kết quả */}
      <div className="ls-footer">
        {isTyping ? (
          <button
            type="button"
            className="ls-btn-view-all"
            onClick={handleViewAllSubmit}
          >
            <span>
              Xem tất cả kết quả cho <strong>"{keyword.trim()}"</strong>
            </span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          <div className="ls-footer-hint">
            <i className="fa-regular fa-lightbulb"></i>
            <span>Mẹo: Nhập tên thành phố, quốc gia hoặc tên tour để tìm kiếm nhanh</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveSearchDropdown;
