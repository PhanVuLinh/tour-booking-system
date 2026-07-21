const { pool } = require("../../config/database");

module.exports.checkCouponCode = async (code, subTotal, user_id) => {
  try {
    const sql = `SELECT * FROM coupons 
                  WHERE code = ? 
                  AND status = 'active' 
                  AND deleted = 0`;
    const [rows] = await pool.query(sql, [code]);

    if (rows.length === 0) {
      return {
        success: false,
        message: "Mã giảm giá không tồn tại hoặc không còn hiệu lực!",
      };
    }

    const coupon = rows[0];
    const now = new Date();

    if (now < new Date(coupon.startDate)) {
      return {
        success: false,
        message: "Mã giảm giá chưa đến thời gian áp dụng!",
      };
    }

    if (now > new Date(coupon.endDate)) {
      return {
        success: false,
        message: "Mã giảm giá đã hết hạn!",
      };
    }

    if (Number(coupon.usedCount) >= Number(coupon.quantity)) {
      return {
        success: false,
        message: "Mã giảm giá đã hết lượt sử dụng!",
      };
    }

    const [usedCouponRows] = await pool.query(
      `select id 
        from user_coupons
        where user_id = ? 
          and coupon_id = ?
        LIMIT 1`,
      [user_id, coupon.id],
    );

    if (usedCouponRows.length > 0) {
      return {
        success: false,
        message: "Bạn đã sử dụng mã giảm giá này trước đó!",
      };
    }

    //Tính số tiền được giảm
    let discount = Number(subTotal * coupon.discountPercentage) / 100;

    // Nếu vượt quá mức giảm tối đa thì chỉ lấy mức tối đa
    if (
      coupon.maxDiscountAmount &&
      discount > Number(coupon.maxDiscountAmount)
    ) {
      discount = Number(coupon.maxDiscountAmount);
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
      message: "Không thể kiểm tra mã giảm giá. Vui lòng thử lại!",
    };
  }
};
