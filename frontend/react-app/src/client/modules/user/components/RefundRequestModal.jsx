import React, { useState } from "react";
import { toast } from "sonner";
import { formatDate, formatPrice } from "../../../utils/format.helper";
import { requestCancelBooking } from "../services/userService";

export default function RefundRequestModal({ booking, onClose, onSuccess }) {
  if (!booking) return null;

  // Xác định trạng thái thanh toán & phương thức thanh toán
  const paymentStatus =
    booking.payment?.status || booking.payment_status || "pending";
  const isPaid = paymentStatus === "paid";

  const paymentMethod =
    booking.payment?.method || booking.payment_method || "cash";

  const [reasonCategory, setReasonCategory] = useState(
    isPaid ? "Thay đổi lịch trình cá nhân" : "Đổi ý định, không còn nhu cầu đi tour"
  );
  const [customReason, setCustomReason] = useState("");
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dành riêng cho đơn Cash đã thanh toán
  const [refundReceiveMethod, setRefundReceiveMethod] = useState("bank");
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  // Lấy ngày khởi hành
  const startDateStr =
    booking.start_date ||
    booking.tour?.start_date ||
    booking.selectedDate?.start_date;

  // Tính số ngày còn lại và % hoàn tiền logic
  const calculatePolicy = (dateStr) => {
    if (!dateStr) {
      return {
        days: 0,
        rate: 0,
        percent: "0%",
        desc: "Không xác định ngày khởi hành",
        tier: 5,
        statusLabel: "Chưa xác định ngày",
        statusColor: "tag-gray",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);

    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 15) {
      return {
        days: diffDays,
        rate: 1.0,
        percent: "100%",
        desc: "Hủy trước 15 ngày trở lên",
        tier: 1,
        statusLabel: `Còn ${diffDays} ngày nữa khởi hành`,
        statusColor: "tag-emerald",
      };
    } else if (diffDays >= 8) {
      return {
        days: diffDays,
        rate: 0.7,
        percent: "70%",
        desc: "Hủy trước 8 – 14 ngày",
        tier: 2,
        statusLabel: `Còn ${diffDays} ngày nữa khởi hành`,
        statusColor: "tag-blue",
      };
    } else if (diffDays >= 4) {
      return {
        days: diffDays,
        rate: 0.5,
        percent: "50%",
        desc: "Hủy trước 4 – 7 ngày",
        tier: 3,
        statusLabel: `Còn ${diffDays} ngày nữa khởi hành`,
        statusColor: "tag-amber",
      };
    } else if (diffDays >= 1) {
      return {
        days: diffDays,
        rate: 0.3,
        percent: "30%",
        desc: "Hủy trước 1 – 3 ngày",
        tier: 4,
        statusLabel: `Còn ${diffDays} ngày nữa khởi hành`,
        statusColor: "tag-orange",
      };
    } else if (diffDays === 0) {
      return {
        days: 0,
        rate: 0.0,
        percent: "0%",
        desc: "Hủy trong ngày khởi hành",
        tier: 5,
        statusLabel: "Khởi hành hôm nay",
        statusColor: "tag-rose",
      };
    } else {
      const daysPassed = Math.abs(diffDays);
      return {
        days: diffDays,
        rate: 0.0,
        percent: "0%",
        desc: "Chuyến đi đã qua ngày khởi hành",
        tier: 5,
        statusLabel: `Đã khởi hành (${daysPassed} ngày trước)`,
        statusColor: "tag-slate",
      };
    }
  };

  const policy = calculatePolicy(startDateStr);
  const isPastTour = policy.days < 0;

  // Số tiền của đơn hàng
  const totalAmount =
    Number(booking.totalAmount) ||
    Number(booking.total) ||
    Number(booking.pricing?.final_total) ||
    0;

  const paidAmount = isPaid
    ? Number(booking.payment?.payable_amount) || totalAmount
    : 0;

  // Số tiền hoàn dự kiến (Chỉ áp dụng khi đã thanh toán)
  const refundAmount = isPaid ? Math.round(paidAmount * policy.rate) : 0;
  const feeAmount = isPaid ? paidAmount - refundAmount : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedPolicy) {
      toast.warning("Vui lòng tích chọn đồng ý với điều khoản xác nhận!");
      return;
    }

    // Nếu là đơn Cash đã thanh toán và chọn nhận qua ngân hàng: validate thông tin STK
    if (isPaid && paymentMethod === "cash" && refundReceiveMethod === "bank") {
      if (
        !bankInfo.bankName.trim() ||
        !bankInfo.accountNumber.trim() ||
        !bankInfo.accountHolder.trim()
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin tài khoản ngân hàng để nhận tiền hoàn!");
        return;
      }
    }

    const finalReason = customReason.trim()
      ? `${reasonCategory}: ${customReason.trim()}`
      : reasonCategory;

    setIsSubmitting(true);
    try {
      const payload = {
        reason: finalReason,
        is_paid: isPaid,
        refund_policy: isPaid ? policy.percent : "0%",
        paid_amount: paidAmount,
        refund_amount: refundAmount,
        payment_method: paymentMethod,
        refund_receive_method:
          isPaid && paymentMethod === "cash" ? refundReceiveMethod : "original_source",
        bank_info:
          isPaid && paymentMethod === "cash" && refundReceiveMethod === "bank"
            ? bankInfo
            : null,
      };

      const res = await requestCancelBooking(booking.id, payload);

      if (res && res.success) {
        toast.success(
          isPaid
            ? "Đã gửi yêu cầu hoàn tiền thành công!"
            : "Đã hủy giữ chỗ thành công!",
          {
            description: isPaid
              ? "TravelGo sẽ xử lý yêu cầu và hoàn tiền theo đúng thông tin bạn đã cung cấp."
              : "Vị trí giữ chỗ của bạn đã được giải phóng thành công.",
          }
        );
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Không thể thực hiện yêu cầu lúc này.");
      }
    } catch (error) {
      toast.error(error?.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="refund-modal-backdrop" onClick={onClose}>
      <div
        className="refund-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Modal */}
        <div className="refund-modal-header">
          <div className="rmh-left">
            <div className={`rmh-icon ${isPaid ? "paid" : "unpaid"}`}>
              <i
                className={
                  isPaid
                    ? "fa-solid fa-hand-holding-dollar"
                    : isPastTour
                    ? "fa-solid fa-calendar-xmark"
                    : "fa-solid fa-bookmark"
                }
              ></i>
            </div>
            <div className="rmh-text-wrap">
              <h3 className="refund-modal-title">
                {isPaid
                  ? "Yêu Cầu Hoàn Tiền & Hủy Tour"
                  : isPastTour
                  ? "Đóng Đơn Giữ Chỗ Quá Hạn"
                  : "Xác Nhận Hủy Giữ Chỗ Tour"}
              </h3>
              <div className="refund-modal-sub">
                <span>Mã đơn: <strong className="rmh-code">#{booking.booking_code}</strong></span>
                <span className="rmh-dot">•</span>
                <span className={`rm-badge-inline ${isPaid ? "badge-paid" : "badge-unpaid"}`}>
                  {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="refund-modal-close-btn"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body Modal có scroll */}
        <form onSubmit={handleSubmit} className="refund-modal-body">
          {/* Mini Card Tour */}
          <div className="rm-mini-tour">
            {booking.tour?.thumbnail ? (
              <img
                src={booking.tour.thumbnail}
                alt={booking.tour?.title || "Tour"}
                className="rm-tour-img"
              />
            ) : (
              <div className="rm-tour-img-placeholder">
                <i className="fa-solid fa-mountain-sun"></i>
              </div>
            )}
            <div className="rm-tour-meta">
              <h4 className="rm-tour-title" title={booking.tour?.title}>
                {booking.tour?.title || "Tour du lịch"}
              </h4>
              <div className="rm-tour-meta-row">
                <span className="rm-meta-date">
                  <i className="fa-regular fa-calendar-check"></i>
                  <span>Khởi hành: <strong>{formatDate(startDateStr)}</strong></span>
                </span>
                <span className={`rm-countdown-pill ${policy.statusColor}`}>
                  <i className="fa-regular fa-clock"></i> {policy.statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              TRƯỜNG HỢP 1: ĐƠN CHƯA THANH TOÁN (HỦY GIỮ CHỖ MIỄN PHÍ)
             ======================================================== */}
          {!isPaid ? (
            <div className="rm-unpaid-section">
              <div className="rm-unpaid-banner">
                <div className="rm-unpaid-badge-icon">
                  <i className="fa-solid fa-shield-heart"></i>
                </div>
                <div className="rm-unpaid-banner-body">
                  <h5 className="rm-unpaid-banner-title">
                    {isPastTour
                      ? "Đơn giữ chỗ đã hết hiệu lực khởi hành"
                      : "Hủy giữ chỗ hoàn toàn miễn phí (0 VNĐ)"}
                  </h5>
                  <p className="rm-unpaid-banner-desc">
                    {isPastTour ? (
                      <>
                        Chuyến đi này đã diễn ra vào ngày <strong>{formatDate(startDateStr)}</strong>. 
                        Do đơn chưa thanh toán, hệ thống sẽ tự động đóng đơn và lưu trữ vào lịch sử của bạn 
                        mà không phát sinh bất kỳ khoản phí hay ràng buộc nào.
                      </>
                    ) : (
                      <>
                        Đơn đặt chỗ này hiện đang ở trạng thái <strong>Chưa thanh toán</strong>. 
                        Thao tác hủy sẽ giải phóng vị trí đã giữ để phục vụ khách khác. 
                        Quý khách <strong>hoàn toàn không phải chịu bất kỳ chi phí hay phạt cọc nào</strong>.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Bảng kê tài chính rõ ràng cho đơn chưa thanh toán - KHÔNG nói về số tiền hoàn */}
              <div className="rm-summary-cards-grid">
                <div className="rm-sc-item">
                  <span className="rm-sc-label">Tổng giá trị đơn tour</span>
                  <span className="rm-sc-value text-slate-800">{formatPrice(totalAmount)}</span>
                </div>
                <div className="rm-sc-item">
                  <span className="rm-sc-label">Đã thanh toán</span>
                  <span className="rm-sc-value text-slate-500">0 VNĐ</span>
                </div>
                <div className="rm-sc-item rm-sc-highlight">
                  <span className="rm-sc-label">Phí hủy giữ chỗ</span>
                  <span className="rm-sc-value text-emerald-600 font-bold">0 VNĐ (Miễn phí)</span>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
               TRƯỜNG HỢP 2: ĐƠN ĐÃ THANH TOÁN (ÁP DỤNG CHÍNH SÁCH HOÀN TIỀN)
               ======================================================== */
            <div className="rm-paid-section">
              {isPastTour ? (
                <div className="rm-past-warning-box">
                  <div className="rm-pw-icon">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                  </div>
                  <div className="rm-pw-content">
                    <h5 className="rm-pw-title">Tour đã qua ngày khởi hành</h5>
                    <p className="rm-pw-desc">
                      Chuyến đi đã khởi hành vào ngày <strong>{formatDate(startDateStr)}</strong>. 
                      Theo quy định của TravelGo, các yêu cầu sau thời điểm khởi hành không áp dụng chính sách hoàn tiền 
                      (Tỷ lệ hoàn: <strong>0%</strong>).
                    </p>
                    <p className="rm-pw-note">
                      * Nếu bạn gặp sự cố bất khả kháng (sức khỏe cấp cứu, thiên tai), vui lòng liên hệ hotline{" "}
                      <strong>1900 6868</strong> để nhân viên chăm sóc khách hàng hỗ trợ xem xét riêng.
                    </p>
                  </div>
                </div>
              ) : (
                /* Bảng chính sách hoàn tiền theo mốc */
                <div className="rm-policy-block">
                  <div className="rm-policy-header-row">
                    <span className="rm-block-title">
                      <i className="fa-solid fa-scale-balanced text-primary"></i> Chính sách hoàn tiền áp dụng:
                    </span>
                    <span className="rm-policy-current-badge">
                      {policy.percent === "100%"
                        ? "Được hoàn 100% (Tối đa)"
                        : `Áp dụng mức hoàn ${policy.percent}`}
                    </span>
                  </div>

                  <div className="rm-policy-list">
                    <div className={`rm-policy-item ${policy.tier === 1 ? "is-active" : ""}`}>
                      <div className="rm-pi-time">
                        <i className="fa-regular fa-clock"></i>
                        <span>Trước ngày khởi hành ≥ 15 ngày</span>
                      </div>
                      <div className="rm-pi-rate">Hoàn 100%</div>
                      {policy.tier === 1 && <span className="rm-pi-tag">Mức của bạn</span>}
                    </div>

                    <div className={`rm-policy-item ${policy.tier === 2 ? "is-active" : ""}`}>
                      <div className="rm-pi-time">
                        <i className="fa-regular fa-clock"></i>
                        <span>Từ 8 – 14 ngày trước khởi hành</span>
                      </div>
                      <div className="rm-pi-rate">Hoàn 70%</div>
                      {policy.tier === 2 && <span className="rm-pi-tag">Mức của bạn</span>}
                    </div>

                    <div className={`rm-policy-item ${policy.tier === 3 ? "is-active" : ""}`}>
                      <div className="rm-pi-time">
                        <i className="fa-regular fa-clock"></i>
                        <span>Từ 4 – 7 ngày trước khởi hành</span>
                      </div>
                      <div className="rm-pi-rate">Hoàn 50%</div>
                      {policy.tier === 3 && <span className="rm-pi-tag">Mức của bạn</span>}
                    </div>

                    <div className={`rm-policy-item ${policy.tier === 4 ? "is-active" : ""}`}>
                      <div className="rm-pi-time">
                        <i className="fa-regular fa-clock"></i>
                        <span>Từ 1 – 3 ngày trước khởi hành</span>
                      </div>
                      <div className="rm-pi-rate">Hoàn 30%</div>
                      {policy.tier === 4 && <span className="rm-pi-tag">Mức của bạn</span>}
                    </div>

                    <div className={`rm-policy-item ${policy.tier === 5 ? "is-active" : ""}`}>
                      <div className="rm-pi-time">
                        <i className="fa-regular fa-clock"></i>
                        <span>Trong vòng 24h hoặc sau khởi hành</span>
                      </div>
                      <div className="rm-pi-rate text-rose-600">0% (Không hoàn)</div>
                      {policy.tier === 5 && <span className="rm-pi-tag is-rose">Mức của bạn</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Bảng kê tài chính hoàn tiền chi tiết */}
              <div className="rm-financial-detail-card">
                <div className="rm-fd-row">
                  <span className="rm-fd-label">Số tiền bạn đã thanh toán:</span>
                  <span className="rm-fd-val">{formatPrice(paidAmount)}</span>
                </div>
                <div className="rm-fd-row">
                  <span className="rm-fd-label">Tỷ lệ hoàn tiền:</span>
                  <span className="rm-fd-val font-semibold text-primary">{policy.percent}</span>
                </div>
                {feeAmount > 0 && (
                  <div className="rm-fd-row">
                    <span className="rm-fd-label">Phí hủy dịch vụ theo quy định:</span>
                    <span className="rm-fd-val text-rose-600">-{formatPrice(feeAmount)}</span>
                  </div>
                )}
                <div className="rm-fd-divider"></div>
                <div className="rm-fd-row rm-fd-total-row">
                  <span className="rm-fd-total-label">Số tiền thực nhận lại:</span>
                  <strong className="rm-fd-total-val">{formatPrice(refundAmount)}</strong>
                </div>
              </div>

              {/* Phương thức nhận tiền hoàn (Phân nhánh VNPAY vs Tiền mặt) */}
              {paymentMethod === "cash" ? (
                <div className="rm-receive-channel-box">
                  <label className="rm-section-label">
                    <i className="fa-solid fa-money-bill-transfer text-primary"></i>
                    <span>Chọn phương thức nhận tiền hoàn:</span>
                  </label>

                  <div className="rm-receive-options-grid">
                    <label className={`rm-opt-card ${refundReceiveMethod === "bank" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="refundReceiveMethod"
                        value="bank"
                        checked={refundReceiveMethod === "bank"}
                        onChange={() => setRefundReceiveMethod("bank")}
                      />
                      <div className="rm-opt-info">
                        <strong className="rm-opt-name">Chuyển khoản ngân hàng</strong>
                        <span className="rm-opt-sub">TravelGo sẽ chuyển tiền trực tiếp vào tài khoản ngân hàng của bạn</span>
                      </div>
                    </label>

                    <label className={`rm-opt-card ${refundReceiveMethod === "cash_office" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="refundReceiveMethod"
                        value="cash_office"
                        checked={refundReceiveMethod === "cash_office"}
                        onChange={() => setRefundReceiveMethod("cash_office")}
                      />
                      <div className="rm-opt-info">
                        <strong className="rm-opt-name">Nhận tiền mặt tại quầy</strong>
                        <span className="rm-opt-sub">Nhận tiền trực tiếp tại văn phòng giao dịch của TravelGo</span>
                      </div>
                    </label>
                  </div>

                  {refundReceiveMethod === "bank" ? (
                    <div className="rm-bank-fields-grid">
                      <div className="rm-field-item">
                        <label className="rm-input-label">Ngân hàng thụ hưởng <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          className="b-input"
                          placeholder="VD: Vietcombank, Techcombank, MB..."
                          value={bankInfo.bankName}
                          onChange={(e) =>
                            setBankInfo({ ...bankInfo, bankName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="rm-field-item">
                        <label className="rm-input-label">Số tài khoản ngân hàng <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          className="b-input"
                          placeholder="Nhập số tài khoản của bạn"
                          value={bankInfo.accountNumber}
                          onChange={(e) =>
                            setBankInfo({ ...bankInfo, accountNumber: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="rm-field-item rm-col-full">
                        <label className="rm-input-label">Tên chủ tài khoản (Viết hoa không dấu) <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          className="b-input"
                          placeholder="VD: NGUYEN VAN A"
                          value={bankInfo.accountHolder}
                          onChange={(e) =>
                            setBankInfo({ ...bankInfo, accountHolder: e.target.value.toUpperCase() })
                          }
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rm-office-info-box">
                      <i className="fa-solid fa-location-dot rm-oib-icon"></i>
                      <div className="rm-oib-content">
                        <strong>Địa điểm nhận tiền mặt:</strong>
                        <p>Trụ sở TravelGo: Tầng 5, Tòa nhà TravelGo Building, Quận 1, TP. Hồ Chí Minh.</p>
                        <span className="rm-oib-hint">
                          * Giờ làm việc: 08:00 – 17:30 (Thứ 2 – Thứ 7). Quý khách vui lòng mang theo CCCD và mã đơn tour.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rm-vnpay-notice-box">
                  <div className="rm-vnpay-icon">
                    <i className="fa-solid fa-shield-check"></i>
                  </div>
                  <div className="rm-vnpay-content">
                    <strong>Hoàn tiền tự động qua cổng VNPAY:</strong>
                    <p>
                      Sau khi yêu cầu được bộ phận CSKH phê duyệt, số tiền hoàn trả sẽ được chuyển trực tiếp 
                      về tài khoản ngân hàng / thẻ bạn đã dùng để thanh toán trên VNPAY trong vòng 3 – 5 ngày làm việc.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form lý do hủy tour */}
          <div className="rm-reasons-block">
            <div className="rm-field-item">
              <label className="rm-input-label">
                Lý do {isPaid ? "hủy tour & yêu cầu hoàn tiền" : "hủy giữ chỗ"} <span className="text-rose-500">*</span>
              </label>
              <select
                className="b-input rm-select-input"
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
              >
                {isPaid ? (
                  <>
                    <option value="Thay đổi lịch trình cá nhân">Thay đổi lịch trình cá nhân</option>
                    <option value="Có việc bận gia đình đột xuất">Có việc bận gia đình đột xuất</option>
                    <option value="Sức khỏe không đảm bảo chuyến đi">Sức khỏe không đảm bảo chuyến đi</option>
                    <option value="Thời tiết không thuận lợi tại điểm đến">Thời tiết không thuận lợi tại điểm đến</option>
                    <option value="Muốn đổi sang tour hoặc ngày khởi hành khác">Muốn đổi sang tour hoặc ngày khởi hành khác</option>
                    <option value="Lý do khác">Lý do khác</option>
                  </>
                ) : (
                  <>
                    <option value="Đổi ý định, không còn nhu cầu đi tour">Đổi ý định, không còn nhu cầu đi tour</option>
                    <option value="Thay đổi kế hoạch thời gian">Thay đổi kế hoạch thời gian</option>
                    <option value="Đặt nhầm ngày hoặc nhầm số lượng khách">Đặt nhầm ngày hoặc nhầm số lượng khách</option>
                    <option value="Tìm thấy tour khác phù hợp hơn">Tìm thấy tour khác phù hợp hơn</option>
                    <option value="Lý do khác">Lý do khác</option>
                  </>
                )}
              </select>
            </div>

            <div className="rm-field-item">
              <label className="rm-input-label">Ghi chú thêm (Tùy chọn):</label>
              <textarea
                rows="2"
                className="b-input rm-textarea-input"
                placeholder="Chia sẻ thêm thông tin nếu bạn cần hỗ trợ đặc biệt..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Điều khoản xác nhận */}
          <div className="rm-consent-block">
            <label className="rm-checkbox-label">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) => setAgreedPolicy(e.target.checked)}
                className="rm-consent-checkbox"
              />
              <span className="rm-consent-text">
                {isPaid
                  ? "Tôi đã đọc, hiểu rõ và đồng ý với chính sách hoàn hủy tour của TravelGo cùng số tiền hoàn dự kiến."
                  : "Tôi xác nhận muốn hủy giữ chỗ cho đơn tour này và đồng ý nhường vị trí cho khách khác."}
              </span>
            </label>
          </div>

          {/* Footer nút hành động */}
          <div className="refund-modal-footer">
            <button
              type="button"
              className="rm-btn rm-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {isPaid ? "Giữ lại tour" : "Giữ lại chỗ"}
            </button>

            <button
              type="submit"
              className="rm-btn rm-btn-danger"
              disabled={isSubmitting || !agreedPolicy}
            >
              <i
                className={
                  isPaid
                    ? "fa-solid fa-paper-plane"
                    : isPastTour
                    ? "fa-solid fa-check"
                    : "fa-solid fa-xmark"
                }
              ></i>
              <span>
                {isSubmitting
                  ? " Đang xử lý..."
                  : isPaid
                  ? " Gửi yêu cầu hoàn tiền"
                  : isPastTour
                  ? " Xác nhận đóng đơn"
                  : " Xác nhận hủy giữ chỗ"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
