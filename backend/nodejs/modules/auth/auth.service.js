const { pool } = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

module.exports.login = async (loginData) => {
  try {
    const [users] = await pool.query(
      `
        select id, fullName, email, password, status, deleted from users 
        where email = ?`,
      [loginData.email],
    );

    if (users.length === 0) {
      return {
        success: false,
        message: "Tài khoản không tồn tại.",
      };
    }

    const user = users[0];

    const checkPassword = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!checkPassword) {
      return {
        success: false,
        message: "Mật khẩu không chính xác.",
      };
    }

    if (user.status !== "active") {
      return {
        success: false,
        message:
          "Tài khoản của bạn hiện không hoạt động. Vui lòng liên hệ quản trị viên.",
      };
    }

    if (user.deleted == 1) {
      return {
        success: false,
        message: "Tài khoản của bạn đã bị xóa. Vui lòng liên hệ quản trị viên.",
      };
    }

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return {
      success: true,
      message: "Đăng nhập thành công.",
      data: {
        token: token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          status: user.status,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi ở auth.service.login:", error);
    throw new Error("Lỗi hệ thống khi đăng nhập. Vui lòng thử lại sau.");
  }
};
