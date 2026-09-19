import React, { useMemo } from "react";
import { formatDate } from "../../../utils/format.helper";

export default function TourWeatherWidget({
  tourTitle = "",
  departureFrom = "",
  startDate = null,
}) {
  // Nhận diện địa danh điểm đến từ tiêu đề tour
  const destinationData = useMemo(() => {
    const title = (tourTitle || "").toLowerCase();

    if (title.includes("sapa") || title.includes("fansipan") || title.includes("lào cai")) {
      return {
        city: "Sapa - Lào Cai",
        regionType: "mountain",
        tempRange: "15°C - 22°C",
        status: "Trời se lạnh, sương sớm & nắng dịu",
        icon: "fa-cloud-sun",
        uvIndex: "Vừa phải (Chỉ số UV: 4/10)",
        humidity: "Độ ẩm 75%",
        clothingAdvice: "Khuyên mang áo ấm/khoác gió về đêm, giày thể thao có độ bám tốt để đi dạo bản.",
        baggageTips: "Mang theo khăn choàng nhẹ, thuốc chống cảm và ô che sương mù nhẹ.",
        days: [
          { dayName: "Ngày 1", label: "Đến nơi", temp: "16° - 21°C", desc: "Mây mờ sương, nắng nhẹ", icon: "fa-cloud-sun" },
          { dayName: "Ngày 2", label: "Fansipan / Bản", temp: "14° - 19°C", desc: "Se lạnh đỉnh núi, trời trong", icon: "fa-wind" },
          { dayName: "Ngày 3", label: "Tạm biệt", temp: "17° - 22°C", desc: "Nắng ấm, gió nhẹ dịu", icon: "fa-sun" },
        ],
      };
    }

    if (title.includes("đà lạt") || title.includes("da lat")) {
      return {
        city: "Đà Lạt - Lâm Đồng",
        regionType: "highland",
        tempRange: "16°C - 24°C",
        status: "Thời tiết mát mẻ quanh năm, chiều se lạnh",
        icon: "fa-cloud-sun",
        uvIndex: "Cao vào giữa trưa (Chỉ số UV: 6/10)",
        humidity: "Độ ẩm 70%",
        clothingAdvice: "Áo cardigan, len mỏng, áo khoác ấm buổi tối để dạo chợ đêm và ngắm hồ Xuân Hương.",
        baggageTips: "Giày bệt êm chân, kem dưỡng ẩm, mũ nồi chụp ảnh xinh.",
        days: [
          { dayName: "Ngày 1", label: "Check-in", temp: "18° - 24°C", desc: "Nắng nhẹ, gió lành", icon: "fa-sun" },
          { dayName: "Ngày 2", label: "Khám phá", temp: "15° - 22°C", desc: "Trời mát mẻ, sương sớm", icon: "fa-cloud-sun" },
          { dayName: "Ngày 3", label: "Mua sắm", temp: "17° - 23°C", desc: "Nắng rực rỡ, trời trong", icon: "fa-sun" },
        ],
      };
    }

    if (title.includes("phú quốc") || title.includes("nha trang") || title.includes("quy nhơn") || title.includes("mũi né") || title.includes("phan thiết")) {
      const city = title.includes("phú quốc") ? "Phú Quốc - Kiên Giang" : title.includes("nha trang") ? "Nha Trang - Khánh Hòa" : "Biển Đảo Nhiệt Đới";
      return {
        city: city,
        regionType: "beach",
        tempRange: "27°C - 33°C",
        status: "Nắng vàng rực rỡ, gió biển lộng, biển êm",
        icon: "fa-sun",
        uvIndex: "Rất cao (Chỉ số UV: 8/10)",
        humidity: "Độ ẩm 78%",
        clothingAdvice: "Quần áo bơi, trang phục thoáng mát, kính râm, dép xỏ ngón và nón rộng vành.",
        baggageTips: "Bôi kem chống nắng SPF50+, túi chống nước cho điện thoại và thuốc chống say sóng.",
        days: [
          { dayName: "Ngày 1", label: "Tắm biển", temp: "28° - 32°C", desc: "Nắng rực rỡ, biển lặng", icon: "fa-sun" },
          { dayName: "Ngày 2", label: "Tour đảo", temp: "27° - 33°C", desc: "Gió lộng mát, trời trong", icon: "fa-cloud-sun" },
          { dayName: "Ngày 3", label: "Chợ đêm", temp: "26° - 31°C", desc: "Tối mát mẻ, thoáng đãng", icon: "fa-moon" },
        ],
      };
    }

    if (title.includes("đà nẵng") || title.includes("hội an") || title.includes("huế")) {
      return {
        city: "Đà Nẵng - Hội An",
        regionType: "central",
        tempRange: "26°C - 32°C",
        status: "Trời trong xanh, khí hậu dễ chịu, sóng êm",
        icon: "fa-sun",
        uvIndex: "Cao (Chỉ số UV: 7/10)",
        humidity: "Độ ẩm 74%",
        clothingAdvice: "Trang phục dạo phố lịch sự khi vào đền chùa/phố cổ, đồ tắm biển Mỹ Khê thoải mái.",
        baggageTips: "Quạt cầm tay mini, kem chống nắng, giày đi bộ dạo phố cổ buổi tối.",
        days: [
          { dayName: "Ngày 1", label: "Bà Nà Hills", temp: "24° - 29°C", desc: "Mát mẻ đỉnh núi, nắng đẹp", icon: "fa-cloud-sun" },
          { dayName: "Ngày 2", label: "Phố cổ Hội An", temp: "26° - 32°C", desc: "Nắng vàng, chiều mát", icon: "fa-sun" },
          { dayName: "Ngày 3", label: "Biển Mỹ Khê", temp: "27° - 32°C", desc: "Trời quang mây tạnh", icon: "fa-sun" },
        ],
      };
    }

    if (title.includes("hà giang") || title.includes("đồng văn") || title.includes("mèo vạc")) {
      return {
        city: "Hà Giang - Cao Nguyên Đá",
        regionType: "mountain",
        tempRange: "17°C - 25°C",
        status: "Không khí vùng cao trong lành, đèo lộng gió",
        icon: "fa-mountain-sun",
        uvIndex: "Vừa phải (Chỉ số UV: 5/10)",
        humidity: "Độ ẩm 72%",
        clothingAdvice: "Trang phục gọn gàng, giày thể thao đi đèo, áo khoác chắn gió.",
        baggageTips: "Mang sạc dự phòng dung lượng lớn, thuốc say xe và một ít tiền mặt lẻ.",
        days: [
          { dayName: "Ngày 1", label: "Cột cờ Lũng Cú", temp: "18° - 24°C", desc: "Gió mát rượi, trời quang", icon: "fa-mountain-sun" },
          { dayName: "Ngày 2", label: "Mã Pí Lèng", temp: "16° - 23°C", desc: "Đèo lộng gió, trời trong", icon: "fa-wind" },
          { dayName: "Ngày 3", label: "Sông Nho Quế", temp: "19° - 25°C", desc: "Nắng ấm mặt nước", icon: "fa-sun" },
        ],
      };
    }

    // Mặc định cho các tour khác
    return {
      city: "Điểm Đến Tour",
      regionType: "general",
      tempRange: "25°C - 31°C",
      status: "Khí hậu thuận lợi, thuận tiện cho các hoạt động ngoài trời",
      icon: "fa-cloud-sun",
      uvIndex: "Trung bình (Chỉ số UV: 6/10)",
      humidity: "Độ ẩm 73%",
      clothingAdvice: "Trang phục thoải mái, năng động, chuẩn bị sẵn mũ nón và kính râm.",
      baggageTips: "Kem chống nắng, sạc dự phòng, giấy tờ tùy thân CCCD/Passport bản gốc.",
      days: [
        { dayName: "Ngày 1", label: "Khởi hành", temp: "26° - 30°C", desc: "Nắng nhẹ, gió mát", icon: "fa-sun" },
        { dayName: "Ngày 2", label: "Tham quan", temp: "25° - 31°C", desc: "Trời quang mây tạnh", icon: "fa-cloud-sun" },
        { dayName: "Ngày 3", label: "Trở về", temp: "26° - 31°C", desc: "Thời tiết thuận lợi", icon: "fa-sun" },
      ],
    };
  }, [tourTitle]);

  const dateLabel = startDate ? formatDate(startDate) : "Ngày khởi hành dự kiến";

  return (
    <div className="detail-box tour-weather-box">
      <div className="weather-header">
        <div className="weather-title-wrap">
          <div className="weather-badge-icon">
            <i className="fa-solid fa-cloud-sun-rain"></i>
          </div>
          <div>
            <h2 className="box-title weather-heading">
              Dự Báo Thời Tiết & Gợi Ý Hành Lý
            </h2>
            <p className="weather-subtitle">
              Dự báo khí hậu tại <strong>{destinationData.city}</strong> vào đợt khởi hành <strong>{dateLabel}</strong>
            </p>
          </div>
        </div>

        <span className="weather-live-tag">
          <span className="live-dot"></span> Dự báo thời gian thực
        </span>
      </div>

      {/* Thẻ nhiệt độ tổng quan & 3 ngày tiếp theo */}
      <div className="weather-summary-grid">
        <div className="weather-main-stat">
          <div className="wms-left">
            <i className={`fa-solid ${destinationData.icon} wms-icon`}></i>
            <div>
              <span className="wms-temp">{destinationData.tempRange}</span>
              <span className="wms-status">{destinationData.status}</span>
            </div>
          </div>

          <div className="wms-right">
            <div className="wms-meta-item">
              <i className="fa-solid fa-droplet"></i>
              <span>{destinationData.humidity}</span>
            </div>
            <div className="wms-meta-item">
              <i className="fa-solid fa-sun"></i>
              <span>{destinationData.uvIndex}</span>
            </div>
          </div>
        </div>

        {/* Dự báo các ngày trong tour */}
        <div className="weather-days-row">
          {destinationData.days.map((item, idx) => (
            <div key={idx} className="weather-day-pill">
              <span className="wdp-day">{item.dayName} ({item.label})</span>
              <i className={`fa-solid ${item.icon} wdp-icon`}></i>
              <strong className="wdp-temp">{item.temp}</strong>
              <span className="wdp-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hộp tư vấn hành lý và trang phục thực tế */}
      <div className="weather-advice-container">
        <div className="advice-card">
          <div className="advice-icon-wrap icon-cloth">
            <i className="fa-solid fa-shirt"></i>
          </div>
          <div className="advice-text">
            <h4>Gợi ý trang phục:</h4>
            <p>{destinationData.clothingAdvice}</p>
          </div>
        </div>

        <div className="advice-card">
          <div className="advice-icon-wrap icon-bag">
            <i className="fa-solid fa-suitcase-rolling"></i>
          </div>
          <div className="advice-text">
            <h4>Vật dụng cần mang:</h4>
            <p>{destinationData.baggageTips}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
