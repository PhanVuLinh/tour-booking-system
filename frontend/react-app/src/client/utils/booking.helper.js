export const getPassengerTypeName = (type) => {
  switch (type) {
    case "adult":
      return "Người lớn";
    case "child":
      return "Trẻ em";
    case "baby":
      return "Em bé";
    default:
      return "Khách";
  }
};

export const getPaymentMethodName = (method) => {
  switch (method) {
    case "cash":
      return "Thanh toán tại quầy";
    case "bank":
      return "Chuyển khoản ngân hàng";
    case "vnpay":
      return "Thanh toán qua VNPAY";
    case "momo":
      return "Thanh toán qua Momo";
    default:
      return method || "Chưa xác định";
  }
};

export const getPaymentTypeName = (type) => {
  switch (String(type)) {
    case "50":
      return "Đặt cọc 50%";
    case "100":
      return "Thanh toán toàn bộ 100%";
    default:
      return "Thanh toán toàn bộ 100%";
  }
};
