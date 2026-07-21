const couponService = require("./coupon.service");

module.exports.checkCoupon = async (req, res) => {
  try {
    const { code, subTotal } = req.body;
    const user_id = req.user ? req.user.id : null;

    const result = await couponService.checkCouponCode(code, subTotal, user_id);

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    console.error("Lỗi controller kiểm tra coupon:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server nội bộ",
    });
  }
};
