const { pool } = require("../../config/database");
const bcrypt = require("bcryptjs");

module.exports.register = async (userData) => {
  try {
    if (!userData.fullName || !userData.email || !userData.password) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      };
    }

    const [existingUsers] = await pool.query(
      "select * from users where email = ? Limit 1",
      [userData.email],
    );

    if (existingUsers.length > 0) {
      return {
        success: false,
        message: "Email này đã được sử dụng. Vui lòng chọn email khác.",
      };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [result] = await pool.query(
      "insert into users (fullName, email, password, status) values (?, ?, ?, 'active')",
      [userData.fullName, userData.email, hashedPassword],
    );

    return {
      success: true,
      message: "Đăng ký tài khoản thành công",
      data: {
        user: {
          fullName: userData.fullName,
          email: userData.email,
          status: "active",
        },
      },
    };
  } catch (error) {
    console.error("Lỗi ở auth.service.register:", error);
    throw new Error("Lỗi hệ thống khi đăng ký. Vui lòng thử lại sau.");
  }
};
