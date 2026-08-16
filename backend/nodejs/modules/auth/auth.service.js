const { pool } = require("../../config/database");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mailHelper = require("../../helpers/sendMail.helper");

module.exports.register = async (userData) => {
  try {
    if (!userData.full_name || !userData.email || !userData.password) {
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
      "insert into users (full_name, email, password, status) values (?, ?, ?, 'active')",
      [userData.full_name, userData.email, hashedPassword],
    );

    const feUrl = (process.env.URL_FE_1 || "https://tralvelgo.vercel.app").replace(/\/+$/, "");
    const subject = "Đăng ký tài khoản TravelGo thành công!";
    const htmlContent = `
        <div style="background-color: #f8f8f8; padding: 40px 10px; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">
                
                <!-- Phần Header: Nền trắng + Viền tím + Logo nổi bật -->
                <div style="background-color: #ffffff; padding: 25px 20px; text-align: center; border-bottom: 3px solid #4502c7;">
                    <img src="https://res.cloudinary.com/dlxbhq8pw/image/upload/v1785948618/lgmhzfeeoal2bblfdp6s.png" alt="TravelGo Logo" style="height: 45px; object-fit: contain; max-width: 100%; display: inline-block; font-size: 24px; font-weight: bold;" />
                </div>

                <!-- Phần Nội dung (Body) -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #4502c7; font-size: 24px; margin-top: 0; margin-bottom: 20px; font-weight: 800;">
                        Chào mừng bạn gia nhập!
                    </h2>
                    
                    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 15px; color: #444;">
                        Chào <strong>${userData.full_name}</strong>,
                    </p>
                    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #444;">
                        Chúc mừng bạn đã tạo tài khoản thành công tại <strong>TravelGo</strong>! Từ bây giờ, bạn đã có thể dễ dàng tìm kiếm, đặt chỗ và quản lý các chuyến đi tuyệt vời của mình trên hệ thống.
                    </p>
                    
                    <div style="background-color: rgba(69, 2, 199, 0.05); border-left: 4px solid #4502c7; padding: 15px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Thông tin tài khoản của bạn:</p>
                        <p style="margin: 0; font-size: 15px; color: #333;"><strong>Email đăng nhập:</strong> ${userData.email}</p>
                    </div>
                    
                    <!-- Nút Kêu gọi hành động (CTA) -->
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${feUrl}/login" style="background-color: #ff3b2f; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 30px; font-size: 15px; font-weight: bold; display: inline-block;">
                            Đăng nhập & Bắt đầu khám phá
                        </a>
                    </div>

                    <hr style="border: none; border-top: 1px dashed #eee; margin: 30px 0;" />

                    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 5px; color: #444;">Nếu bạn cần bất kỳ sự trợ giúp nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                    <p style="font-size: 16px; font-weight: 700; color: #4502c7; margin-top: 5px;">Trân trọng, Đội ngũ TravelGo</p>
                </div>

                <!-- Phần Footer -->
                <div style="background-color: #f2f3f5; padding: 20px; text-align: center; font-size: 13px; color: #777;">
                    <p style="margin: 0 0 10px 0;">2026 TravelGo. Tất cả các quyền được bảo lưu.</p>
                    <p style="margin: 0;">Email này được gửi tự động từ hệ thống, vui lòng không trả lời trực tiếp.</p>
                </div>
            </div>
        </div>
    `;
    mailHelper.sendMail(userData.email, subject, htmlContent);

    return {
      success: true,
      message: "Đăng ký tài khoản thành công",
      data: {
        user: {
          full_name: userData.full_name,
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
        select id, full_name, email, password, auth_provider, status, deleted from users 
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
        full_name: user.full_name,
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
          full_name: user.full_name,
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
    const full_name = payload.name;

    if (!email) {
      return {
        success: false,
        message: "Không lấy được email từ Google.",
      };
    }

    const [users] = await pool.query(
      "SELECT id, full_name, email, auth_provider, status, deleted FROM users WHERE email = ?",
      [email],
    );

    let user = users[0];
    if (!user) {
      const [result] = await pool.query(
        "INSERT INTO users (full_name, email, password, auth_provider, status, deleted) VALUES (?, ?, NULL, 'google', 'active', 0)",
        [full_name, email],
      );
      user = {
        id: result.insertId,
        full_name: full_name,
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
        full_name: user.full_name,
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
          full_name: user.full_name,
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
        "INSERT INTO users (full_name, email, password, auth_provider, status) VALUES (?, ?, NULL, 'facebook', 'active')",
        [name, email],
      );
      user = {
        id: result.insertId,
        full_name: name,
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
      { id: user.id, full_name: user.full_name, email: user.email },
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
          full_name: user.full_name,
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
