const paymentService = require("./payment.service");

module.exports.createPaymentUrl = async (req, res) => {
  try {
    const { bookingCode } = req.body;

    if (!bookingCode) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu mã bookingCode" });
    }

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "127.0.0.1";

    const vnpUrl = await paymentService.createPaymentUrlService(
      bookingCode,
      ipAddr,
    );

    // Trả URL về cho Frontend React thay vì redirect từ server Nodejs
    return res.status(200).json({
      success: true,
      data: {
        paymentUrl: vnpUrl,
      },
    });
  } catch (error) {
    console.log("Lỗi tạo link VNPay:", error);
    if (
      error.message === "Đơn hàng không tồn tại hoặc không dùng VNPay" ||
      error.message === "Đơn hàng đã thanh toán"
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi khởi tạo thanh toán VNPay!",
    });
  }
};

module.exports.vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const CLIENT_URL = process.env.URL_FE_1 || process.env.CLIENT_URL || "http://localhost:5173";

    const result = await paymentService.processVnpayReturnService(vnp_Params);

    if (result.success) {
      return res.redirect(`${CLIENT_URL}/booking/success/${result.bookingId}`);
    } else {
      if (result.error === "invalid_signature") {
        return res.redirect(
          `${CLIENT_URL}/booking/failed?error=invalid_signature`,
        );
      }
      return res.redirect(`${CLIENT_URL}/booking/failed`);
    }
  } catch (error) {
    console.log("Lỗi xử lý return VNPay:", error);
    const CLIENT_URL = process.env.URL_FE_1 || process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${CLIENT_URL}/booking/failed?error=system_error`);
  }
};
