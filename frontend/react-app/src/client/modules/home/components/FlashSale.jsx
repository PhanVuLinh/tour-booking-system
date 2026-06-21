import { useRef, useState, useEffect } from "react";
import { TourCard } from "../../tours";

function FlashSale() {
  const trackRef = useRef(null);
  const [tourFlashSales, setTourFlashSales] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/home/flash-sales`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setTourFlashSales(result.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải tour flash sale:", error);
      });
  }, []);


  const handlePrev = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({
        left: -trackRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({
        left: trackRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="flash-sale">
      <div className="container">
        <div className="flash-sale__inner">
          <div className="flash-sale__info">
            <h2 className="fs-title">
              ƯU ĐÃI 2026 <br /> TOUR GIỜ CHÓT
            </h2>
            <p className="fs-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>

            <div className="fs-countdown-wrap">
              <p className="fs-end-text">Kết thúc sau</p>
              <div className="fs-countdown">
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Ngày</span>
                </div>
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Giờ</span>
                </div>
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Phút</span>
                </div>
                <div className="time-item">
                  <div className="time-box">00</div>
                  <span>Giây</span>
                </div>
              </div>
            </div>

            <div className="fs-huge-discount">
              <p>GIẢM ĐẾN</p>
              <h3>990.000đ</h3>
            </div>
          </div>

          <div className="flash-sale__tours">
            <button
              className="slider-nav next"
              onClick={handleNext}
              aria-label="Next"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            <button
              className="slider-nav prev"
              onClick={handlePrev}
              aria-label="Prev"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="tour-track" ref={trackRef}>
              {tourFlashSales.map((item) => (
                <TourCard key={item.id} tour={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlashSale;
