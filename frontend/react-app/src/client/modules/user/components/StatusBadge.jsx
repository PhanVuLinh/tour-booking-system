import React from "react";

export function BookingStatusBadge({ status }) {
  switch (status) {
    case "pending":
      return (
        <span className="h-badge badge-warning">
          <i className="fa-solid fa-clock-rotate-left"></i> Chờ xác nhận
        </span>
      );
    case "confirmed":
      return (
        <span className="h-badge badge-info">
          <i className="fa-solid fa-check"></i> Đã xác nhận
        </span>
      );
    case "ongoing":
      return (
        <span className="h-badge badge-primary">
          <i className="fa-solid fa-bus"></i> Đang diễn ra
        </span>
      );
    case "completed":
      return (
        <span className="h-badge badge-success">
          <i className="fa-solid fa-check-circle"></i> Đã hoàn thành
        </span>
      );
    case "cancelled":
      return (
        <span className="h-badge badge-danger">
          <i className="fa-solid fa-times-circle"></i> Đã hủy
        </span>
      );
    default:
      return <span className="h-badge badge-secondary">Không xác định</span>;
  }
}

export function PaymentStatusBadge({ status }) {
  switch (status) {
    case "pending":
      return (
        <span className="h-badge badge-warning">
          <i className="fa-solid fa-clock-rotate-left"></i> Chờ thanh toán
        </span>
      );
    case "paid":
      return (
        <span className="h-badge badge-success">
          <i className="fa-solid fa-money-bill-wave"></i> Đã thanh toán
        </span>
      );
    case "failed":
      return (
        <span className="h-badge badge-danger">
          <i className="fa-solid fa-triangle-exclamation"></i> Thất bại
        </span>
      );
    case "refunded":
      return (
        <span className="h-badge badge-info">
          <i className="fa-solid fa-rotate-left"></i> Đã hoàn tiền
        </span>
      );
    default:
      return <span className="h-badge badge-secondary">Không xác định</span>;
  }
}
