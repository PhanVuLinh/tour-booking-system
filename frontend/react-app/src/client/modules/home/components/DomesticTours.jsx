// import TourCard from "../../tours/components/TourCard";
import TourCard from "../../tours/components/TourCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDomesticTours } from "../services/homeService";

function DomesticTours() {
  const [tourDomesticTours, setTourDomesticTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDomesticTours()
      .then((result) => {
        if (result.success) {
          setTourDomesticTours(result.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải tour domestic tours:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="tour-section">
      <div className="container">
        <h2 className="section-title">Khám Phá Tour Trong Nước</h2>

        {loading ? (
          <div className="client-loading-state" style={{ padding: "40px 0" }}>
            <div className="client-spinner"></div>
            <p>Đang tải danh sách tour trong nước...</p>
          </div>
        ) : (
          <div className="tour-grid-4">
            {tourDomesticTours.map((item) => (
              <TourCard key={item.id} tour={item} />
            ))}
          </div>
        )}

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
