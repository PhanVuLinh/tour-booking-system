import TourCard from "../../tours/components/TourCard";

import { useEffect, useState } from "react";

function ForeignTours() {
  const [tourDomesticTours, setTourDomesticTours] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/home/foreign-tours`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setTourDomesticTours(result.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải tour domestic tours:", error);
      });
  }, []);

  return (
    <section className="tour-section">
      <div className="container">
        <h2 className="section-title">Khám Phá Tour Nước Ngoài</h2>

        <div className="tour-grid-4">
          {tourDomesticTours.map((item) => (
            <TourCard key={item.id} tour={item} />
          ))}
        </div>

        <div className="btn-view-all-wrap">
          <a href="#" className="btn-view-all">
            Xem tất cả
          </a>
        </div>
      </div>
    </section>
  );
}

export default ForeignTours;
