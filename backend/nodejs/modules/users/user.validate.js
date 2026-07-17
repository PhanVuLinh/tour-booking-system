module.exports.updateProfile = (req, res, next) => {
  const { fullName, phone } = req.body;

  if (!fullName || fullName.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Họ và tên không được để trống" });
  }

  if (phone && phone.trim() !== "") {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Số điện thoại không hợp lệ" });
    }
  }

  next();
};

module.exports.changePassword = (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || currentPassword.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập mật khẩu hiện tại" });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu mới phải có ít nhất 6 ký tự",
    });
  }

  if (newPassword === currentPassword) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu mới không được trùng mật khẩu hiện tại",
    });
  }

  if (!confirmPassword || confirmPassword !== newPassword) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu xác nhận không khớp",
    });
  }

  next();
};
