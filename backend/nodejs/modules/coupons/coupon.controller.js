const couponService = require("./coupon.service");

module.exports.checkCoupon = async (req, res) => {
  const { code, subTotal } = req.body;
  if (!code || !subTotal) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp mã code và tổng tiền (subTotal)",
    });
  }

  const result = await couponService.checkCouponCode(code, Number(subTotal));
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
};
