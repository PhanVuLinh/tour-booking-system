import { Link, useSearchParams } from "react-router-dom";

const ERROR_MESSAGES = {
  invalid_signature:
    "Thông tin phản hồi từ VNPAY không hợp lệ. Hệ thống chưa ghi nhận thanh toán.",
  system_error:
    "Hệ thống gặp lỗi khi xác nhận kết quả thanh toán. Vui lòng kiểm tra lịch sử đơn trước khi thanh toán lại.",
};

export default function BookingFailed() {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("error");
  const message =
    ERROR_MESSAGES[errorCode] ||
    "Giao dịch chưa hoàn tất hoặc đã bị hủy. Hệ thống chưa ghi nhận thanh toán.";

  return (
    <div className="step3-success-wrapper">
      <section className="booking-success-panel b-box">
        <div className="success-icon-wrap">
          <i className="fa-solid fa-xmark"></i>
        </div>

        <h2 className="success-title">Thanh toán chưa thành công</h2>
        <p className="success-desc">{message}</p>

        <div className="success-actions-flex">
          <Link to="/" className="btn-action btn-outline">
            <i className="fa-solid fa-house"></i> Về trang chủ
          </Link>
          <Link to="/profile/history" className="btn-action btn-fill">
            Kiểm tra lịch sử đơn <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
