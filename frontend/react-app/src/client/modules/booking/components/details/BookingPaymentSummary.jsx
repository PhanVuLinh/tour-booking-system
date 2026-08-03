import React from "react";
import { formatPrice } from "../../../../utils/format.helper";
import {
  getPaymentMethodName,
  getPaymentTypeName,
} from "../../../../utils/booking.helper";

export default function BookingPaymentSummary({ payment, pricing, status }) {
  const method = payment?.method;
  const type = payment?.type;
  const payableAmount = payment?.payable_amount || 0;

  return (
    <div className="bd-section">
      <h3 className="bd-section-title lookup-section-title">
        <i className="fa-solid fa-file-invoice-dollar lookup-section-icon"></i>
        Chi tiết thanh toán và chi phí
      </h3>

      <div className="bd-payment-summary">
        <div className="bd-ps-left">
          <p>
            <strong>Phương thức:</strong> {getPaymentMethodName(method)}
          </p>

          <p>
            <strong>Hình thức:</strong> {getPaymentTypeName(type)}
          </p>

          <p>
            <strong>Trạng thái:</strong>{" "}
            {status === "pending" ? (
              <span className="lookup-status-unpaid">Chưa thanh toán</span>
            ) : (
              <span className="lookup-status-paid">Đã thanh toán</span>
            )}
          </p>
        </div>

        <div className="bd-ps-right">
          <div className="bd-price-row">
            <span>Tạm tính:</span>
            <span>{formatPrice(pricing?.sub_total || 0)}</span>
          </div>

          {pricing?.discount > 0 && (
            <div className="bd-price-row discount">
              <span>Giảm giá:</span>
              <span>- {formatPrice(pricing.discount)}</span>
            </div>
          )}

          <div className="bd-price-row total">
            <span>Tổng tiền tour:</span>
            <span>{formatPrice(pricing?.total || 0)}</span>
          </div>

          <div className="bd-price-divider"></div>

          <div className="bd-price-row amount-paid">
            <span>
              Số tiền {type === "50" ? "cần cọc (50%)" : "cần thanh toán"}:
            </span>

            <strong className="lookup-amount-red">
              {formatPrice(payableAmount)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
