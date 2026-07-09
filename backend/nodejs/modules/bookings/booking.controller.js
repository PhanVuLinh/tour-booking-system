const bookingService = require("./booking.service");

module.exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    if (!bookingData.departure_id)
      return res.status(400).json({
        success: false,
        message: "Thiếu departure_id",
      });

    if (!bookingData.fullName || !bookingData.phone || !bookingData.email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đủ thông tin liên hệ (Tên, SĐT, Email)",
      });
    }
    if (!bookingData.total)
      return res.status(400).json({
        success: false,
        message: "Thiếu total",
      });

    const result = await bookingService.createBooking(bookingData);

    if (result.success) return res.status(201).json(result);
    return res.status(400).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server nội bộ" });
  }
};
