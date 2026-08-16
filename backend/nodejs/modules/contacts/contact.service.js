const { pool } = require("../../config/database");
const mailHelper = require("../../helpers/sendMail.helper");

module.exports.saveEmail = async (email) => {
  try {
    const checkSql = "SELECT id FROM contacts WHERE email = ?";
    const [existing] = await pool.query(checkSql, [email]);

    if (existing.length > 0) {
      return {
        success: false,
        message: "Email này đã được đăng ký trước đó!",
      };
    }

    const insertSql = "INSERT INTO contacts (email) VALUES (?)";
    await pool.query(insertSql, [email]);

    const feUrl = (process.env.URL_FE_1 || "https://tralvelgo.vercel.app").replace(/\/+$/, "");
    const subject = "Chào mừng bạn đến với hệ thống nhận tin của TravelGo!";
    const htmlContent = `
        <div style="background-color: #f8f8f8; padding: 40px 10px; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">
                
                <!-- Phần Header: Nền trắng + Viền tím + Logo nổi bật -->
                <div style="background-color: #ffffff; padding: 25px 20px; text-align: center; border-bottom: 3px solid #4502c7;">
                    <img src="https://res.cloudinary.com/dlxbhq8pw/image/upload/v1785948618/lgmhzfeeoal2bblfdp6s.png" alt="TravelGo Logo" style="height: 45px; object-fit: contain; max-width: 100%; display: inline-block; font-size: 24px; font-weight: bold;" />
                </div>

                <!-- Phần Nội dung (Body) -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #4502c7; font-size: 24px; margin-top: 0; margin-bottom: 20px; font-weight: 800;">Chào mừng bạn đến với TravelGo!</h2>
                    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 15px; color: #444;">Cảm ơn bạn đã đăng ký nhận bản tin từ hệ thống của chúng tôi.</p>
                    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #444;">Từ nay, bạn sẽ là một trong những người đầu tiên nhận được các thông tin hấp dẫn về:</p>
                    
                    <ul style="font-size: 15px; line-height: 1.7; color: #555; padding-left: 20px; margin-bottom: 35px;">
                        <li style="margin-bottom: 10px;">Các chương trình <strong>Flash Sale & Ưu đãi</strong> độc quyền.</li>
                        <li style="margin-bottom: 10px;">Cẩm nang du lịch & Lịch trình khám phá mới nhất.</li>
                        <li style="margin-bottom: 10px;">Những tour du lịch "hot" nhất trong và ngoài nước.</li>
                    </ul>
                    
                    <!-- Nút Kêu gọi hành động (CTA) -->
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${feUrl}" style="background-color: #ff3b2f; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 30px; font-size: 15px; font-weight: bold; display: inline-block;">Khám phá tour ngay</a>
                    </div>

                    <hr style="border: none; border-top: 1px dashed #eee; margin: 30px 0;" />

                    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 5px; color: #444;">Trân trọng,</p>
                    <p style="font-size: 16px; font-weight: 700; color: #4502c7; margin-top: 0;">Đội ngũ TravelGo</p>
                </div>

                <!-- Phần Footer -->
                <div style="background-color: #f2f3f5; padding: 20px; text-align: center; font-size: 13px; color: #777;">
                    <p style="margin: 0 0 10px 0;">2026 TravelGo. Tất cả các quyền được bảo lưu.</p>
                    <p style="margin: 0;">Email này được gửi tự động từ hệ thống, vui lòng không trả lời trực tiếp.</p>
                </div>
            </div>
        </div>
    `;

    mailHelper.sendMail(email, subject, htmlContent);

    return { success: true };
  } catch (error) {
    console.error("Lỗi Service (Contacts):", error);
    return { success: false, message: "Lỗi cơ sở dữ liệu!" };
  }
};
