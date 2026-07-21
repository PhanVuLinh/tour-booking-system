import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import HistoryCard from "../components/HistoryCard";

function ProfileHistory() {
  const { isProfileLoaded } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập gọi API lấy danh sách lịch sử đặt tour
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setBookings([
        {
          id: 1,
          bookingCode: "BKG-89231",
          tour: {
            slug: "kham-pha-vinh-ha-long-2n1d",
            title: "Khám phá Vịnh Hạ Long - Ngủ đêm trên du thuyền 5 sao",
            thumbnail:
              "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=300&q=80",
          },
          startDate: "2026-08-15T08:00:00",
          bookingDate: "2026-07-21T10:30:00",
          totalPassengers: 2,
          totalAmount: 5400000,
          status: "pending",
        },
        {
          id: 2,
          bookingCode: "BKG-44512",
          tour: {
            slug: "kham-pha-da-nang-hoi-an-4n3d",
            title: "Lịch trình vi vu Đà Nẵng – Hội An 4 ngày 3 đêm",
            thumbnail:
              "https://images.unsplash.com/photo-1557315360-6a350ab4eccd?auto=format&fit=crop&w=300&q=80",
          },
          startDate: "2026-09-02T08:00:00",
          bookingDate: "2026-07-10T14:20:00",
          totalPassengers: 4,
          totalAmount: 12000000,
          status: "paid",
        },
        {
          id: 3,
          bookingCode: "BKG-11299",
          tour: {
            slug: "du-lich-sapa-mua-lua-chin",
            title: "Kinh nghiệm du lịch Sapa mùa lúa chín tuyệt đẹp",
            thumbnail:
              "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&q=80",
          },
          startDate: "2025-10-10T08:00:00",
          bookingDate: "2025-09-25T09:15:00",
          totalPassengers: 1,
          totalAmount: 2500000,
          status: "completed",
        },
        {
          id: 4,
          bookingCode: "BKG-99882",
          tour: {
            slug: "bien-phu-quoc-3n2d",
            title: "Nghỉ dưỡng resort 5 sao tại biển Phú Quốc",
            thumbnail:
              "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=300&q=80",
          },
          startDate: "2025-12-01T08:00:00",
          bookingDate: "2025-11-20T16:45:00",
          totalPassengers: 2,
          totalAmount: 8000000,
          status: "cancelled",
        },
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isProfileLoaded || loading) {
    return (
      <main className="profile-main b-box">
        <div className="profile-header">
          <h2 className="profile-title">Lịch sử đặt tour</h2>
        </div>
        <div
          className="profile-form-wrapper"
          style={{ padding: "40px 0", textAlign: "center" }}
        >
          <div className="client-spinner" style={{ margin: "0 auto" }}></div>
          <p style={{ color: "#666", marginTop: "10px" }}>
            Đang tải dữ liệu...
          </p>
        </div>
      </main>
    );
  }

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
