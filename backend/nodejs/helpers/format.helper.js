const moment = require("moment");

module.exports.formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("vi-VN") + " VNĐ";
};

module.exports.formatDate = (dateString, pattern = "DD/MM/YYYY") => {
  if (!dateString) return "";
  return moment(dateString).format(pattern);
};

module.exports.formatPaymentMethod = (method) => {
  const map = {
    cash: "Thanh toán tiền mặt",
    vnpay: "Thanh toán qua VNPAY",
    momo: "Thanh toán qua Momo",
    bank: "Thanh toán qua ngân hàng",
  };
  return map[method];
};

module.exports.formatPaymentType = (type) => {
  return type === "50" ? "Đặt cọc 50%" : "Thanh toán 100%";
};
