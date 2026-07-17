const userService = require("./user.service");

module.exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getProfile(userId);

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
    const userId = req.user.id;
    await userService.updateProfile(userId, req.body);

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
    const userId = req.user.id;
    const result = await userService.changePassword(userId, req.body);

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
