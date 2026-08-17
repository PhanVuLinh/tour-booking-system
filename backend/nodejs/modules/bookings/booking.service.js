const { pool } = require("../../config/database");

const { sendBookingEmail } = require("./bookingEmail.template");

module.exports.createBooking = async (bookingData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let {
      user_id = null,
      full_name,
      phone,
      email,
      address = null,
      departure_id,
      coupon_id = null,
      quantity_adult = 0,
      quantity_children = 0,
      quantity_baby = 0,
      note = "",
      passengers = [],
      payment_method = "cash",
      payment_type = "100",
    } = bookingData;

    //Kiểm tra phương thức và hình thức thanh toán
    payment_method = String(payment_method).toLowerCase();
    if (!["cash", "vnpay", "momo", "bank"].includes(payment_method)) {
      const error = new Error("Phương thức thanh toán không hợp lệ");
      error.isBusinessError = true;
      throw error;
    }

    if (!["50", "100"].includes(payment_type)) {
      const error = new Error("Hình thức thanh toán không hợp lệ");
      error.isBusinessError = true;
      throw error;
    }

    if (payment_method === "cash" && payment_type === "50") {
      const error = new Error(
        "Phương thức thanh toán tại quầy chỉ áp dụng thanh toán toàn bộ 100%.",
      );
      error.isBusinessError = true;
      throw error;
    }

    //Kiểm tra đơn đặt tour trùng lặp (được gửi lại trong vòng 2 phút)
    const [existingBooking] = await connection.query(
      `SELECT id FROM bookings
       WHERE departure_id = ?
         AND phone = ?
         AND email = ?
         AND quantity_adult = ?
         AND quantity_children = ?
         AND quantity_baby = ?
         AND deleted = 0
         AND created_at >= NOW() - INTERVAL 2 MINUTE
       LIMIT 1`,
      [
        departure_id,
        phone,
        email,
        quantity_adult,
        quantity_children,
        quantity_baby,
      ],
    );

    if (existingBooking.length > 0) {
      const error = new Error(
        "Đơn đặt tour này đã được tạo trước đó. Vui lòng kiểm tra lại đơn hàng.",
      );
      error.isBusinessError = true;
      throw error;
    }

    //Lấy lịch khởi hành và khóa dòng dữ liệu
    const [departureRows] = await connection.query(
      `SELECT
        departures.id,
        departures.price_adult,
        departures.price_children,
        departures.price_baby,
        departures.discount_percentage,
        departures.stock_adult,
        departures.stock_children,
        departures.stock_baby,
        departures.status,
        departures.deleted,
        departures.start_date,
        tours.title as tour_title
      FROM departures
      LEFT JOIN tours ON departures.tour_id = tours.id
      WHERE departures.id = ?
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
    if (new Date() > new Date(departure.start_date)) {
      const error = new Error("Lịch khởi hành đã hết hạn đặt tour");
      error.isBusinessError = true;
      throw error;
    }

    // Bước 3: Kiểm tra số chỗ còn lại
    if (
      Number(departure.stock_adult) < quantity_adult ||
      Number(departure.stock_children) < quantity_children ||
      Number(departure.stock_baby) < quantity_baby
    ) {
      const error = new Error("Số chỗ còn lại không đủ");
      error.isBusinessError = true;
      throw error;
    }

    // Bước 4: Backend tự tính giá từ bảng departures
    const departureDiscount = Number(departure.discount_percentage || 0);
    const adult_price = Math.round(
      Number(departure.price_adult) * (1 - departureDiscount / 100),
    );
    const children_price = Math.round(
      Number(departure.price_children) * (1 - departureDiscount / 100),
    );
    const baby_price = Math.round(
      Number(departure.price_baby) * (1 - departureDiscount / 100),
    );

    const sub_total =
      quantity_adult * adult_price +
      quantity_children * children_price +
      quantity_baby * baby_price;

    //Kiểm tra coupon trong transaction
    let discount = 0;
    let validCouponId = null;

    if (coupon_id) {
      if (!user_id) {
        const error = new Error("Vui lòng đăng nhập để sử dụng mã giảm giá");
        error.isBusinessError = true;
        throw error;
      }

      const [couponRows] = await connection.query(
        `select *
         from coupons
         where id = ?
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
      const start_date = new Date(coupon.start_date);
      const end_date = new Date(coupon.end_date);

      if (coupon.status !== "active" || Number(coupon.deleted) !== 0) {
        const error = new Error("Mã giảm giá không còn hiệu lực");
        error.isBusinessError = true;
        throw error;
      }

      if (now < start_date) {
        const error = new Error("Mã giảm giá chưa đến thời gian sử dụng");
        error.isBusinessError = true;
        throw error;
      }

      if (now > end_date) {
        const error = new Error("Mã giảm giá đã hết hạn");
        error.isBusinessError = true;
        throw error;
      }

      if (Number(coupon.used_count) >= Number(coupon.quantity)) {
        const error = new Error("Mã giảm giá đã hết lượt sử dụng");
        error.isBusinessError = true;
        throw error;
      }

      const [usedCouponRows] = await connection.query(
        `select id
          from user_coupons
          where user_id = ?
            and coupon_id = ?
          LIMIT 1`,
        [user_id, coupon.id],
      );

      if (usedCouponRows.length > 0) {
        const error = new Error("Bạn đã sử dụng mã giảm giá này trước đó");
        error.isBusinessError = true;
        throw error;
      }

      discount = (sub_total * Number(coupon.discount_percentage || 0)) / 100;

      const max_discount_amount = Number(coupon.max_discount_amount || 0);

      if (max_discount_amount > 0 && discount > max_discount_amount) {
        discount = max_discount_amount;
      }

      discount = Math.round(discount);
      validCouponId = coupon.id;
    }

    // tính tổng tiền phải thanh toán
    const total = Math.max(sub_total - discount, 0);
    const payable_amount =
      payment_type === "50" ? Math.ceil(total * 0.5) : total;
    const remainingAmount = Math.max(total - payable_amount, 0);

    // Kiểm tra danh sách hành khách
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
      if (!pax.full_name || !pax.dob || !pax.passenger_type) {
        const error = new Error("Thông tin hành khách không khớp số lượng vé");
        error.isBusinessError = true;
        throw error;
      }

      if (!["adult", "child", "baby"].includes(pax.passenger_type)) {
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
      if (pax.passenger_type === "adult" && age < 12) {
        const error = new Error("Tuổi hành khách không khớp loại vé");
        error.isBusinessError = true;
        throw error;
      }

      if (pax.passenger_type === "child" && (age < 2 || age >= 12)) {
        const error = new Error("Tuổi hành khách không khớp loại vé");
        error.isBusinessError = true;
        throw error;
      }

      if (pax.passenger_type === "baby" && age >= 2) {
        const error = new Error("Tuổi hành khách không khớp loại vé");
        error.isBusinessError = true;
        throw error;
      }

      if (pax.passenger_type === "adult") adultPassengerCount++;
      if (pax.passenger_type === "child") childPassengerCount++;
      if (pax.passenger_type === "baby") babyPassengerCount++;
    }

    if (
      adultPassengerCount !== quantity_adult ||
      childPassengerCount !== quantity_children ||
      babyPassengerCount !== quantity_baby
    ) {
      const error = new Error("Thông tin hành khách không khớp số lượng vé");
      error.isBusinessError = true;
      throw error;
    }

    //Tạo mã booking
    const booking_code =
      "BKG-" +
      Date.now().toString().slice(-6) +
      Math.floor(Math.random() * 1000);

    //Insert bảng bookings bằng số tiền backend đã tính
    const [bookingResult] = await connection.query(
      `INSERT INTO bookings 
      (booking_code, user_id, full_name, phone, email, address, departure_id, coupon_id, quantity_adult, quantity_children, quantity_baby, adult_price, children_price, baby_price, sub_total, discount, total, note, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        booking_code,
        user_id,
        full_name,
        phone,
        email,
        address,
        departure_id,
        validCouponId,
        quantity_adult,
        quantity_children,
        quantity_baby,
        adult_price,
        children_price,
        baby_price,
        sub_total,
        discount,
        total,
        note,
      ],
    );
    const booking_id = bookingResult.insertId;

    //Insert bảng passengers
    if (passengers.length > 0) {
      for (let pax of passengers) {
        await connection.query(
          `INSERT INTO passengers (booking_id, full_name, dob, gender, identity_card, phone, passenger_type) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            booking_id,
            pax.full_name,
            pax.dob,
            pax.gender || null,
            pax.identity_card || "",
            pax.phone || null,
            pax.passenger_type,
          ],
        );
      }
    }

    //Insert bảng payments bằng payable_amount backend đã tính
    await connection.query(
      `INSERT INTO payments (booking_id, payment_method, payment_type, amount, payment_status) 
       VALUES (?, ?, ?, ?, 'pending')`,
      [booking_id, payment_method, payment_type, payable_amount],
    );

    //Trừ stock an toàn, không cho stock âm
    const [stockResult] = await connection.query(
      `UPDATE departures
       SET
        stock_adult = stock_adult - ?,
        stock_children = stock_children - ?,
        stock_baby = stock_baby - ?
       WHERE id = ?
        AND stock_adult >= ?
        AND stock_children >= ?
        AND stock_baby >= ?`,
      [
        quantity_adult,
        quantity_children,
        quantity_baby,
        departure_id,
        quantity_adult,
        quantity_children,
        quantity_baby,
      ],
    );

    if (stockResult.affectedRows === 0) {
      const error = new Error("Số chỗ còn lại không đủ");
      error.isBusinessError = true;
      throw error;
    }

    //Tăng lượt dùng coupon
    if (validCouponId) {
      const [couponResult] = await connection.query(
        `UPDATE coupons
         SET used_count = used_count + 1
         WHERE id = ?
          AND used_count < quantity`,
        [validCouponId],
      );

      if (couponResult.affectedRows === 0) {
        const error = new Error("Mã giảm giá đã hết lượt sử dụng");
        error.isBusinessError = true;
        throw error;
      }

      try {
        await connection.query(
          `INSERT INTO user_coupons ( user_id, coupon_id, used_at )
          VALUES (?, ?, CURRENT_TIMESTAMP)`,
          [user_id, validCouponId],
        );
      } catch (error) {
        // UNIQUE(user_id, coupon_id) bảo vệ trường hợp
        // hai request đồng thời sử dụng cùng một coupon
        if (error.code === "ER_DUP_ENTRY" || Number(error.errno) === 1062) {
          const duplicateError = new Error(
            "Bạn đã sử dụng mã giảm giá này trước đó",
          );
          duplicateError.isBusinessError = true;
          throw duplicateError;
        }

        throw error;
      }
    }

    await connection.commit();

    // Gửi email
    sendBookingEmail({
      email,
      full_name,
      booking_code,
      departure,
      quantity_adult,
      quantity_children,
      quantity_baby,
      sub_total,
      discount,
      total,
      payable_amount,
      remainingAmount,
      payment_method,
      payment_type,
      payment_status: "pending",
    });

    return {
      success: true,
      message: "Đặt tour thành công",
      data: {
        booking_id,
        booking_code,
        departure_id,
        quantity_adult,
        quantity_children,
        quantity_baby,
        adult_price,
        children_price,
        baby_price,
        sub_total,
        discount,
        total,
        payable_amount,
        remainingAmount,
        coupon_id: validCouponId,
        payment_method,
        payment_type,
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

module.exports.getBookingByCode = async (code) => {
  try {
    const sqlBooking = `
    select 
      bookings.id,
      bookings.booking_code,
      bookings.full_name AS contactName,
      bookings.phone AS contactPhone,
      bookings.email AS contactEmail,
      bookings.address AS contactAddress,
      bookings.sub_total,
      bookings.discount,
      bookings.total,
      bookings.note,
      bookings.status,
      bookings.created_at,
      departures.start_date,
      departures.departure_from,
      tours.title AS tourTitle,
      tours.thumbnail AS tourThumbnail
    from bookings 
      join departures on  bookings.departure_id = departures.id
      join tours on departures.tour_id = tours.id
    where bookings.booking_code = ? 
        and bookings.deleted = 0
  `;
    const [bookings] = await pool.query(sqlBooking, [code]);

    if (bookings.length === 0) return null;
    const booking = bookings[0];

    const sqlPassengers = `
    select id, full_name, dob, gender, identity_card, passenger_type 
    from passengers
    where booking_id = ?
  `;
    const [passengers] = await pool.query(sqlPassengers, [booking.id]);

    const sqlPayment = `
    select payment_method, payment_type, amount AS payable_amount, payment_status
    from payments
    where booking_id = ?
    order by id desc 
    limit 1
  `;

    const [payments] = await pool.query(sqlPayment, [booking.id]);
    const payment = payments[0];

    return {
      id: booking.id,
      booking_code: booking.booking_code,
      tour: {
        title: booking.tourTitle,
        thumbnail: booking.tourThumbnail,
        start_date: booking.start_date,
        departure_from: booking.departure_from,
      },
      contact: {
        full_name: booking.contactName,
        phone: booking.contactPhone,
        email: booking.contactEmail,
        address: booking.contactAddress,
      },
      passengers: passengers.map((item) => ({
        id: item.id,
        full_name: item.full_name,
        dob: item.dob,
        gender: item.gender,
        identity_card: item.identity_card,
        passenger_type: item.passenger_type,
      })),
      payment: {
        method: payment.payment_method,
        type: payment.payment_type,
        payable_amount: Number(payment.payable_amount),
        status: payment.payment_status,
      },
      pricing: {
        sub_total: Number(booking.sub_total),
        discount: Number(booking.discount),
        total: Number(booking.total),
      },
      note: booking.note,
      status: booking.status,
      created_at: booking.created_at,
    };
  } catch (error) {
    console.error("Lỗi getBookingByCode Service:", error);
    throw new Error("Lỗi CSDL khi tra cứu đơn tour");
  }
};

module.exports.updateBookingStatusByAdmin = async (
  bookingId,
  status,
  paymentStatus,
) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (status) {
      await connection.query(
        `update bookings 
         set status = ?
         where id = ?`,
        [status, bookingId],
      );
    }

    if (paymentStatus) {
      await connection.query(
        `update payments 
         set payment_status = ?
         where booking_id = ?`,
        [paymentStatus, bookingId],
      );
    }
    await connection.commit();

    // Lấy lại dữ liệu chi tiết của booking để gửi email
    const [bookingRows] = await pool.query(
      `select 
        bookings.id,
        bookings.booking_code,
        bookings.full_name,
        bookings.email,
        bookings.quantity_adult,
        bookings.quantity_children,
        bookings.quantity_baby,
        bookings.sub_total,
        bookings.discount,
        bookings.total,
        bookings.status AS booking_status,
        departures.start_date,
        tours.title AS tour_title,
        payments.payment_method,
        payments.payment_type,
        payments.amount AS payable_amount,
        payments.payment_status
       from bookings
       left join departures on bookings.departure_id = departures.id
       left join tours on departures.tour_id = tours.id
       left join payments on payments.booking_id = bookings.id
       where bookings.id = ? or bookings.booking_code = ?
       order by payments.id desc limit 1`,
      [bookingId, bookingId],
    );

    if (bookingRows.length > 0) {
      const booking = bookingRows[0];

      sendBookingEmail({
        email: booking.email,
        full_name: booking.full_name,
        booking_code: booking.booking_code,
        departure: {
          tour_title: booking.tour_title,
          start_date: booking.start_date,
        },
        quantity_adult: booking.quantity_adult,
        quantity_children: booking.quantity_children,
        quantity_baby: booking.quantity_baby,
        sub_total: booking.sub_total,
        discount: booking.discount,
        total: booking.total,
        payable_amount: booking.payable_amount,
        remainingAmount: Math.max(booking.total - booking.payable_amount, 0),
        payment_method: booking.payment_method,
        payment_type: booking.payment_type,
        booking_status: status || booking.booking_status,
        payment_status: paymentStatus || booking.payment_status,
      });
    }

    return {
      success: true,
      message: "Cập nhật trạng thái đơn tour thành công",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
