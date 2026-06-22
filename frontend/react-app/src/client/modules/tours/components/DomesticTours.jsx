import TourCard from "./TourCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DomesticTours() {
  const [tourDomesticTours, setTourDomesticTours] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/home/domestic-tours`)
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
        <h2 className="section-title">Khám Phá Tour Trong Nước</h2>

        <div className="tour-grid-4">
          {tourDomesticTours.map((item) => (
            <TourCard key={item.id} tour={item} />
          ))}
        </div>

        <div className="btn-view-all-wrap">
          <Link to="/category/tour-trong-nuoc" className="btn-view-all">
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DomesticTours;
