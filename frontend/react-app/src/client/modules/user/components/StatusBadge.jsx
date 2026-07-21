import React from "react";

export default function StatusBadge({ status }) {
  switch (status) {
    case "pending":
      return (
        <span className="h-badge badge-warning">
          <i className="fa-solid fa-clock-rotate-left"></i> Chờ xác nhận
        </span>
      );
    case "paid":
      return (
        <span className="h-badge badge-info">
          <i className="fa-solid fa-money-bill-wave"></i> Đã thanh toán
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
