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
