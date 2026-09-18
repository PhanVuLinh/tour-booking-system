import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Breadcrumb } from "../../../shared";

const FAQ_DATA = [
  {
    id: 1,
    question: "Tôi có thể đổi ngày khởi hành hoặc hủy tour đã đặt không?",
    answer:
      "Bạn hoàn toàn có thể yêu cầu hủy hoặc đổi tour thông qua trang Lịch sử đặt tour trong tài khoản cá nhân. Chính sách hoàn tiền được tính dựa trên số ngày cách ngày khởi hành: trước 15 ngày hoàn 100%, từ 8-14 ngày hoàn 70%, từ 4-7 ngày hoàn 50%, từ 1-3 ngày hoàn 30%. Sau khi gửi yêu cầu, TravelGo sẽ xử lý trong vòng 1-2 ngày làm việc.",
  },
  {
    id: 2,
    question: "Giá tour đã bao gồm vé máy bay, khách sạn và ăn uống chưa?",
    answer:
      "Tất cả các tour trọn gói của TravelGo đều bao gồm: phương tiện di chuyển (xe du lịch đời mới / vé máy bay khứ hồi theo chương trình), tiêu chuẩn khách sạn theo sao đã công bố, các bữa ăn chính theo lịch trình, vé vào cổng các điểm tham quan, bảo hiểm du lịch tối đa 120.000.000đ/vụ và hướng dẫn viên nhiệt tình suốt tuyến.",
  },
  {
    id: 3,
    question: "Chính sách giá vé cho trẻ em và em bé được quy định như thế nào?",
    answer:
      "Trẻ em dưới 2 tuổi (em bé): tính 10% giá tour người lớn hoặc chỉ thu phụ phí bảo hiểm/hàng không (ngủ chung bố mẹ). Trẻ em từ 2 đến 11 tuổi: tính 75% giá tour người lớn (có suất ăn và ghế ngồi riêng, ngủ chung với bố mẹ). Trẻ từ 12 tuổi trở lên: tính giá như người lớn.",
  },
  {
    id: 4,
    question: "Tôi có thể thanh toán tiền tour bằng những phương thức nào?",
    answer:
      "TravelGo hỗ trợ đa dạng phương thức thanh toán an toàn: Thanh toán trực tuyến qua cổng VNPAY (ATM, Visa, Master, VNPAY-QR), Chuyển khoản ngân hàng trực tiếp 24/7, Ví điện tử MoMo, hoặc Thanh toán trực tiếp bằng tiền mặt tại văn phòng TravelGo. Bạn có thể chọn thanh toán 100% hoặc Đặt cọc trước 50%.",
  },
  {
    id: 5,
    question: "Làm thế nào để sử dụng Mã QR Vé Điện Tử khi tham gia tour?",
    answer:
      "Sau khi đặt tour thành công, hệ thống tự động sinh Mã QR duy nhất cho đơn của bạn. Bạn chỉ cần mở màn hình 'Chi tiết đơn tour' hoặc ảnh chụp mã QR trên điện thoại và đưa cho Trưởng đoàn/Hướng dẫn viên quét lúc tập trung lên xe/sân bay để hoàn tất check-in không cần giấy tờ.",
  },
];

function SupportPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Gửi yêu cầu hỗ trợ thành công!", {
        description:
          "Cảm ơn bạn đã liên hệ. Đội ngũ chăm sóc khách hàng TravelGo sẽ phản hồi qua email hoặc số điện thoại trong thời gian sớm nhất.",
      });
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title="Hỗ trợ & Chăm sóc khách hàng"
        thumbnail="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&h=550&q=85"
        list={[
          { title: "Trang chủ", url: "/" },
          { title: "Hỗ trợ", url: "/support" },
        ]}
      />

      <div className="container contact-container">
        {/* Hàng card liên hệ nhanh */}
        <div className="support-quick-cards">
          <div className="sq-card">
            <div className="sq-icon">
              <i className="fa-solid fa-phone-volume"></i>
            </div>
            <h4>Hotline Khẩn Cấp</h4>
            <p>Hỗ trợ 24/7 kể cả ngày lễ</p>
            <a href="tel:0123456789" className="sq-link">
              0123.456.789
            </a>
          </div>

          <div className="sq-card">
            <div className="sq-icon">
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <h4>Email CSKH</h4>
            <p>Phản hồi trong vòng 2 giờ</p>
            <a href="mailto:contact@travelgo.com" className="sq-link">
              contact@travelgo.com
            </a>
          </div>

          <div className="sq-card">
            <div className="sq-icon">
              <i className="fa-solid fa-ticket"></i>
            </div>
            <h4>Tra Cứu Vé Đi Tour</h4>
            <p>Kiểm tra thông tin vé nhanh</p>
            <Link to="/booking/lookup" className="sq-link">
              Tra cứu ngay &rarr;
            </Link>
          </div>
        </div>

        {/* Khối Thông tin & Form gửi hỗ trợ */}
        <div className="contact-layout" style={{ marginTop: "40px" }}>
          {/* Cột trái: Thông tin liên hệ & Bản đồ */}
          <div className="contact-info-section">
            <h2 className="contact-title">Trung tâm hỗ trợ</h2>
            <p className="contact-subtitle">
              Đừng ngần ngại kết nối với TravelGo nếu bạn có bất kỳ câu hỏi nào
              về tour du lịch, dịch vụ hay góp ý phản hồi.
            </p>

            <div className="ci-list">
              <div className="ci-box">
                <div className="ci-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="ci-text">
                  <strong>Trụ sở chính:</strong>
                  <span>Số 123, đường ABC, Quận 1, TP. Hồ Chí Minh</span>
                </div>
              </div>
              <div className="ci-box">
                <div className="ci-icon">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div className="ci-text">
                  <strong>Giờ làm việc:</strong>
                  <span>Thứ 2 - Thứ 7: 08:00 - 18:00 (Hotline 24/7)</span>
                </div>
              </div>
              <div className="ci-box">
                <div className="ci-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="ci-text">
                  <strong>Cam kết dịch vụ:</strong>
                  <span>Bảo hiểm trọn gói - Hoàn hủy minh bạch</span>
                </div>
              </div>
            </div>

            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.324278456475!2d106.66310231533418!3d10.7864522923145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed2392c44df%3A0xd2ecb62e0d050fe9!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="260"
                style={{ border: 0, borderRadius: "16px" }}
                allowFullScreen=""
                loading="lazy"
                title="Bản đồ TravelGo"
              ></iframe>
            </div>
          </div>

          {/* Cột phải: Form liên hệ */}
          <div className="contact-form-section">
            <div className="b-box" style={{ margin: 0, padding: "40px 30px" }}>
              <h2 className="contact-title" style={{ marginBottom: "10px" }}>
                Gửi yêu cầu hỗ trợ
              </h2>
              <p style={{ color: "#666", marginBottom: "25px", fontSize: "14px" }}>
                Hãy để lại lời nhắn, tư vấn viên của chúng tôi sẽ liên hệ lại
                ngay với bạn.
              </p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="b-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Họ và tên <span className="text-red">(*)</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="b-input"
                      placeholder="Nhập họ tên của bạn"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Số điện thoại <span className="text-red">(*)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="b-input"
                      placeholder="Ví dụ: 0912345678"
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label className="form-label">
                    Email liên hệ <span className="text-red">(*)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="b-input"
                    placeholder="Ví dụ: email@gmail.com"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label className="form-label">Chủ đề cần hỗ trợ</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="b-input"
                    placeholder="Ví dụ: Thay đổi lịch trình tour, hỏi thông tin thanh toán..."
                  />
                </div>

                <div
                  className="form-group"
                  style={{ marginTop: "16px", marginBottom: "24px" }}
                >
                  <label className="form-label">
                    Nội dung chi tiết <span className="text-red">(*)</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="b-input"
                    rows="4"
                    placeholder="Mô tả chi tiết câu hỏi hoặc yêu cầu của bạn..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-action btn-fill"
                  style={{ width: "100%" }}
                  disabled={isSubmitting}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  {isSubmitting ? " Đang gửi đi..." : " Gửi yêu cầu ngay"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Khối FAQ: Câu hỏi thường gặp dạng Accordion */}
        <section className="support-faq-section">
          <div className="faq-header">
            <span className="faq-badge">GIẢI ĐÁP THẮC MẮC</span>
            <h2 className="faq-main-title">Câu Hỏi Thường Gặp (FAQ)</h2>
            <p className="faq-sub-title">
              Những thắc mắc phổ biến nhất của du khách khi chuẩn bị hành trình
              cùng TravelGo
            </p>
          </div>

          <div className="faq-accordion-list">
            {FAQ_DATA.map((item) => (
              <div
                key={item.id}
                className={`faq-accordion-item ${activeFaq === item.id ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(item.id)}
                >
                  <span className="faq-q-text">
                    <span className="faq-number">0{item.id}.</span> {item.question}
                  </span>
                  <i
                    className={`fa-solid fa-chevron-down faq-chevron ${
                      activeFaq === item.id ? "rotate" : ""
                    }`}
                  ></i>
                </button>
                {activeFaq === item.id && (
                  <div className="faq-answer-box">
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SupportPage;
