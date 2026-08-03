import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { createVnPayUrlService } from "../services";

export default function BookingFailed() {
  const [searchParams] = useSearchParams();
  const [isRetrying, setIsRetrying] = useState(false);
  const errorCode = searchParams.get("error");
  const responseCode = searchParams.get("responseCode");
  const booking_code = searchParams.get("booking_code");
  const backendMessage = searchParams.get("message");
  const canRetry = Boolean(
    booking_code && errorCode !== "booking_cancelled",
  );
  const message =
    backendMessage ||
    "Giao dịch chưa hoàn tất. Hệ thống chưa ghi nhận thanh toán.";

  const handleRetry = async () => {
    if (!booking_code || isRetrying) return;

    try {
      setIsRetrying(true);
      const response = await createVnPayUrlService(booking_code);
      const paymentUrl = response?.data?.paymentUrl;

      if (!response?.success || !paymentUrl) {
        toast.error(response?.message || "Không thể tạo lại giao dịch VNPay");
        return;
      }

      window.location.assign(paymentUrl);
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="step3-success-wrapper">
      <section className="booking-success-panel b-box">
        <div className="success-icon-wrap">
          <i className="fa-solid fa-xmark"></i>
        </div>

        <h2 className="success-title">Thanh toán chưa thành công</h2>
        <p className="success-desc">{message}</p>

        {booking_code && (
          <div className="order-ref-card">
            <span className="ref-label">Mã đơn đặt tour:</span>
            <strong className="ref-number">{booking_code}</strong>
          </div>
        )}

        {responseCode && (
          <p className="success-desc">Mã phản hồi VNPay: {responseCode}</p>
        )}

        <div className="success-actions-flex">
          <Link to="/" className="btn-action btn-outline">
            <i className="fa-solid fa-house"></i> Về trang chủ
          </Link>

          {canRetry ? (
            <button
              type="button"
              className="btn-action btn-fill"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? "Đang xử lý..." : "Thanh toán lại"}
              {!isRetrying && <i className="fa-solid fa-rotate-right"></i>}
            </button>
          ) : (
            <Link to="/profile/history" className="btn-action btn-fill">
              Kiểm tra lịch sử đơn <i className="fa-solid fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
