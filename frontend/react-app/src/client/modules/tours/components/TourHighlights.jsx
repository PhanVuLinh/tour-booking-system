import React from "react";

export default function TourHighlights({ tourData = null }) {
  // Điểm nhấn tiêu chuẩn dịch vụ cao cấp
  const highlights = [
    {
      icon: "fa-shield-halved",
      colorClass: "highlight-icon-shield",
      title: "Bảo Hiểm Du Lịch 100 Triệu",
      desc: "Bảo hiểm du lịch trọn gói với mức trách nhiệm bồi thường tối đa 100.000.000 VNĐ/người/vụ.",
    },
    {
      icon: "fa-hotel",
      colorClass: "highlight-icon-hotel",
      title: "Khách Sạn 3 - 4 Sao Tiêu Chuẩn",
      desc: "Nghỉ ngơi tại khách sạn tiện nghi, vị trí trung tâm thuận tiện dạo phố đêm và ngắm cảnh.",
    },
    {
      icon: "fa-bus",
      colorClass: "highlight-icon-bus",
      title: "Xe Du Lịch Đời Mới Suốt Tuyến",
      desc: "Đưa đón bằng xe máy lạnh hiện đại, tài xế lịch sự, an toàn và thông thạo cung đường.",
    },
    {
      icon: "fa-user-tie",
      colorClass: "highlight-icon-guide",
      title: "Hướng Dẫn Viên Chuyên Nghiệp",
      desc: "Đội ngũ HDV nhiệt tình, am hiểu sâu sắc lịch sử - văn hóa địa phương, hỗ trợ đoàn 24/7.",
    },
  ];

  // Danh sách dịch vụ bao gồm
  const includedServices = [
    "Vé máy bay / Xe du lịch máy lạnh đưa đón theo chương trình.",
    "Khách sạn tiêu chuẩn 3 - 4 sao (2 khách/phòng, lẻ nam/nữ ở phòng 3).",
    "Các bữa ăn chính theo ẩm thực đặc sản vùng miền + Bữa sáng buffet tại khách sạn.",
    "Vé tham quan tất cả các điểm du lịch có trong lịch trình.",
    "Bảo hiểm du lịch nội địa / quốc tế theo quy chuẩn Nhà nước.",
    "Nước suối tinh khiết (1 chai 500ml/ngày/khách) + Khăn lạnh phục vụ trên xe.",
    "Quà tặng du lịch lưu niệm TravelGo (Mũ lữ hành, thẻ hành lý).",
  ];

  // Danh sách dịch vụ không bao gồm
  const excludedServices = [
    "Chi phí tiêu dùng cá nhân: giặt ủi, điện thoại, minibar, đồ uống ngoài thực đơn.",
    "Thuế giá trị gia tăng (VAT) 8% khi yêu cầu xuất hóa đơn đỏ công ty.",
    "Phụ thu phòng đơn nếu quý khách có nhu cầu ở riêng 1 người/phòng.",
    "Tiền bồi dưỡng (Tip) tự nguyện dành cho hướng dẫn viên và lái xe phục vụ đoàn.",
    "Vé tham quan các điểm phát sinh ngoài lịch trình công bố.",
  ];

  return (
    <div className="detail-box tour-highlights-box">
      {/* 1. Điểm nhấn dịch vụ tour */}
      <div className="highlights-section">
        <h2 className="box-title">
          <i className="fa-solid fa-award title-icon"></i>
          Cam Kết & Điểm Nhấn Dịch Vụ Của Chuyến Đi
        </h2>

        <div className="highlights-cards-grid">
          {highlights.map((item, idx) => (
            <div key={idx} className="highlight-feature-card">
              <div className={`highlight-feature-icon ${item.colorClass}`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div className="highlight-feature-text">
                <h4 className="highlight-feature-title">{item.title}</h4>
                <p className="highlight-feature-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Bảng đối sánh Bao gồm & Không bao gồm */}
      <div className="service-policy-section">
        <h3 className="service-policy-heading">
          <i className="fa-solid fa-clipboard-check"></i>
          Chi Tiết Dịch Vụ Bao Gồm & Không Bao Gồm
        </h3>

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

      {/* 3. Chính sách hoàn hủy linh hoạt */}
      <div className="refund-policy-bar">
        <div className="rpb-icon">
          <i className="fa-solid fa-shield-cat"></i>
        </div>
        <div className="rpb-content">
          <h4>Chính sách hủy tour linh hoạt</h4>
          <p>
            Hủy trước 07 ngày so với ngày khởi hành: <strong>Hoàn 100% chi phí</strong>. Hỗ trợ đổi ngày khởi hành hoặc chuyển nhượng cho người thân miễn phí theo quy định của VietRoute.
          </p>
        </div>
      </div>
    </div>
  );
}
