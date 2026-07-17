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
