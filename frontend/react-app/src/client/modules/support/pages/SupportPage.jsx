import React from "react";
import { Breadcrumb } from "../../../shared";

function SupportPage() {
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
        <div className="contact-layout">
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
                  <span>Số 123, đường ABC, thành phố XYZ</span>
                </div>
              </div>
              <div className="ci-box">
                <div className="ci-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="ci-text">
                  <strong>Hotline Hỗ Trợ:</strong>
                  <span>0123.456.789 (Hoạt động 24/7)</span>
                </div>
              </div>
              <div className="ci-box">
                <div className="ci-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="ci-text">
                  <strong>Email CSKH:</strong>
                  <span>contact@travelgo.com</span>
                </div>
              </div>
            </div>

            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.324278456475!2d106.66310231533418!3d10.7864522923145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed2392c44df%3A0xd2ecb62e0d050fe9!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: "16px" }}
                allowFullScreen=""
                loading="lazy"
                title="Bản đồ TravelGo"
              ></iframe>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="b-box" style={{ margin: 0, padding: "40px 30px" }}>
              <h2 className="contact-title" style={{ marginBottom: "25px" }}>
                Gửi yêu cầu hỗ trợ
              </h2>

              <form className="contact-form">
                <div className="b-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Họ và tên <span className="text-red">(*)</span>
                    </label>
                    <input
                      type="text"
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
                      type="text"
                      className="b-input"
                      placeholder="Nhập số điện thoại"
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
                    className="b-input"
                    placeholder="Ví dụ: email@gmail.com"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label className="form-label">Vấn đề cần hỗ trợ</label>
                  <input
                    type="text"
                    className="b-input"
                    placeholder="Ví dụ: Thay đổi lịch trình tour..."
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
                    className="b-input"
                    rows="5"
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-contact">
                  <i className="fa-solid fa-paper-plane"></i> Gửi yêu cầu ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
