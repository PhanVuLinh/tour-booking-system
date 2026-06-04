function TourCard({ tour }) {
  return (
    <div className="tour-card">
      <div className="tour-card__img">
        <img src={tour.image} alt={tour.title} />
        <span className="badge-discount">
          <i className="fa-solid fa-bolt"></i> GIẢM -30%
        </span>
      </div>

      <div className="tour-card__content">
        <h3 className="tour-title">{tour.title}</h3>
        <div className="tour-price">
          <span className="old-price">{tour.oldPrice}</span>
          <span className="new-price">{tour.newPrice}</span>
        </div>

        <ul className="tour-meta">
          <li>Mã Tour: {tour.code}</li>
          <li>Ngày Khởi Hành: {tour.date}</li>
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
