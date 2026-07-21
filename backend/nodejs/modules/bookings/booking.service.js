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
      address = null,
      departure_id,
      coupon_id = null,
      quantityAdult = 0,
      quantityChildren = 0,
      quantityBaby = 0,
      note = "",
      passengers = [],
      paymentMethod = "cod",
      paymentType = "100",
    } = bookingData;

    // Bước 1: Kiểm tra phương thức và hình thức thanh toán
    if (!["cod", "vnpay", "momo", "bank"].includes(paymentMethod)) {
      const error = new Error("Phương thức thanh toán không hợp lệ");
      error.isBusinessError = true;
      throw error;
    }

    if (!["50", "100"].includes(paymentType)) {
      const error = new Error("Hình thức thanh toán không hợp lệ");
      error.isBusinessError = true;
      throw error;
    }

    // Bước 1.5: Kiểm tra đơn đặt tour trùng lặp (được gửi lại trong vòng 2 phút)
    const [existingBooking] = await connection.query(
      `SELECT id FROM bookings
       WHERE departure_id = ?
         AND phone = ?
         AND email = ?
         AND quantityAdult = ?
         AND quantityChildren = ?
         AND quantityBaby = ?
         AND deleted = 0
         AND createdAt >= NOW() - INTERVAL 2 MINUTE
       LIMIT 1`,
      [
        departure_id,
        phone,
        email,
        quantityAdult,
        quantityChildren,
        quantityBaby,
      ],
    );

    if (existingBooking.length > 0) {
      const error = new Error(
        "Đơn đặt tour này đã được tạo trước đó. Vui lòng kiểm tra lại đơn hàng.",
      );
      error.isBusinessError = true;
      throw error;
    }

    // Bước 2: Lấy lịch khởi hành và khóa dòng dữ liệu
    const [departureRows] = await connection.query(
      `SELECT
        id,
        priceAdult,
        priceChildren,
        priceBaby,
        discountPercentage,
        stockAdult,
        stockChildren,
        stockBaby,
        status,
        deleted,
        startDate
      FROM departures
      WHERE id = ?
      FOR UPDATE`,
      [departure_id],
    );

    if (departureRows.length === 0) {
      const error = new Error("Lịch khởi hành không tồn tại");
      error.isBusinessError = true;
      throw error;
    }

    const departure = departureRows[0];

    // Kiểm tra trạng thái lịch khởi hành
    if (departure.status !== "active" || Number(departure.deleted) !== 0) {
      const error = new Error("Lịch khởi hành không còn hoạt động");
      error.isBusinessError = true;
      throw error;
    }

    // Kiểm tra lịch khởi hành đã hết hạn đặt
    if (new Date() > new Date(departure.startDate)) {
      const error = new Error("Lịch khởi hành đã hết hạn đặt tour");
      error.isBusinessError = true;
      throw error;
    }

    // Bước 3: Kiểm tra số chỗ còn lại
    if (
      Number(departure.stockAdult) < quantityAdult ||
      Number(departure.stockChildren) < quantityChildren ||
      Number(departure.stockBaby) < quantityBaby
    ) {
      const error = new Error("Số chỗ còn lại không đủ");
      error.isBusinessError = true;
      throw error;
    }

    // Bước 4: Backend tự tính giá từ bảng departures
    const departureDiscount = Number(departure.discountPercentage || 0);
    const adultPrice = Math.round(
      Number(departure.priceAdult) * (1 - departureDiscount / 100),
    );
    const childrenPrice = Math.round(
      Number(departure.priceChildren) * (1 - departureDiscount / 100),
    );
    const babyPrice = Math.round(
      Number(departure.priceBaby) * (1 - departureDiscount / 100),
    );

    const subTotal =
      quantityAdult * adultPrice +
      quantityChildren * childrenPrice +
      quantityBaby * babyPrice;

    // Bước 5: Kiểm tra coupon trong transaction
    let discount = 0;
    let validCouponId = coupon_id || null;

    if (coupon_id) {
      const [couponRows] = await connection.query(
        `SELECT *
         FROM coupons
         WHERE id = ?
         FOR UPDATE`,
        [coupon_id],
      );

      if (couponRows.length === 0) {
        const error = new Error("Mã giảm giá không tồn tại");
        error.isBusinessError = true;
        throw error;
      }

      const coupon = couponRows[0];
      const now = new Date();
      const startDate = new Date(coupon.startDate);
      const endDate = new Date(coupon.endDate);

      if (coupon.status !== "active" || Number(coupon.deleted) !== 0) {
        const error = new Error("Mã giảm giá không còn hiệu lực");
        error.isBusinessError = true;
        throw error;
      }

      if (now < startDate) {
        const error = new Error("Mã giảm giá chưa đến thời gian sử dụng");
        error.isBusinessError = true;
        throw error;
      }

      if (now > endDate) {
        const error = new Error("Mã giảm giá đã hết hạn");
        error.isBusinessError = true;
        throw error;
      }

      if (Number(coupon.usedCount) >= Number(coupon.quantity)) {
        const error = new Error("Mã giảm giá đã hết lượt sử dụng");
        error.isBusinessError = true;
        throw error;
      }

      discount = (subTotal * Number(coupon.discountPercentage || 0)) / 100;

      const maxDiscountAmount = Number(coupon.maxDiscountAmount || 0);
      if (maxDiscountAmount > 0 && discount > maxDiscountAmount) {
        discount = maxDiscountAmount;
      }

      discount = Math.round(discount);
      validCouponId = coupon.id;
    }

    // Bước 6: Backend tự tính tổng tiền phải thanh toán
    const total = Math.max(subTotal - discount, 0);
    const payableAmount = paymentType === "50" ? Math.ceil(total * 0.5) : total;
    const remainingAmount = Math.max(total - payableAmount, 0);

    // Bước 7: Kiểm tra danh sách hành khách
    if (!Array.isArray(passengers)) {
      const error = new Error("Thông tin hành khách không khớp số lượng vé");
      error.isBusinessError = true;
      throw error;
    }

    let adultPassengerCount = 0;
    let childPassengerCount = 0;
    let babyPassengerCount = 0;
    const today = new Date();

    for (let pax of passengers) {
      if (!pax.fullName || !pax.dob || !pax.passengerType) {
        const error = new Error("Thông tin hành khách không khớp số lượng vé");
        error.isBusinessError = true;
        throw error;
      }

      if (!["adult", "child", "baby"].includes(pax.passengerType)) {
        const error = new Error("Thông tin hành khách không khớp số lượng vé");
        error.isBusinessError = true;
        throw error;
      }

      // Kiểm tra ngày sinh hành khách
      const dobDate = new Date(pax.dob);
      if (isNaN(dobDate.getTime())) {
        const error = new Error("Ngày sinh hành khách không hợp lệ");
        error.isBusinessError = true;
        throw error;
      }

      // Tính tuổi hành khách
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }

      if (age < 0) {
        const error = new Error("Ngày sinh hành khách không hợp lệ");
        error.isBusinessError = true;
        throw error;
      }

      // Kiểm tra tuổi khớp với loại vé
      // Người lớn (adult): từ 12 tuổi trở lên
      // Trẻ em (child): từ 2 đến 11 tuổi
      // Em bé (baby): dưới 2 tuổi
      if (pax.passengerType === "adult" && age < 12) {
        const error = new Error("Tuổi hành khách không khớp loại vé");
        error.isBusinessError = true;
        throw error;
      }

      if (pax.passengerType === "child" && (age < 2 || age >= 12)) {
        const error = new Error("Tuổi hành khách không khớp loại vé");
        error.isBusinessError = true;
        throw error;
      }

      if (pax.passengerType === "baby" && age >= 2) {
        const error = new Error("Tuổi hành khách không khớp loại vé");
        error.isBusinessError = true;
        throw error;
      }

      if (pax.passengerType === "adult") adultPassengerCount++;
      if (pax.passengerType === "child") childPassengerCount++;
      if (pax.passengerType === "baby") babyPassengerCount++;
    }

    if (
      adultPassengerCount !== quantityAdult ||
      childPassengerCount !== quantityChildren ||
      babyPassengerCount !== quantityBaby
    ) {
      const error = new Error("Thông tin hành khách không khớp số lượng vé");
      error.isBusinessError = true;
      throw error;
    }

    // Bước 8: Tạo mã booking
    const bookingCode =
      "BKG-" +
      Date.now().toString().slice(-6) +
      Math.floor(Math.random() * 1000);

    // Bước 9: Insert bảng bookings bằng số tiền backend đã tính
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
        validCouponId,
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

    // Bước 10: Insert bảng passengers
    if (passengers.length > 0) {
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
            pax.passengerType,
          ],
        );
      }
    }

    // Bước 11: Insert bảng payments bằng payableAmount backend đã tính
    await connection.query(
      `INSERT INTO payments (booking_id, paymentMethod, paymentType, amount, paymentStatus) 
       VALUES (?, ?, ?, ?, 'pending')`,
      [booking_id, paymentMethod, paymentType, payableAmount],
    );

    // Bước 12: Trừ stock an toàn, không cho stock âm
    const [stockResult] = await connection.query(
      `UPDATE departures
       SET
        stockAdult = stockAdult - ?,
        stockChildren = stockChildren - ?,
        stockBaby = stockBaby - ?
       WHERE id = ?
        AND stockAdult >= ?
        AND stockChildren >= ?
        AND stockBaby >= ?`,
      [
        quantityAdult,
        quantityChildren,
        quantityBaby,
        departure_id,
        quantityAdult,
        quantityChildren,
        quantityBaby,
      ],
    );

    if (stockResult.affectedRows === 0) {
      const error = new Error("Số chỗ còn lại không đủ");
      error.isBusinessError = true;
      throw error;
    }

    // Bước 13: Tăng lượt dùng coupon
    if (validCouponId) {
      const [couponResult] = await connection.query(
        `UPDATE coupons
         SET usedCount = usedCount + 1
         WHERE id = ?
          AND usedCount < quantity`,
        [validCouponId],
      );

      if (couponResult.affectedRows === 0) {
        const error = new Error("Mã giảm giá đã hết lượt sử dụng");
        error.isBusinessError = true;
        throw error;
      }
    }

    await connection.commit();
    return {
      success: true,
      message: "Đặt tour thành công",
      data: {
        booking_id,
        bookingCode,
        departure_id,
        quantityAdult,
        quantityChildren,
        quantityBaby,
        adultPrice,
        childrenPrice,
        babyPrice,
        subTotal,
        discount,
        total,
        payableAmount,
        remainingAmount,
        coupon_id: validCouponId,
        paymentMethod,
        paymentType,
      },
    };
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi tạo booking:", error);

    if (error.isBusinessError) {
      return {
        success: false,
        statusCode: 400,
        message: error.message,
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: "Không thể tạo đơn đặt tour. Vui lòng thử lại.",
    };
  } finally {
    connection.release();
  }
};

