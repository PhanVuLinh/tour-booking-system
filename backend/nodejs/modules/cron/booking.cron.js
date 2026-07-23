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
      `SELECT b.id, b.bookingCode, b.departure_id, b.coupon_id, b.user_id, 
              b.quantityAdult, b.quantityChildren, b.quantityBaby 
       FROM bookings b
       JOIN payments p ON p.booking_id = b.id
       WHERE b.status = 'pending' 
         AND p.paymentMethod IN ('vnpay', 'momo', 'bank')
         AND b.createdAt <= NOW() - INTERVAL 2 MINUTE`
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
          `UPDATE payments SET paymentStatus = 'failed' 
           WHERE booking_id = ? AND paymentStatus = 'pending'`,
          [booking.id]
        );

        // Cộng trả lại số vé vào kho departures
        await connection.query(
          `UPDATE departures
           SET stockAdult = stockAdult + ?,
               stockChildren = stockChildren + ?,
               stockBaby = stockBaby + ?
           WHERE id = ?`,
          [
            booking.quantityAdult,
            booking.quantityChildren,
            booking.quantityBaby,
            booking.departure_id,
          ]
        );

        // Trả lại coupon (nếu có áp dụng)
        if (booking.coupon_id) {
          await connection.query(
            `UPDATE coupons
             SET usedCount = GREATEST(usedCount - 1, 0)
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
        console.log(`[CRON] Đã huỷ thành công đơn hàng: ${booking.bookingCode} và trả lại vé.`);
      } catch (error) {
        await connection.rollback();
        console.error(`[CRON] Lỗi khi huỷ đơn hàng ${booking.bookingCode}:`, error);
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
