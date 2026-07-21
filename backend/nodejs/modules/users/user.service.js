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
