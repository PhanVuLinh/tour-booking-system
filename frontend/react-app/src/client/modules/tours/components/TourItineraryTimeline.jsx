import React, { useState } from "react";

export default function TourItineraryTimeline({ schedules = [], tourTitle = "" }) {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedDays, setExpandedDays] = useState(() => {
    // Mặc định mở tất cả các ngày
    return new Set(schedules.map((item) => item.day_number));
  });

  if (!schedules || schedules.length === 0) {
    return (
      <div className="detail-box itinerary-box">
        <h2 className="box-title">
          <i className="fa-solid fa-route title-icon"></i>
          Lịch Trình Chi Tiết
        </h2>
        <div className="itinerary-empty">
          <i className="fa-regular fa-calendar-xmark"></i>
          <p>Lịch trình chi tiết của tour đang được VietRoute cập nhật.</p>
        </div>
      </div>
    );
  }

  // Thuật toán nhận diện hoạt động thông minh từ tiêu đề và nội dung
  const extractActivities = (title = "", content = "") => {
    const text = `${title} ${content}`.toLowerCase();
    const tags = [];

    if (text.includes("máy bay") || text.includes("chuyến bay") || text.includes("sân bay")) {
      tags.push({ icon: "fa-plane-departure", label: "Vé máy bay" });
    } else if (text.includes("thuyền") || text.includes("du thuyền") || text.includes("tàu thủy") || text.includes("ca nô")) {
      tags.push({ icon: "fa-ship", label: "Du thuyền / Tàu" });
    } else if (text.includes("xe") || text.includes("ô tô") || text.includes("đón")) {
      tags.push({ icon: "fa-bus", label: "Xe du lịch" });
    }

    if (text.includes("ăn sáng") || text.includes("ăn trưa") || text.includes("ăn tối") || text.includes("ẩm thực") || text.includes("bữa")) {
      tags.push({ icon: "fa-utensils", label: "Ăn uống theo tour" });
    }

    if (text.includes("khách sạn") || text.includes("nhận phòng") || text.includes("resort") || text.includes("nghỉ đêm")) {
      tags.push({ icon: "fa-hotel", label: "Khách sạn nghỉ ngơi" });
    }

    if (text.includes("cáp treo") || text.includes("check-in") || text.includes("tham quan") || text.includes("ngắm cảnh")) {
      tags.push({ icon: "fa-camera", label: "Check-in tham quan" });
    }

    return tags.slice(0, 3);
  };

  const toggleDay = (dayNumber) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) {
        next.delete(dayNumber);
      } else {
        next.add(dayNumber);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedDays(new Set(schedules.map((s) => s.day_number)));
  };

  const handleCollapseAll = () => {
    setExpandedDays(new Set());
  };

  // Lọc danh sách ngày hiển thị theo tab
  const displayedSchedules =
    activeTab === "all"
      ? schedules
      : schedules.filter((s) => s.day_number === Number(activeTab));

  return (
    <div className="detail-box itinerary-interactive-box">
      <div className="itinerary-header">
        <h2 className="box-title">
          <i className="fa-solid fa-map-location-dot title-icon"></i>
          Lịch Trình Chi Tiết ({schedules.length} Ngày)
        </h2>

        <div className="itinerary-toggle-actions">
          <button
            type="button"
            className="btn-toggle-all"
            onClick={handleExpandAll}
          >
            <i className="fa-solid fa-angles-down"></i> Mở rộng tất cả
          </button>
          <button
            type="button"
            className="btn-toggle-all"
            onClick={handleCollapseAll}
          >
            <i className="fa-solid fa-angles-up"></i> Thu gọn tất cả
          </button>
        </div>
      </div>

      {/* Thanh tab lọc nhanh theo ngày */}
      <div className="itinerary-filter-tabs">
        <button
          type="button"
          className={`itinerary-pill-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả các ngày
        </button>
        {schedules.map((item) => (
          <button
            key={item.day_number}
            type="button"
            className={`itinerary-pill-tab ${activeTab === String(item.day_number) ? "active" : ""}`}
            onClick={() => setActiveTab(String(item.day_number))}
          >
            Ngày {item.day_number}
          </button>
        ))}
      </div>

      {/* Trục Timeline lịch trình từng ngày */}
      <div className="itinerary-timeline-wrapper">
        {displayedSchedules.map((day) => {
          const isExpanded = expandedDays.has(day.day_number);
          const tags = extractActivities(day.title, day.content);
          const dayNumberFormatted = String(day.day_number).padStart(2, "0");

          return (
            <div
              key={day.id || day.day_number}
              className={`itinerary-day-card ${isExpanded ? "expanded" : "collapsed"}`}
            >
              {/* Badge số ngày bên trái trục timeline */}
              <div className="itinerary-timeline-node">
                <div className="itinerary-day-badge">
                  <span className="idb-day">NGÀY</span>
                  <span className="idb-num">{dayNumberFormatted}</span>
                </div>
              </div>

              {/* Thẻ nội dung của ngày */}
              <div className="itinerary-day-content-wrap">
                <div
                  className="itinerary-day-header"
                  onClick={() => toggleDay(day.day_number)}
                >
                  <div className="idh-left">
                    <h3 className="itinerary-day-title">
                      {day.title || `Hành trình khám phá Ngày ${day.day_number}`}
                    </h3>

                    {tags.length > 0 && (
                      <div className="itinerary-badge-tags">
                        {tags.map((tag, idx) => (
                          <span key={idx} className="itinerary-tag-pill">
                            <i className={`fa-solid ${tag.icon}`}></i> {tag.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="itinerary-chevron-btn"
                    aria-label="Đóng mở chi tiết ngày"
                  >
                    <i className={`fa-solid ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                  </button>
                </div>

                {/* Nội dung chi tiết từng buổi */}
                {isExpanded && (
                  <div className="itinerary-day-body">
                    <div
                      className="itinerary-html-content"
                      dangerouslySetInnerHTML={{ __html: day.content }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
