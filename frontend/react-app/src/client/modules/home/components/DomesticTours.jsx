// import TourCard from "../../tours/components/TourCard";
import TourCard from "../../tours/components/TourCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDomesticTours } from "../services/homeService";

function DomesticTours() {
  const [tourDomesticTours, setTourDomesticTours] = useState([]);

  useEffect(() => {
    getDomesticTours()
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
