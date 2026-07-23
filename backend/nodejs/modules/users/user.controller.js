const userService = require("./user.service");

module.exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await userService.getProfile(user_id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Lỗi getProfile:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi Server",
    });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    await userService.updateProfile(user_id, req.body);

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công!",
    });
  } catch (error) {
    console.error("Lỗi updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi Server",
    });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await userService.changePassword(user_id, req.body);

    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Lỗi changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi Server",
    });
  }
};

module.exports.getTourHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    const tourHistory = await userService.getTourHistory(user_id);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách lịch sử đặt tour thành công",
      data: tourHistory,
    });
  } catch (error) {
    console.error("Lỗi getTourHistory Controller:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi Server khi lấy lịch sử đặt tour",
    });
  }
};

module.exports.getBookingDetail = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookingId = req.params.id;
    const detail = await userService.getBookingDetail(user_id, bookingId);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin đơn đặt tour",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết đơn đặt tour thành công",
      data: detail,
    });
  } catch (error) {
    console.error("Lỗi getBookingDetail Controller:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi Server khi lấy chi tiết đơn tour",
    });
  }
};
