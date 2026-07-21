module.exports.validateCheckCoupon = (req, res, next) => {
  const { code, subTotal } = req.body;
  const user_id = req.user ? req.user.id : null;

  if (!code || !String(code).trim()) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập mã giảm giá",
    });
  }

  const totalValue = Number(subTotal);

  if (!Number.isFinite(totalValue) || totalValue <= 0) {
    return res.status(400).json({
      success: false,
      message: "Tổng tiền đơn hàng không hợp lệ",
    });
  }

  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập để sử dụng mã giảm giá",
    });
  }

  req.body.code = String(code).trim().toUpperCase();
  req.body.subTotal = totalValue;

  next();
};
