import TourCard from "../../tours/components/TourCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getForeignTours } from "../services/homeService";

function ForeignTours() {
  const [tourForeignTours, setTourForeignTours] = useState([]);

  useEffect(() => {
    getForeignTours()
      .then((result) => {
        if (result.success) {
          setTourForeignTours(result.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải tour Foreign tours:", error);
      });
  }, []);

  return (
    <section className="tour-section">
      <div className="container">
        <h2 className="section-title">Khám Phá Tour Nước Ngoài</h2>

        <div className="tour-grid-4">
          {tourForeignTours.map((item) => (
            <TourCard key={item.id} tour={item} />
          ))}
        </div>

        <div className="btn-view-all-wrap">
          <Link to="/category/tour-quoc-te" className="btn-view-all">
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForeignTours;
