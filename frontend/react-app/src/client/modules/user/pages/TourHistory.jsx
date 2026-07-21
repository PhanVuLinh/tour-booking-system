import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import HistoryCard from "../components/HistoryCard";

import { getTourHistory } from "../services/userService";

function ProfileHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getTourHistory()
      .then((response) => {
        if (response?.success) {
          setBookings(response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lịch sử đặt tour:", error);

        setBookings([]);
        setError(
          error.message ||
            "Đã có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại!",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="profile-main b-box">
      <div className="profile-header">
        <div>
          <h2 className="profile-title">Lịch sử đặt tour</h2>
          <p className="profile-desc">
            Quản lý và theo dõi trạng thái các đơn đặt tour của bạn
          </p>
        </div>
      </div>

      <div className="history-list-wrapper">
        {bookings.length > 0 ? (
          <div className="history-list">
            {bookings.map((booking) => (
              <HistoryCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="search-empty-state" style={{ padding: "40px 20px" }}>
            <i
              className="fa-solid fa-box-open"
              style={{ fontSize: "40px", color: "#ccc", marginBottom: "15px" }}
            ></i>
            <h3>Bạn chưa đặt tour nào!</h3>
            <p>
              Hãy khám phá các tour du lịch hấp dẫn của TravelGo và bắt đầu
              chuyến đi của bạn.
            </p>
            <Link
              to="/search"
              className="btn-action btn-fill"
              style={{ marginTop: "15px" }}
            >
              Khám phá tour ngay
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfileHistory;
