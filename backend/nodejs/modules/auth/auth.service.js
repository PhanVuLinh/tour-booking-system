const { pool } = require("../../config/database");
const { OAuth2Client } = require("google-auth-library");
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
        select id, fullName, email, password, auth_provider, status, deleted from users 
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

    if (user.deleted === 1) {
      return {
        success: false,
        message: "Tài khoản của bạn đã bị xóa. Vui lòng liên hệ quản trị viên.",
      };
    }

    if (user.status !== "active") {
      return {
        success: false,
        message:
          "Tài khoản của bạn hiện không hoạt động. Vui lòng liên hệ quản trị viên.",
      };
    }

    if (!user.password) {
      return {
        success: false,
        message:
          "Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google.",
      };
    }

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
          auth_provider: user.auth_provider || null,
          status: user.status,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi ở auth.service.login:", error);
    throw new Error("Lỗi hệ thống khi đăng nhập. Vui lòng thử lại sau.");
  }
};

module.exports.loginGoogle = async (idToken) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const jwtSecret = process.env.JWT_SECRET;

  const googleClient = new OAuth2Client(googleClientId);
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const fullName = payload.name;

    if (!email) {
      return {
        success: false,
        message: "Không lấy được email từ Google.",
      };
    }

    const [users] = await pool.query(
      "SELECT id, fullName, email, auth_provider, status, deleted FROM users WHERE email = ?",
      [email],
    );

    let user = users[0];
    if (!user) {
      const [result] = await pool.query(
        "INSERT INTO users (fullName, email, password, auth_provider, status, deleted) VALUES (?, ?, NULL, 'google', 'active', 0)",
        [fullName, email],
      );
      user = {
        id: result.insertId,
        fullName: fullName,
        email: email,
        auth_provider: "google",
        status: "active",
        deleted: 0,
      };
    } else {
      if (user.deleted === 1) {
        return {
          success: false,
          message: "Tài khoản đã bị xóa.",
        };
      }

      if (user.status !== "active") {
        return {
          success: false,
          message: "Tài khoản bị khóa.",
        };
      }
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
    return {
      success: true,
      message: "Đăng nhập Google thành công.",
      data: {
        token: jwtToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          auth_provider: user.auth_provider || "google",
          status: user.status,
          deleted: user.deleted,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi xác thực Google:", error.message);
    return {
      success: false,
      message: "Xác thực Google thất bại.",
    };
  }
};

module.exports.loginFacebook = async (accessToken) => {
  try {
    const fbResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
    );

    const data = await fbResponse.json();
    if (data.error) {
      return {
        success: false,
        message: "Xác thực Facebook không hợp lệ.",
      };
    }

    const email = data.email || `${data.id}@facebook.com`;
    const name = data.name;

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    let user = users[0];

    if (!user) {
      const [result] = await pool.query(
        "INSERT INTO users (fullName, email, password, auth_provider, status) VALUES (?, ?, NULL, 'facebook', 'active')",
        [name, email],
      );
      user = {
        id: result.insertId,
        fullName: name,
        email: email,
        auth_provider: "facebook",
        status: "active",
      };
    } else {
      if (user.status !== "active")
        return { success: false, message: "Tài khoản bị khóa" };
      if (user.deleted === 1)
        return { success: false, message: "Tài khoản đã bị xóa" };
    }

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, fullName: user.fullName, email: user.email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    return {
      success: true,
      message: "Đăng nhập Facebook thành công.",
      data: {
        token: token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          auth_provider: user.auth_provider || "facebook",
          status: user.status,
          deleted: user.deleted,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi Facebook Auth:", error.message);
    throw new Error("Xác thực Facebook thất bại.");
  }
};
