const { pool } = require("../../config/database");
const bcrypt = require("bcryptjs");

module.exports.getProfile = async (user_id) => {
  const sql = `select id, full_name, email, phone, auth_provider, created_at from users where id = ?`;
  const [users] = await pool.query(sql, [user_id]);

  if (users.length === 0) return null;
  return users[0];
};

module.exports.updateProfile = async (user_id, data) => {
  try {
    const sql = `Update users set full_name = ? , phone = ? where id = ?`;

    await pool.query(sql, [data.full_name, data.phone || null, user_id]);

    return {
      success: true,
      message: "Cập nhật tài khoản thành công",
    };
  } catch (error) {
    console.error("Lỗi:", error);
    throw new Error("Lỗi Server khi cập nhật user");
  }
};

module.exports.changePassword = async (user_id, data) => {
  const [users] = await pool.query(
    "select id, password, auth_provider from users where id = ? limit 1",
    [user_id],
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
    user_id,
  ]);

  return {
    success: true,
    message: "Đổi mật khẩu thành công",
  };
};

module.exports.getTourHistory = async (user_id) => {
  try {
    const sql = `
      select 
        bookings.id,
        bookings.booking_code,
        bookings.created_at AS bookingDate,
        bookings.status,
        bookings.total AS totalAmount,
        (bookings.quantity_adult + bookings.quantity_children + bookings.quantity_baby) AS totalPassengers,
        departures.start_date,
        tours.id AS tourId,
        tours.title AS tourTitle,
        tours.slug AS tourSlug,
        tours.thumbnail AS tourThumbnail,
        IF(reviews.id IS NOT NULL, 1, 0) AS isReviewed
      from bookings
      join departures on bookings.departure_id = departures.id
      join tours on departures.tour_id = tours.id
      left join reviews on reviews.booking_id = bookings.id and reviews.deleted = 0
      where bookings.user_id = ?
        and bookings.deleted = 0
      order by bookings.created_at DESC`;
    const [rows] = await pool.query(sql, [user_id]);

    return rows.map((row) => ({
      id: row.id,
      booking_code: row.booking_code,
      bookingDate: row.bookingDate,
      status: row.status,
      totalAmount: Number(row.totalAmount) || 0,
      totalPassengers: Number(row.totalPassengers) || 0,
      start_date: row.start_date,
      isReviewed: Boolean(row.isReviewed),
      tour: {
        id: row.tourId,
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

module.exports.getBookingDetail = async (user_id, bookingId) => {
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
        tours.title AS tourTitle,
        tours.thumbnail AS tourThumbnail
    from bookings 
    join departures on bookings.departure_id  = departures.id
    join tours on departures.tour_id = tours.id
    where bookings.id = ? 
      and bookings.user_id = ? 
      and bookings.deleted = 0
  `;
    const [bookings] = await pool.query(sqlBooking, [bookingId, user_id]);

    if (bookings.length === 0) return null;

    const booking = bookings[0];

    const sqlPassengers = `
    select id, full_name, dob, gender, identity_card, passenger_type
    from passengers
    where booking_id = ?
  `;
    const [passengers] = await pool.query(sqlPassengers, [bookingId]);

    const sqlPayment = `
    select payment_method, payment_type, amount AS payable_amount, payment_status
    from payments
    where booking_id = ?
    order by id DESC LIMIT 1
  `;
    const [payments] = await pool.query(sqlPayment, [bookingId]);

    const payment = payments[0];

    return {
      id: booking.id,
      booking_code: booking.booking_code,
      tour: {
        title: booking.tourTitle,
        thumbnail: booking.tourThumbnail,
        start_date: booking.start_date,
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
    console.error("Lỗi getBookingDetail Service:", error);
    throw new Error("Lỗi CSDL khi truy vấn chi tiết đơn tour");
  }
};
