const { pool } = require("../../config/database");

module.exports.createBooking = async (bookingData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const {
      user_id = null,
      fullName,
      phone,
      email,
      address = null, // Dữ liệu người đặt
      departure_id,
      coupon_id = null,
      quantityAdult = 0,
      quantityChildren = 0,
      quantityBaby = 0,
      adultPrice = 0,
      childrenPrice = 0,
      babyPrice = 0,
      subTotal = 0,
      discount = 0,
      total = 0,
      note = "",
      passengers = [],
      paymentMethod = "cod",
      paymentType = "100",
      payableAmount = 0,
    } = bookingData;
    // Tạo mã Booking (Ví dụ: BKG-1718001234)
    const bookingCode =
      "BKG-" +
      Date.now().toString().slice(-6) +
      Math.floor(Math.random() * 1000);

    // Insert vào bảng bookings
    const [bookingResult] = await connection.query(
      `INSERT INTO bookings 
      (bookingCode, user_id, fullName, phone, email, address, departure_id, coupon_id, quantityAdult, quantityChildren, quantityBaby, adultPrice, childrenPrice, babyPrice, subTotal, discount, total, note, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        bookingCode,
        user_id,
        fullName,
        phone,
        email,
        address,
        departure_id,
        coupon_id,
        quantityAdult,
        quantityChildren,
        quantityBaby,
        adultPrice,
        childrenPrice,
        babyPrice,
        subTotal,
        discount,
        total,
        note,
      ],
    );
    const booking_id = bookingResult.insertId;

    // Insert bảng passengers
    if (passengers && passengers.length > 0) {
      for (let pax of passengers) {
        await connection.query(
          `INSERT INTO passengers (booking_id, fullName, dob, gender, identity_card, phone, passengerType) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            booking_id,
            pax.fullName,
            pax.dob,
            pax.gender || null,
            pax.identity_card || "",
            pax.phone || null,
            pax.passengerType || "adult",
          ],
        );
      }
    }

    // Insert bảng payments
    await connection.query(
      `INSERT INTO payments (booking_id, paymentMethod, paymentType, amount, paymentStatus) 
       VALUES (?, ?, ?, ?, 'pending')`,
      [booking_id, paymentMethod, paymentType, payableAmount],
    );

    // Cập nhật số lượng chỗ trống trong departures
    await connection.query(
      `UPDATE departures 
       SET stockAdult = stockAdult - ?, stockChildren = stockChildren - ?, stockBaby = stockBaby - ? 
       WHERE id = ?`,
      [quantityAdult, quantityChildren, quantityBaby, departure_id],
    );

    // Cập nhật số lượt sử dụng mã giảm giá
    if (coupon_id) {
      const [couponResult] = await connection.query(
        `UPDATE coupons
         SET usedCount = usedCount + 1
         WHERE id = ? AND usedCount < quantity`,
        [coupon_id],
      );

      if (couponResult.affectedRows === 0) {
        throw new Error("Mã giảm giá đã hết lượt sử dụng");
      }
    }

    await connection.commit();
    return {
      success: true,
      message: "Đặt tour thành công",
      data: { booking_id, bookingCode },
    };
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi tạo booking:", error);
    return { success: false, message: "Lỗi hệ thống: " + error.message };
  } finally {
    connection.release();
  }
};
