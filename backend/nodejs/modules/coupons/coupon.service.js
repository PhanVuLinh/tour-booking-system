const { pool } = require("../../config/database");

module.exports.checkCouponCode = async (code, subTotal) => {
  try {
    const sql = `SELECT * FROM coupons 
                  WHERE code = ? 
                  AND status = 'active' 
                  AND deleted = 0`;
    const [rows] = await pool.query(sql, [code]);

    if (rows.length === 0) {
      return {
        success: false,
        message: "Mã giảm giá không tồn tại hoặc đã hết hạn!",
      };
    }

    const coupon = rows[0];
    const now = new Date();

    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return {
        success: false,
        message: "Mã giảm giá không nằm trong thời gian áp dụng!",
      };
    }

    if (coupon.usedCount >= coupon.quantity) {
      return {
        success: false,
        message: "Mã giảm giá đã hết lượt sử dụng!",
      };
    }

    //Tính số tiền được giảm
    let discount = (subTotal * coupon.discountPercentage) / 100;

    // Nếu vượt quá mức giảm tối đa thì chỉ lấy mức tối đa
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
    return {
      success: true,
      message: "Áp dụng mã giảm giá thành công!",
      data: {
        coupon_id: coupon.id,
        code: coupon.code,
        discount: Math.round(discount),
      },
    };
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã giảm giá:", error);
    return {
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    };
  }
};
