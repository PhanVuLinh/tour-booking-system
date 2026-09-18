import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function TicketQRCode({
  bookingCode,
  tourTitle = "",
  startDate = "",
  customerName = "",
  compact = false,
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!bookingCode) return null;

  return (
    <>
      <div className={`ticket-qr-container ${compact ? "compact" : ""}`}>
        <div className="ticket-qr-header">
          <div className="ticket-qr-title-wrap">
            <i className="fa-solid fa-qrcode ticket-qr-icon"></i>
            <div>
              <h4 className="ticket-qr-heading">Mã QR Vé Điện Tử (Check-in)</h4>
              <p className="ticket-qr-sub">
                Xuất trình mã này cho hướng dẫn viên khi lên tour
              </p>
            </div>
          </div>
          <span className="ticket-qr-badge">Vé Hợp Lệ</span>
        </div>

        <div className="ticket-qr-body">
          <div
            className="ticket-qr-code-box"
            onClick={() => setIsZoomed(true)}
            title="Nhấp để phóng to mã QR"
          >
            <QRCodeSVG
              value={bookingCode}
              size={compact ? 120 : 150}
              level="H"
              includeMargin={true}
            />
            <span className="ticket-qr-zoom-hint">
              <i className="fa-solid fa-magnifying-glass-plus"></i> Chạm để phóng to
            </span>
          </div>

          <div className="ticket-qr-info">
            <div className="tq-row">
              <span className="tq-label">Mã vé:</span>
              <strong className="tq-value tq-code">{bookingCode}</strong>
            </div>
            {customerName && (
              <div className="tq-row">
                <span className="tq-label">Hành khách:</span>
                <strong className="tq-value">{customerName}</strong>
              </div>
            )}
            {tourTitle && (
              <div className="tq-row">
                <span className="tq-label">Chuyến đi:</span>
                <span className="tq-value tq-tour-name" title={tourTitle}>
                  {tourTitle}
                </span>
              </div>
            )}
            {startDate && (
              <div className="tq-row">
                <span className="tq-label">Khởi hành:</span>
                <strong className="tq-value">{startDate}</strong>
              </div>
            )}

            <div className="ticket-qr-actions">
              <button
                type="button"
                className="btn-action btn-outline btn-sm"
                onClick={() => setIsZoomed(true)}
              >
                <i className="fa-solid fa-expand"></i> Mở toàn màn hình
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PHÓNG TO TOÀN MÀN HÌNH */}
      {isZoomed && (
        <div className="ticket-qr-modal-overlay" onClick={() => setIsZoomed(false)}>
          <div
            className="ticket-qr-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ticket-qr-modal-close"
              onClick={() => setIsZoomed(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="tqm-header">
              <span className="tqm-brand">TRAVELGO E-TICKET</span>
              <h3 className="tqm-title">Mã QR Check-in Đi Tour</h3>
              <p className="tqm-desc">
                Đưa trực tiếp màn hình này cho Điều phối viên / Hướng dẫn viên
              </p>
            </div>

            <div className="tqm-qr-wrapper">
              <QRCodeSVG
                value={bookingCode}
                size={240}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="tqm-code-display">
              <span className="tqm-code-label">MÃ ĐƠN HÀNG:</span>
              <span className="tqm-code-val">{bookingCode}</span>
            </div>

            {customerName && (
              <p className="tqm-customer">
                Khách hàng: <strong>{customerName}</strong>
              </p>
            )}

            <button
              type="button"
              className="btn-action btn-fill tqm-btn-done"
              onClick={() => setIsZoomed(false)}
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}
    </>
  );
}
