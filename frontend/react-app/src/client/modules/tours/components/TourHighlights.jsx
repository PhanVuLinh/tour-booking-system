import React from "react";

export default function TourHighlights({ tourData = null }) {
  // Danh sách dịch vụ bao gồm tiêu chuẩn
  const includedServices = [
    "Vé máy bay / Xe du lịch đời mới đưa đón theo đúng lịch trình.",
    "Khách sạn tiêu chuẩn 3 - 4 sao (2 khách/phòng, lẻ bố trí phòng 3).",
    "Các bữa ăn chính đặc sản địa phương + Bữa sáng buffet tại khách sạn.",
    "Vé tham quan tất cả các điểm du lịch có trong chương trình.",
    "Bảo hiểm du lịch nội địa theo quy chuẩn của Tổng cục Du lịch.",
    "Nước suối tinh khiết phục vụ trên xe suốt hành trình.",
    "Hướng dẫn viên chuyên nghiệp, nhiệt tình đồng hành suốt tuyến.",
  ];

  // Danh sách dịch vụ không bao gồm
  const excludedServices = [
    "Chi phí tiêu dùng cá nhân: giặt ủi, điện thoại, đồ uống ngoài thực đơn.",
    "Thuế giá trị gia tăng (VAT) khi yêu cầu xuất hóa đơn đỏ.",
    "Phụ thu phòng đơn nếu quý khách có nhu cầu ở riêng 1 người/phòng.",
    "Tiền bồi dưỡng (Tip) tự nguyện dành cho hướng dẫn viên và lái xe.",
    "Vé tham quan các điểm phát sinh ngoài lịch trình công bố.",
  ];

  return (
    <div className="detail-box tour-highlights-box">
      <h2 className="box-title">
        <i className="fa-solid fa-list-check title-icon"></i>
        Dịch Vụ Bao Gồm & Không Bao Gồm
      </h2>

      <div className="service-policy-grid">
        {/* Cột bao gồm */}
        <div className="service-col service-col-included">
          <div className="service-col-header">
            <i className="fa-solid fa-circle-check"></i>
            <h4>Giá Tour Đã Bao Gồm</h4>
          </div>
          <ul className="service-list">
            {includedServices.map((svc, i) => (
              <li key={i}>
                <i className="fa-solid fa-check"></i>
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột không bao gồm */}
        <div className="service-col service-col-excluded">
          <div className="service-col-header">
            <i className="fa-solid fa-circle-xmark"></i>
            <h4>Giá Tour Chưa Bao Gồm</h4>
          </div>
          <ul className="service-list">
            {excludedServices.map((svc, i) => (
              <li key={i}>
                <i className="fa-solid fa-xmark"></i>
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

