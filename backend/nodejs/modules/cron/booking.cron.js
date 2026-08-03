const cron = require("node-cron");
const { pool } = require("../../config/database");

/**
 * Job chạy ngầm: Tự động huỷ các đơn đặt tour không thanh toán sau 2 phút.
 * Chỉ áp dụng cho vnpay, momo, bank (Không áp dụng cho cash - thanh toán tiền mặt).
 */
const autoCancelExpiredBookings = async () => {
  const connection = await pool.getConnection();

  try {
    // 1. Tìm các booking đang pending quá 2 phút (vnpay, momo, bank)
    const [expiredBookings] = await connection.query(
      `SELECT b.id, b.booking_code, b.departure_id, b.coupon_id, b.user_id, 
              b.quantity_adult, b.quantity_children, b.quantity_baby 
       FROM bookings b
       JOIN payments p ON p.booking_id = b.id
       WHERE b.status = 'pending' 
         AND p.payment_method IN ('vnpay', 'momo', 'bank')
         AND b.created_at <= NOW() - INTERVAL 2 MINUTE`
    );

    if (expiredBookings.length === 0) {
      // Không có đơn rác nào cần dọn
      return;
    }

    console.log(`\n[CRON] Phát hiện ${expiredBookings.length} đơn hàng quá hạn 2 phút. Đang tiến hành dọn dẹp...`);

    // 2. Xử lý từng đơn bị huỷ (Bọc trong Transaction để tránh lỗi nửa chừng)
    for (const booking of expiredBookings) {
      await connection.beginTransaction();

      try {
        // Cập nhật bookings -> cancelled
        await connection.query(
          `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
          [booking.id]
        );

        // Cập nhật payments -> failed
        await connection.query(
          `UPDATE payments SET payment_status = 'failed' 
           WHERE booking_id = ? AND payment_status = 'pending'`,
          [booking.id]
        );

        // Cộng trả lại số vé vào kho departures
        await connection.query(
          `UPDATE departures
           SET stock_adult = stock_adult + ?,
               stock_children = stock_children + ?,
               stock_baby = stock_baby + ?
           WHERE id = ?`,
          [
            booking.quantity_adult,
            booking.quantity_children,
            booking.quantity_baby,
            booking.departure_id,
          ]
        );

        // Trả lại coupon (nếu có áp dụng)
        if (booking.coupon_id) {
          await connection.query(
            `UPDATE coupons
             SET used_count = GREATEST(used_count - 1, 0)
             WHERE id = ?`,
            [booking.coupon_id]
          );

          if (booking.user_id) {
            await connection.query(
              `DELETE FROM user_coupons WHERE user_id = ? AND coupon_id = ?`,
              [booking.user_id, booking.coupon_id]
            );
          }
        }

        await connection.commit();
        console.log(`[CRON] Đã huỷ thành công đơn hàng: ${booking.booking_code} và trả lại vé.`);
      } catch (error) {
        await connection.rollback();
        console.error(`[CRON] Lỗi khi huỷ đơn hàng ${booking.booking_code}:`, error);
      }
    }
  } catch (error) {
    console.error("[CRON] Lỗi truy vấn Database khi dọn dẹp đơn hàng:", error);
  } finally {
    connection.release();
  }
};

// Khởi tạo Cron Job chạy mỗi phút 1 lần
const initCronJobs = () => {
  cron.schedule("* * * * *", () => {
    autoCancelExpiredBookings();
  });
  console.log("⌚ Cron Job: Hệ thống tự động dọn dẹp đơn hàng quá hạn đã được kích hoạt!");
};

module.exports = {
  initCronJobs,
};
