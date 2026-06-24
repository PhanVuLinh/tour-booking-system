import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../../shared";
import { buildTourDetailBreadcrumb } from "../../../utils/breadcrumb.helper";

import moment from "moment";

function TourDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [tourData, setTourData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/tours/detail/${slug}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setTourData(result.data);
          setMainImage(result.data.thumbnail);

          if (result.data.departures && result.data.departures.length > 0) {
            setSelectedDate(result.data.departures[0]);
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải chi tiết tour:", error);
      });
  }, [slug]);

  const tourDetail = tourData || {};
  const departures = tourData?.departures || [];
  const schedules = tourData?.schedules || [];

  const breadcrumbList = buildTourDetailBreadcrumb(tourData, slug);

  const priceAdult = selectedDate ? Number(selectedDate.newPriceAdult) : 0;
  const priceChild = selectedDate ? Number(selectedDate.newPriceChildren) : 0;
  const priceInfant = selectedDate ? Number(selectedDate.newPriceBaby) : 0;

  const totalPrice =
    adults * priceAdult + children * priceChild + infants * priceInfant;

  const formatPriceTotal = (price) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  const handleBooking = () => {
    if (!selectedDate) {
      alert("Vui lòng chọn ngày khởi hành!");
      return;
    }
    navigate("/booking/info", {
      state: {
        tour: tourData,
        selectedDate,
        passengers: { adults, children, infants },
        totalPrice,
      },
    });
  };

  return (
    <div className="tour-detail-page">
      <Breadcrumb
        title={tourDetail.title || "Đang tải tên tour..."}
        list={breadcrumbList}
        thumbnail={tourDetail.thumbnail}
      />

      <div className="container">
        <div className="tour-detail-layout">
          <div className="tour-detail-left">
            <div className="tour-gallery">
              <img
                key={mainImage || tourDetail.thumbnail}
                src={mainImage || tourDetail.thumbnail}
                alt={tourDetail.title}
                className="gallery-main-img"
              />
              <div className="gallery-thumbnails">
                {tourDetail.thumbnail && (
                  <img
                    src={tourDetail.thumbnail}
                    alt={tourDetail.title}
                    onClick={() => setMainImage(tourDetail.thumbnail)}
                    className={
                      mainImage === tourDetail.thumbnail ? "active" : ""
                    }
                  />
                )}
              </div>
            </div>

            <div className="detail-box">
              <h2 className="box-title">Thông Tin Tour</h2>
              <p className="box-desc">
                {tourDetail.description || "Đang tải mô tả..."}
              </p>
            </div>

            <div className="detail-box">
              <h2 className="box-title">Lịch Trình Tour</h2>
              {schedules.length > 0 ? (
                <div className="itinerary-timeline">
                  {schedules.map((day) => (
                    <div className="timeline-item" key={day.id}>
                      <div className="timeline-day">
                        NGÀY {day.day_number}: {day.title}
                      </div>

                      <div className="timeline-content">
                        <div
                          className="itinerary-html-content"
                          dangerouslySetInnerHTML={{ __html: day.content }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#666" }}>
                  Đang cập nhật lịch trình chi tiết...
                </p>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: ĐẶT TOUR */}
          <aside className="tour-detail-right">
            <div className="booking-box">
              <h3 className="booking-title">Chuyến Đi Của Bạn</h3>

              <div className="booking-mini-card">
                <img
                  src={tourDetail.thumbnail || "https://placehold.co/80x60"}
                  alt="Tour mini"
                />
                <div className="mini-card-info">
                  <h4>{tourDetail.title || "Đang tải..."}</h4>
                  <div className="stars">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <span>500 lượt đánh giá</span>
                  </div>
                </div>
              </div>

              <ul className="booking-meta">
                <li>
                  <i className="fa-solid fa-ticket"></i> Mã Tour:{" "}
                  <strong>{tourDetail.id || "..."}</strong>
                </li>
                <li>
                  <i className="fa-regular fa-clock"></i> Thời Gian:{" "}
                  <strong>{tourDetail.time || "..."}</strong>
                </li>
                <li>
                  <i className="fa-solid fa-bus"></i> Phương Tiện:{" "}
                  <strong>{selectedDate?.vehicleName || "Đang tải..."}</strong>
                </li>
                <li>
                  <i className="fa-regular fa-calendar"></i> Khởi Hành:{" "}
                  <strong>
                    {selectedDate
                      ? moment(selectedDate.startDate).format("DD/MM/YYYY")
                      : "Chưa chọn"}
                  </strong>
                </li>
              </ul>

              <div className="booking-form">
                {/* <div className="form-group">
                  <label className="booking-label">Khởi Hành Tại:</label>
                  <select className="tour-detail-select" defaultValue="hanoi">
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                  </select>
                </div> */}

                {/* --- LƯỚI CHỌN NGÀY KHỞI HÀNH ĐỘNG --- */}
                <div className="form-group">
                  <label className="section-label">Ngày Khởi Hành</label>
                  <div className="date-grid-options">
                    {departures.map((item) => (
                      <div
                        key={item.departure_id}
                        className={`date-card ${selectedDate?.departure_id === item.departure_id ? "active" : ""}`}
                        onClick={() => setSelectedDate(item)}
                      >
                        <span className="d-date">
                          {moment(item.startDate).format("DD/MM")}
                        </span>
                        <span className="d-year">
                          {moment(item.startDate).format("YYYY")}
                        </span>
                        <hr className="d-divider" />
                        <span className="d-price">
                          {(item.newPriceAdult / 1000000).toFixed(1)}tr
                        </span>
                      </div>
                    ))}
                    {tourData && departures.length === 0 && (
                      <p style={{ fontSize: "13px", color: "#666" }}>
                        Tour đang cập nhật lịch khởi hành.
                      </p>
                    )}
                  </div>
                </div>

                {/* --- CHỌN SỐ LƯỢNG KHÁCH --- */}
                <div className="passenger-section">
                  <label className="section-label">Số người</label>

                  {/* Người lớn */}
                  <div className="passenger-row-modern">
                    <div className="p-info">
                      <span className="p-name">Người lớn</span>
                      <span className="p-subprice">
                        {formatPriceTotal(priceAdult)}
                      </span>
                    </div>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          setAdults((prev) => Math.max(1, prev - 1))
                        }
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => prev + 1)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  {/* Trẻ em */}
                  <div className="passenger-row-modern">
                    <div className="p-info">
                      <span className="p-name">Trẻ em</span>
                      <span className="p-subprice">
                        {formatPriceTotal(priceChild)}
                      </span>
                    </div>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          setChildren((prev) => Math.max(0, prev - 1))
                        }
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => prev + 1)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  {/* Em bé */}
                  <div className="passenger-row-modern">
                    <div className="p-info">
                      <span className="p-name">Em bé</span>
                      <span className="p-subprice">
                        {formatPriceTotal(priceInfant)}
                      </span>
                    </div>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          setInfants((prev) => Math.max(0, prev - 1))
                        }
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants((prev) => prev + 1)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="booking-total">
                  <span>Tổng cộng:</span>
                  <strong>{formatPriceTotal(totalPrice)}</strong>
                </div>

                <button
                  className="btn-add-cart"
                  onClick={handleBooking}
                  disabled={!selectedDate || departures.length === 0}
                  style={{
                    opacity: !selectedDate || departures.length === 0 ? 0.6 : 1,
                    cursor:
                      !selectedDate || departures.length === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {departures.length === 0
                    ? "Chưa có lịch khởi hành"
                    : "Đặt tour ngay"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default TourDetail;
