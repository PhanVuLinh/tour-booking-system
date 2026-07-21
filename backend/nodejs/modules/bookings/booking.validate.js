module.exports.validateCreateBooking = (req, res, next) => {
  const bookingData = req.body;

  if (!bookingData.departure_id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu departure_id",
    });
  }

  if (!bookingData.fullName || !bookingData.phone || !bookingData.email) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp đủ thông tin liên hệ (Tên, SĐT, Email)",
    });
  }

  const quantityAdult = Number(bookingData.quantityAdult || 0);
  const quantityChildren = Number(bookingData.quantityChildren || 0);
  const quantityBaby = Number(bookingData.quantityBaby || 0);

  if (
    !Number.isInteger(quantityAdult) ||
    !Number.isInteger(quantityChildren) ||
    !Number.isInteger(quantityBaby) ||
    quantityAdult < 0 ||
    quantityChildren < 0 ||
    quantityBaby < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Số lượng hành khách không hợp lệ",
    });
  }

  if (quantityAdult + quantityChildren + quantityBaby <= 0) {
    return res.status(400).json({
      success: false,
      message: "Tổng số hành khách phải lớn hơn 0",
    });
  }

  if (!["50", "100"].includes(String(bookingData.paymentType || "100"))) {
    return res.status(400).json({
      success: false,
      message: "Hình thức thanh toán không hợp lệ",
    });
  }

  const paymentMethod = String(
    bookingData.paymentMethod || "cod",
  ).toLowerCase();
  if (!["cod", "vnpay", "momo", "bank"].includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: "Phương thức thanh toán không hợp lệ",
    });
  }

  if (!Array.isArray(bookingData.passengers)) {
    return res.status(400).json({
      success: false,
      message: "Danh sách hành khách không hợp lệ",
    });
  }

  bookingData.quantityAdult = quantityAdult;
  bookingData.quantityChildren = quantityChildren;
  bookingData.quantityBaby = quantityBaby;
  bookingData.paymentType = String(bookingData.paymentType || "100");
  bookingData.paymentMethod = paymentMethod;

  next();
};
