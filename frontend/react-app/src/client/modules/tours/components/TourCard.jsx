import moment from "moment";

function TourCard({ tour }) {
  return (
    <div className="tour-card">
      <div className="tour-card__img">
        <img src={tour.thumbnail} alt={tour.slug} />
        {
          tour.discountPercentage > 0 && (
            <span className="badge-discount">
              <i className="fa-solid fa-bolt"></i> Giảm {tour.discountPercentage}%
            </span>
          )
        }
      </div>

      <div className="tour-card__content">
        <h3 className="tour-title">{tour.title}</h3>
        <div className="tour-price">
          <span className="old-price">{Number(tour.oldPrice).toLocaleString('vi-VN')}đ</span>
          <span className="new-price">{Number(tour.newPrice).toLocaleString('vi-VN')}đ</span>
        </div>

        <ul className="tour-meta">
          <li>Mã Tour: {tour.id}</li>
          <li>Ngày Khởi Hành: {moment(tour.startDate).format("DD/MM/YYYY")}</li>
          <li>Thời Gian: {tour.time}</li>
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
    </div>
  );
}

export default TourCard;
