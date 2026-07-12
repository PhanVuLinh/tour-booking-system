module.exports.validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || fullName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Họ và tên không được để trống",
    });
  }

  if (!email || email.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Email không được để trống",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Email không đúng định dạng",
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    });
  }

  next();
};

module.exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập email." });
  }
  if (!password || password.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập mật khẩu." });
  }
  next();
};
