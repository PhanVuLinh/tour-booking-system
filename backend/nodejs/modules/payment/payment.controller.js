const paymentService = require("./payment.service");

const getClientUrl = () =>
  process.env.URL_FE_1 || process.env.CLIENT_URL || "http://localhost:5173";

const getRequestIp = (req) => {
  const forwardedIp = req.headers["x-forwarded-for"];
  const ip =
    (Array.isArray(forwardedIp)
      ? forwardedIp[0]
      : forwardedIp?.split(",")[0]) ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  return ip.trim().replace(/^::ffff:/, "");
};

module.exports.createPaymentUrl = async (req, res) => {
  try {
    const { bookingCode } = req.body;

    if (!bookingCode) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu mã bookingCode" });
    }

    const ipAddr = getRequestIp(req);

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
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi khởi tạo thanh toán VNPay!",
    });
  }
};

module.exports.vnpayReturn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const clientUrl = getClientUrl();

    const result = await paymentService.processVnpayReturnService(vnpParams);

    if (result.success) {
      return res.redirect(
        `${clientUrl}/booking/success/${result.bookingId}?bookingCode=${encodeURIComponent(result.bookingCode)}`,
      );
    }

    const errorCode = result.error || "payment_failed";
    const message =
      result.message || "Không thể xác nhận kết quả thanh toán VNPay.";
    const query = new URLSearchParams({ error: errorCode, message });
    if (result.bookingCode) query.set("bookingCode", result.bookingCode);
    if (result.responseCode) query.set("responseCode", result.responseCode);

    return res.redirect(`${clientUrl}/booking/failed?${query.toString()}`);
  } catch (error) {
    console.log("Lỗi xử lý return VNPay:", error);
    const query = new URLSearchParams({
      error: "system_error",
      message:
        "Hệ thống gặp lỗi khi xác nhận kết quả. Vui lòng kiểm tra đơn trước khi thanh toán lại.",
    });
    return res.redirect(`${getClientUrl()}/booking/failed?${query.toString()}`);
  }
};

module.exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentStatusService(
      req.params.bookingCode,
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thanh toán VNPay" });
    }

    return res.json({ success: true, data: payment });
  } catch (error) {
    console.log("Lỗi lấy trạng thái VNPay:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể lấy trạng thái thanh toán",
    });
  }
};

module.exports.getBookingSuccessData = async (req, res) => {
  try {
    const booking = await paymentService.getBookingSuccessDataService(
      req.params.bookingId,
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn VNPay đã thanh toán",
      });
    }

    return res.json({ success: true, data: booking });
  } catch (error) {
    console.log("Lỗi lấy dữ liệu trang thành công VNPay:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tải thông tin đơn hàng",
    });
  }
};

module.exports.expireBookingForTest = async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.sendStatus(404);
  }

  try {
    const result = await paymentService.expireBookingForTestService(
      req.params.bookingCode,
    );
    return res.json({
      success: true,
      message: "Đã giả lập hết hạn và hoàn tài nguyên",
      data: result,
    });
  } catch (error) {
    console.log("Lỗi giả lập hết hạn booking:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Không thể giả lập hết hạn",
    });
  }
};
