import { Link } from "react-router-dom";
import { formatDate, formatNumber } from "../../../utils/format.helper";

function TourCard({ tour }) {
  const getVehicleIcon = (type) => {
    switch (type) {
      case "PLANE":
        return "fa-plane";
      case "BUS":
        return "fa-bus";
      case "TRAIN":
        return "fa-train";
      default:
        return "fa-car";
    }
  };

  return (
    <Link to={`/tours/detail/${tour.slug}`} className="tour-card">
      <div className="tour-card__img">
        <img src={tour.thumbnail} alt={tour.slug} />
        <div className="tour-card__overlay">
          <span className="tour-card__view-btn">Xem chi tiết</span>
        </div>
        {tour.discountPercentage > 0 && (
          <span className="badge-discount">
            <i className="fa-solid fa-bolt"></i> Giảm {tour.discountPercentage}%
          </span>
        )}
      </div>

      <div className="tour-card__content">
        <h3 className="tour-title">{tour.title}</h3>
        <div className="tour-price">
          {tour.discountPercentage > 0 && (
            <span className="old-price">
              {formatNumber(tour.oldPrice)} đ
            </span>
          )}
          <span className="new-price">
            {formatNumber(tour.newPrice)} đ
          </span>
        </div>

        <ul className="tour-meta">
          <li>
            <i className="fa-solid fa-barcode"></i> Mã Tour: {tour.id}
          </li>
          <li>
            <i className="fa-solid fa-map-location-dot"></i> Nơi Khởi Hành:{" "}
            {tour.departureFrom || "Chưa cập nhật"}
          </li>
          <li>
            <i className="fa-regular fa-calendar"></i> Ngày Khởi Hành:{" "}
            {formatDate(tour.startDate)}
          </li>
          <li>
            <i className="fa-regular fa-clock"></i> Thời Gian: {tour.time}
          </li>
          {/* Thêm phần hiển thị phương tiện tại đây */}
          <li>
            <i className={`fa-solid ${getVehicleIcon(tour.vehicleType)}`}></i>
            Phương tiện: {tour.vehicleName || "Chưa cập nhật"}
          </li>
        </ul>

        <div className="tour-footer">
          <div className="stars">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <span>(5)</span>
          </div>
          <div className="slots">
            Số chỗ còn: <span className="slot-number">{tour.slots}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TourCard;
