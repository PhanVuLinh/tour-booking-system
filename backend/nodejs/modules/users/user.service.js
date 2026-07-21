const { pool } = require("../../config/database");
const bcrypt = require("bcryptjs");

module.exports.getProfile = async (userId) => {
  const sql = `select id, fullName, email, phone, auth_provider, createdAt from users where id = ?`;
  const [users] = await pool.query(sql, [userId]);

  if (users.length === 0) return null;
  return users[0];
};

module.exports.updateProfile = async (userId, data) => {
  try {
    const sql = `Update users set fullName = ? , phone = ? where id = ?`;

    await pool.query(sql, [data.fullName, data.phone || null, userId]);

    return {
      success: true,
      message: "Cập nhật tài khoản thành công",
    };
  } catch (error) {
    console.error("Lỗi:", error);
    throw new Error("Lỗi Server khi cập nhật user");
  }
};

module.exports.changePassword = async (userId, data) => {
  const [users] = await pool.query(
    "select id, password, auth_provider from users where id = ? limit 1",
    [userId],
  );

  if (users.length === 0) {
    return {
      success: false,
      statusCode: 404,
      message: "Người dùng không tồn tại",
    };
  }

  const user = users[0];

  if (user.auth_provider && user.auth_provider !== "local") {
    return {
      success: false,
      statusCode: 403,
      message: "Tài khoản đăng nhập bằng mạng xã hội không thể đổi mật khẩu",
    };
  }

  if (!user.password) {
    return {
      success: false,
      statusCode: 403,
      message: "Tài khoản này chưa có mật khẩu để thay đổi",
    };
  }

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) {
    return {
      success: false,
      statusCode: 400,
      message: "Mật khẩu hiện tại không đúng",
    };
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await pool.query("update users set password = ? where id = ?", [
    hashedPassword,
    userId,
  ]);

  return {
    success: true,
    message: "Đổi mật khẩu thành công",
  };
};

module.exports.getTourHistory = async (userId) => {
  try {
    const sql = `
      select 
        bookings.id,
        bookings.bookingCode,
        bookings.createdAt AS bookingDate,
        bookings.status,
        bookings.total AS totalAmount,
        (bookings.quantityAdult + bookings.quantityChildren + bookings.quantityBaby) AS totalPassengers,
        departures.startDate,
        tours.title AS tourTitle,
        tours.slug AS tourSlug,
        tours.thumbnail AS tourThumbnail
      from bookings
      join departures on bookings.departure_id = departures.id
      join tours on departures.tour_id = tours.id
      where bookings.user_id = ?
        and bookings.deleted = 0
      order by bookings.createdAt DESC`;
    const [rows] = await pool.query(sql, [userId]);

    return rows.map((row) => ({
      id: row.id,
      bookingCode: row.bookingCode,
      bookingDate: row.bookingDate,
      status: row.status,
      totalAmount: Number(row.totalAmount) || 0,
      totalPassengers: Number(row.totalPassengers) || 0,
      startDate: row.startDate,
      tour: {
        title: row.tourTitle,
        slug: row.tourSlug,
        thumbnail: row.tourThumbnail,
      },
    }));
  } catch (error) {
    console.error("Lỗi getTourHistory Service:", error);
    throw new Error("Lỗi truy vấn CSDL khi lấy lịch sử đặt tour");
  }
};

module.exports.getBookingDetail = async (userId, bookingId) => {
  try {
    const sqlBooking = `
    select 
        bookings.id,
        bookings.bookingCode,
        bookings.fullName AS contactName,
        bookings.phone AS contactPhone,
        bookings.email AS contactEmail,
        bookings.address AS contactAddress,
        bookings.subTotal,
        bookings.discount,
        bookings.total,
        bookings.note,
        bookings.status,
        bookings.createdAt,
        departures.startDate,
        tours.title AS tourTitle,
        tours.thumbnail AS tourThumbnail
    from bookings 
    join departures on bookings.departure_id  = departures.id
    join tours on departures.tour_id = tours.id
    where bookings.id = ? 
      and bookings.user_id = ? 
      and bookings.deleted = 0
  `;
    const [bookings] = await pool.query(sqlBooking, [bookingId, userId]);

    if (bookings.length === 0) return null;

    const booking = bookings[0];

    const sqlPassengers = `
    select id, fullName, dob, gender, identity_card, passengerType
    from passengers
    where booking_id = ?
  `;
    const [passengers] = await pool.query(sqlPassengers, [bookingId]);

    const sqlPayment = `
    select paymentMethod, paymentType, amount AS payableAmount, paymentStatus
    from payments
    where booking_id = ?
    order by id DESC LIMIT 1
  `;
    const [payments] = await pool.query(sqlPayment, [bookingId]);

    const payment = payments[0];

    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      tour: {
        title: booking.tourTitle,
        thumbnail: booking.tourThumbnail,
        startDate: booking.startDate,
      },
      contact: {
        fullName: booking.contactName,
        phone: booking.contactPhone,
        email: booking.contactEmail,
        address: booking.contactAddress,
      },

      passengers: passengers.map((item) => ({
        id: item.id,
        fullName: item.fullName,
        dob: item.dob,
        gender: item.gender,
        identity_card: item.identity_card,
        passengerType: item.passengerType,
      })),

      payment: {
        method: payment.paymentMethod,
        type: payment.paymentType,
        payableAmount: Number(payment.payableAmount),
        status: payment.paymentStatus,
      },

      pricing: {
        subTotal: Number(booking.subTotal),
        discount: Number(booking.discount),
        total: Number(booking.total),
      },
      note: booking.note,
      status: booking.status,
      createdAt: booking.createdAt,
    };
  } catch (error) {
    console.error("Lỗi getBookingDetail Service:", error);
    throw new Error("Lỗi CSDL khi truy vấn chi tiết đơn tour");
  }
};
