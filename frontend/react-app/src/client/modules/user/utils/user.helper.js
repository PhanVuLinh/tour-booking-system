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
    case "cod":
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
