const bookingService = require("./booking.service");

module.exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    const user_id = req.user ? req.user.id : null;
    bookingData.user_id = user_id;

    const result = await bookingService.createBooking(bookingData);

    if (result.success) {
      return res.status(201).json(result);
    }

    return res.status(result.statusCode || 400).json(result);
  } catch (error) {
    console.error("Lỗi controller tạo booking:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server nội bộ",
    });
  }
};

module.exports.lookupBooking = async (req, res) => {
  try {
    const code = req.params.code;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mã đơn hàng!",
      });
    }
    const booking = await bookingService.getBookingByCode(code);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin đơn đặt tour với mã đã nhập!",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Lỗi controller lookupBooking:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi Server khi tra cứu đơn tour",
    });
  }
};

module.exports.updateStatusByAdmin = async (req, res) => {
  try {
    const { bookingId, status, payment_status } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu bookingId",
      });
    }
    const result = await bookingService.updateBookingStatusByAdmin(
      bookingId,
      status,
      payment_status,
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi controller updateStatusByAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi Server khi cập nhật trạng thái đơn tour",
    });
  }
};
