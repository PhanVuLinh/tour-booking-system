import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { formatDate, formatPrice } from "../utils/format.helper";
import { lookupBookingService } from "../modules/booking/services/bookingService";
import logoTravelGo from "@/assets/Client/images/logotravelgo.png";

export default function ETicketBoardingPass({ booking, onClose }) {
  const [liveBooking, setLiveBooking] = useState(booking || null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const ticketRef = useRef(null);

  // Gọi API Backend lấy dữ liệu đơn hàng mới nhất và đầy đủ nhất từ Database
  useEffect(() => {
    const code =
      booking?.booking_code ||
      booking?.bookingCode ||
      booking?.code;

    if (!code) return;

    setLoading(true);
    lookupBookingService(code)
      .then((res) => {
        if (res && res.success && res.data) {
          setLiveBooking(res.data);
        }
      })
      .catch((err) => {
        console.warn("Không thể gọi API đồng bộ vé, dùng dữ liệu truyền vào:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [booking]);

  // Khóa cuộn trang nền qua class và hỗ trợ phím ESC đóng modal
  useEffect(() => {
    document.body.classList.add("modal-eticket-open");

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-eticket-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!booking && !liveBooking) return null;

  const currentData = liveBooking || booking;

  // Dữ liệu động từ API Backend
  const bookingCode = currentData.booking_code || currentData.bookingCode || "Đang cập nhật";
  const tourTitle = currentData.tour?.title || currentData.tourTitle || "Đang cập nhật";

  const startDateStr =
    currentData.tour?.start_date ||
    currentData.start_date ||
    currentData.selectedDate?.start_date;

  const departureFrom =
    currentData.tour?.departure_from ||
    currentData.tour?.departure_location ||
    currentData.contact?.address ||
    "Theo thông báo lịch trình của hướng dẫn viên";

  const contactName =
    currentData.contact?.full_name ||
    currentData.contactName ||
    "Quý khách";

  const contactPhone = currentData.contact?.phone || "Chưa cập nhật";
  const contactEmail = currentData.contact?.email || "Chưa cập nhật";

  const passengers = currentData.passengers || [];
  const passengerCount =
    passengers.length ||
    Number(currentData.totalPassengers) ||
    1;

  const paymentStatus =
    currentData.payment?.status ||
    currentData.payment_status ||
    currentData.status ||
    "pending";
  const isPaid = paymentStatus === "paid";

  const paymentMethod =
    currentData.payment?.method || currentData.payment_method || "cash";

  const totalAmount =
    Number(currentData.pricing?.total) ||
    Number(currentData.totalAmount) ||
    Number(currentData.total) ||
    0;

  const subTotal =
    Number(currentData.pricing?.sub_total) ||
    Number(currentData.sub_total) ||
    totalAmount;

  const discount =
    Number(currentData.pricing?.discount) ||
    Number(currentData.discount) ||
    0;

  const createdAtStr = currentData.created_at || currentData.bookingDate;

  // Định dạng hiển thị phương thức thanh toán
  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case "vnpay":
        return "Cổng thanh toán VNPAY";
      case "momo":
        return "Ví điện tử MoMo";
      case "cash":
        return "Tiền mặt tại quầy TravelGo";
      default:
        return method || "Chưa xác định";
    }
  };

  // Định dạng hiển thị nhóm hành khách
  const getPassengerTypeLabel = (type) => {
    switch (type) {
      case "adult":
        return "Người lớn";
      case "children":
        return "Trẻ em";
      case "baby":
        return "Em bé";
      default:
        return type || "Hành khách";
    }
  };

  // In vé trực tiếp qua trình duyệt với giao diện Print A4 từ phase2.css
  const handlePrint = () => {
    window.print();
  };

  // Xuất file PDF tải về máy bằng html2canvas-pro và jsPDF (chuẩn A4 và hỗ trợ đầy đủ oklch)
  const handleDownloadPDF = async () => {
    const element = ticketRef.current;
    if (!element) return;

    setIsExporting(true);
    const toastId = toast.loading("Đang khởi tạo file PDF vé điện tử từ dữ liệu thật...");

    try {
      const html2canvasModule = await import("html2canvas-pro");
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const marginX = 8;
      const marginY = 8;
      const contentWidth = pdfWidth - marginX * 2; // 194mm
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", marginX, marginY, contentWidth, contentHeight);
      pdf.save(`TravelGo_VeTour_${bookingCode}.pdf`);
      toast.success("Tải vé điện tử PDF thành công!", { id: toastId });
    } catch (err) {
      console.error("Lỗi xuất PDF:", err);
      toast.error("Không thể xuất file PDF: " + (err.message || "Lỗi xử lý"), { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const modalContent = (
    <div className="eticket-modal-backdrop" onClick={onClose}>
      <div
        className="eticket-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh công cụ thao tác trên cùng */}
        <div className="eticket-toolbar no-print">
          <div className="et-tb-left">
            <span className="et-tb-title">
              <i className="fa-solid fa-ticket et-text-primary"></i> Phiếu Xác Nhận Đặt Tour & Thẻ Lên Tour
            </span>
            <span className="et-tb-badge">
              {loading ? "Đang tải dữ liệu API..." : "Dữ liệu máy chủ"}
            </span>
          </div>

          <div className="et-tb-actions">
            <button
              type="button"
              className="btn-et-action btn-et-print"
              onClick={handlePrint}
              disabled={loading}
              title="In trực tiếp ra máy in hoặc Lưu dưới dạng PDF"
            >
              <i className="fa-solid fa-print"></i> In vé
            </button>

            <button
              type="button"
              className="btn-et-action btn-et-pdf"
              onClick={handleDownloadPDF}
              disabled={isExporting || loading}
              title="Tải file PDF lưu về điện thoại/máy tính"
            >
              <i className="fa-solid fa-file-pdf"></i>
              {isExporting ? " Đang xuất..." : " Tải PDF"}
            </button>

            <button
              type="button"
              className="btn-et-close"
              onClick={onClose}
              title="Đóng cửa sổ"
              aria-label="Đóng"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Khung tài liệu vé in A4 */}
        <div className="eticket-scroll-wrapper">
          {loading ? (
            <div className="et-loading-box">
              <div className="client-spinner"></div>
              <p>Đang đồng bộ dữ liệu vé từ cơ sở dữ liệu hệ thống...</p>
            </div>
          ) : (
            <div
              id="printable-eticket"
              ref={ticketRef}
              className="eticket-printable-card"
            >
              {/* Header Thẻ Lên Tour: Dùng LOGO THẬT CỦA WEBSITE */}
              <div className="et-header">
                <div className="et-header-brand">
                  <img
                    src={logoTravelGo}
                    alt="TravelGo"
                    className="et-brand-logo-img"
                  />
                  <div>
                    <span className="et-brand-tagline">
                      Hệ Thống Đặt Tour Du Lịch Trực Tuyến Hàng Đầu
                    </span>
                  </div>
                </div>

                <div className="et-header-doc-info">
                  <span className="et-doc-title">PHIẾU XÁC NHẬN VÉ TOUR</span>
                  <span className="et-doc-subtitle">E-TICKET & BOARDING PASS</span>
                  <div className="et-code-tag">
                    MÃ ĐƠN: <strong>#{bookingCode}</strong>
                  </div>
                </div>
              </div>

              {/* Dải thông tin dịch vụ */}
              <div className="et-ticket-strip">
                <span className="et-ts-item">
                  <i className="fa-solid fa-shield-halved et-text-success"></i> Xác nhận hệ thống TravelGo
                </span>
                <span className="et-ts-item">
                  <i className="fa-solid fa-calendar-day"></i> Ngày tạo: {createdAtStr ? formatDate(createdAtStr) : formatDate(new Date())}
                </span>
                <span className="et-ts-item">
                  <i className="fa-solid fa-phone"></i> Hotline: 1900 6868
                </span>
              </div>

              {/* Thân vé: Cột thông tin chuyến đi + Cột cuống vé Check-in */}
              <div className="et-body-grid">
                {/* Cột trái: Thông tin tour & Hành khách */}
                <div className="et-col-main">
                  {/* Khối Tour */}
                  <div className="et-section-box">
                    <div className="et-sb-heading">
                      <i className="fa-solid fa-map-location-dot"></i> THÔNG TIN CHUYẾN ĐI
                    </div>
                    <h3 className="et-tour-name">{tourTitle}</h3>

                    <div className="et-info-matrix">
                      <div className="et-matrix-item">
                        <span className="et-mi-label">Ngày khởi hành:</span>
                        <strong className="et-mi-value et-text-primary">
                          {startDateStr ? formatDate(startDateStr) : "Chưa xác định"}
                        </strong>
                      </div>
                      <div className="et-matrix-item">
                        <span className="et-mi-label">Số lượng khách:</span>
                        <strong className="et-mi-value">{passengerCount} hành khách</strong>
                      </div>
                      <div className="et-matrix-item et-col-span-2">
                        <span className="et-mi-label">Điểm đón & Khởi hành:</span>
                        <strong className="et-mi-value et-text-dark">
                          {departureFrom}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Khối Người liên hệ & Danh sách khách từ Database */}
                  <div className="et-section-box">
                    <div className="et-sb-heading">
                      <i className="fa-solid fa-users"></i> THÔNG TIN HÀNH KHÁCH
                    </div>

                    <div className="et-contact-mini">
                      <span>
                        Người đặt: <strong>{contactName}</strong>
                      </span>
                      <span>
                        SĐT: <strong>{contactPhone}</strong>
                      </span>
                      <span>
                        Email: <strong>{contactEmail}</strong>
                      </span>
                    </div>

                    {passengers && passengers.length > 0 ? (
                      <div className="et-table-container">
                        <div className="et-table-responsive">
                          <table className="et-passenger-table">
                            <thead>
                              <tr>
                                <th className="et-th-stt">STT</th>
                                <th>Họ và tên hành khách</th>
                                <th>Đối tượng</th>
                                <th>CCCD / Ngày sinh</th>
                                <th>Giới tính</th>
                              </tr>
                            </thead>
                            <tbody>
                              {passengers.map((p, idx) => (
                                <tr key={p.id || idx}>
                                  <td className="text-center">{idx + 1}</td>
                                  <td>
                                    <strong>{p.full_name || p.name || `Khách ${idx + 1}`}</strong>
                                  </td>
                                  <td>
                                    <span className="et-p-type">{getPassengerTypeLabel(p.passenger_type || p.type || p.label)}</span>
                                  </td>
                                  <td>
                                    {p.identity_card
                                      ? p.identity_card
                                      : p.dob
                                        ? formatDate(p.dob)
                                        : "Chưa cập nhật"}
                                  </td>
                                  <td>
                                    {p.gender === "male"
                                      ? "Nam"
                                      : p.gender === "female"
                                        ? "Nữ"
                                        : p.gender || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="et-table-scroll-hint no-print">
                          <i className="fa-solid fa-arrows-left-right"></i> Vuốt ngang để xem đủ danh sách khách
                        </div>
                      </div>
                    ) : (
                      <div className="et-single-passenger-note">
                        Đại diện đặt tour: <strong>{contactName}</strong> ({passengerCount} vé).
                      </div>
                    )}
                  </div>

                  {/* Khối Thanh Toán Lấy Trực Tiếp Từ API */}
                  <div className="et-section-box et-finance-box">
                    <div className="et-finance-row">
                      <span>Tạm tính tiền tour:</span>
                      <span>{formatPrice(subTotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="et-finance-row et-text-success">
                        <span>Giảm giá / Ưu đãi:</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="et-finance-row et-total-row">
                      <span>Tổng tiền thanh toán:</span>
                      <strong className="et-total-price">
                        {formatPrice(totalAmount)}
                      </strong>
                    </div>
                    <div className="et-finance-row">
                      <span>Trạng thái thanh toán:</span>
                      <span
                        className={`et-payment-badge ${isPaid ? "paid" : "unpaid"
                          }`}
                      >
                        {isPaid ? "ĐÃ THANH TOÁN (HỢP LỆ)" : "CHƯA THANH TOÁN (GIỮ CHỖ)"}
                      </span>
                    </div>
                    <div className="et-finance-row">
                      <span>Hình thức thanh toán:</span>
                      <strong>{getPaymentMethodDisplay(paymentMethod)}</strong>
                    </div>
                  </div>

                  {/* Ghi chú đơn nếu có */}
                  {currentData.note && (
                    <div className="et-note-box">
                      <span className="et-note-label">Ghi chú từ khách hàng:</span>
                      <p className="et-note-text">{currentData.note}</p>
                    </div>
                  )}
                </div>

                {/* Cột phải: Cuống vé Check-in & QR Code */}
                <div className="et-col-stub">
                  <div className="et-stub-inner">
                    <span className="et-stub-badge">MÃ CHECK-IN</span>

                    <div className="et-qr-box">
                      <QRCodeSVG
                        value={bookingCode}
                        size={135}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <div className="et-stub-code">
                      <span className="et-sc-label">MÃ BOOKING</span>
                      <span className="et-sc-val">{bookingCode}</span>
                    </div>

                    <p className="et-stub-hint">
                      Xuất trình mã QR này cho Điều phối viên / Hướng dẫn viên tại điểm
                      đón để quét xác nhận lên tour.
                    </p>

                    <div className="et-barcode-mock">
                      <div className="et-barcode-lines"></div>
                      <span className="et-barcode-num">
                        *{bookingCode}*
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Điều khoản và lưu ý chân vé */}
              <div className="et-footer-terms">
                <h5 className="et-terms-title">LƯU Ý QUAN TRỌNG KHI KHỞI HÀNH:</h5>
                <ul className="et-terms-list">
                  <li>
                    Quý khách vui lòng mang theo bản gốc <strong>CCCD / Hộ chiếu</strong> còn hạn sử dụng đối với người lớn và Giấy khai sinh bản sao đối với trẻ em.
                  </li>
                  <li>
                    Có mặt tại điểm đón trước giờ khởi hành ít nhất <strong>30 phút</strong> để làm thủ tục điểm danh và sắp xếp hành lý.
                  </li>
                  <li>
                    Hành lý cá nhân gọn nhẹ, tối đa 20kg ký gửi và 7kg xách tay theo quy định lữ hành.
                  </li>
                </ul>
                <div className="et-sign-row">
                  <span className="et-sign-item">
                    Thời điểm in vé: {formatDate(new Date())}
                  </span>
                  <span className="et-sign-item">
                    Hệ thống TravelGo: <em>(Chứng từ điện tử hợp lệ)</em>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
