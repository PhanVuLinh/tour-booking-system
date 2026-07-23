module.exports.validateCreateBooking = (req, res, next) => {
  const bookingData = req.body;

  if (!bookingData.departure_id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu departure_id",
    });
  }

  if (!bookingData.full_name || !bookingData.phone || !bookingData.email) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp đủ thông tin liên hệ (Tên, SĐT, Email)",
    });
  }

  const quantity_adult = Number(bookingData.quantity_adult || 0);
  const quantity_children = Number(bookingData.quantity_children || 0);
  const quantity_baby = Number(bookingData.quantity_baby || 0);

  if (
    !Number.isInteger(quantity_adult) ||
    !Number.isInteger(quantity_children) ||
    !Number.isInteger(quantity_baby) ||
    quantity_adult < 0 ||
    quantity_children < 0 ||
    quantity_baby < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Số lượng hành khách không hợp lệ",
    });
  }

  if (quantity_adult + quantity_children + quantity_baby <= 0) {
    return res.status(400).json({
      success: false,
      message: "Tổng số hành khách phải lớn hơn 0",
    });
  }

  if (!["50", "100"].includes(String(bookingData.payment_type || "100"))) {
    return res.status(400).json({
      success: false,
      message: "Hình thức thanh toán không hợp lệ",
    });
  }

  const payment_method = String(
    bookingData.payment_method || "cash",
  ).toLowerCase();

  if (!["cash", "vnpay", "momo", "bank"].includes(payment_method)) {
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

  bookingData.quantity_adult = quantity_adult;
  bookingData.quantity_children = quantity_children;
  bookingData.quantity_baby = quantity_baby;
  bookingData.payment_type = String(bookingData.payment_type || "100");
  bookingData.payment_method = payment_method;

  next();
};
