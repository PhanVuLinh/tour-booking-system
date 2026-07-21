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

