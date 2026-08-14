const mailHelper = require("../../helpers/sendMail.helper");
const formatHelper = require("../../helpers/format.helper");

module.exports.sendBookingEmail = async ({
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
  booking_status = "pending", // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status = "pending", // 'pending' | 'paid' | 'failed'
  transaction_id,
}) => {
  const isPaidSuccess = payment_status === "paid";
  const methodText =
    formatHelper.formatPaymentMethod(payment_method) ||
    "Tiền mặt / Chuyển khoản";

  let subject = "";
  let headerTitle = "";
  let welcomeMessage = "";
  let statusBannerHtml = "";

  // Thứ tự kiểm tra chính xác tuyệt đối:
  if (booking_status === "cancelled") {
    // 1. Hủy đơn (Ưu tiên cao nhất)
    subject = `[TravelGo] Thông báo HỦY đơn tour #${booking_code}`;
    headerTitle = "Thông báo hủy đơn tour";
    welcomeMessage = `Chào ${full_name}, đơn đặt tour của bạn đã bị HỦY.`;
    statusBannerHtml = `
      <div style="background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 12px 18px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #d32f2f; font-weight: bold;">
              Đơn đặt tour của bạn đã bị HỦY trên hệ thống. Nếu có thắc mắc, vui lòng liên hệ hotline hỗ trợ.
          </p>
      </div>
    `;
  } else if (booking_status === "completed") {
    // 2. Hoàn thành chuyến đi
    subject = `[TravelGo] Cảm ơn bạn đã hoàn thành chuyến đi #${booking_code}`;
    headerTitle = "Hoàn thành chuyến đi";
    welcomeMessage = `Cảm ơn ${full_name} đã đồng hành cùng TravelGo!`;
    statusBannerHtml = `
      <div style="background-color: #e3f2fd; border-left: 4px solid #1976d2; padding: 12px 18px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #1976d2; font-weight: bold;">
              Chuyến đi của bạn đã hoàn tất thành công. Hẹn gặp lại bạn trong những hành trình tiếp theo!
          </p>
      </div>
    `;
  } else if (isPaidSuccess) {
    // 3. Đã Thanh toán thành công (Xác nhận trả tiền - Đặt lên trên confirmed)
    subject = `[TravelGo] Thanh toán thành công đơn tour #${booking_code}`;
    headerTitle = "Biên nhận thanh toán thành công";
    welcomeMessage = `Cảm ơn ${full_name}! Chúng tôi đã nhận được thanh toán cho đơn hàng của bạn.`;
    statusBannerHtml = `
      <div style="background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 12px 18px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #2e7d32; font-weight: bold;">
              Trạng thái thanh toán: ĐÃ THANH TOÁN THÀNH CÔNG (${methodText}${transaction_id ? ` - Mã GD: ${transaction_id}` : ""})
          </p>
      </div>
    `;
  } else if (booking_status === "confirmed") {
    // 4. Xác nhận đơn tour (Khi chưa thanh toán)
    subject = `[TravelGo] Đơn tour #${booking_code} đã được XÁC NHẬN`;
    headerTitle = "Xác nhận đơn tour thành công";
    welcomeMessage = `Chúc mừng ${full_name}! Đơn đặt tour của bạn đã được XÁC NHẬN`;
    statusBannerHtml = `
      <div style="background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 12px 18px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #2e7d32; font-weight: bold;">
              Đơn tour đã được duyệt và xác nhận chính thức. Quý khách vui lòng chuẩn bị tư trang cho chuyến đi!
          </p>
      </div>
    `;
  } else {
    // 5. Mới khởi tạo đơn (Pending)
    subject = `[TravelGo] Xác nhận khởi tạo đơn tour #${booking_code}`;
    headerTitle = "Xác nhận khởi tạo đơn tour";
    welcomeMessage = `Cảm ơn ${full_name} đã lựa chọn TravelGo!`;
  }

  const htmlContent = `
    <div style="background-color: #f8f8f8; padding: 40px 10px; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="background-color: #4502c7; padding: 30px 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dlxbhq8pw/image/upload/v1785948618/lgmhzfeeoal2bblfdp6s.png" alt="TravelGo Logo" style="height: 45px; object-fit: contain; max-width: 100%; display: inline-block; color: white; font-size: 24px; font-weight: bold; margin-bottom: 10px;" />
                <p style="color: #e0d4fc; margin: 5px 0 0 0; font-size: 15px;">${headerTitle}</p>
            </div>

            <!-- Body -->
            <div style="padding: 35px 30px;">
                <h2 style="color: #4502c7; font-size: 22px; margin-top: 0; font-weight: 800;">
                    ${welcomeMessage}
                </h2>
                
                <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 20px;">
                    Dưới đây là thông tin chi tiết đơn hàng của bạn:
                </p>

                ${statusBannerHtml}
                
                <!-- Khung mã đơn hàng -->
                <div style="background-color: rgba(69, 2, 199, 0.05); border-left: 4px solid #4502c7; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #666;">Mã đơn đặt tour:</p>
                    <p style="margin: 4px 0 6px 0; font-size: 22px; font-weight: bold; color: #4502c7; letter-spacing: 1px;">${booking_code}</p>
                    <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.4;">
                        💡 <i>Dùng mã này để tra cứu thông tin tour trên website.</i> 
                        <a href="${process.env.URL_FE_1}/booking/lookup/${booking_code}" style="color: #ff3b2f; font-weight: bold; text-decoration: underline; margin-left: 5px;">Tra cứu ngay ➔</a>
                    </p>
                </div>

                <!-- Bảng thông tin Chuyến đi -->
                <h3 style="color: #333; font-size: 17px; border-bottom: 2px solid #f0ecfc; padding-bottom: 8px; margin-top: 30px;">
                    Thông tin chuyến đi
                </h3>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 25px;">
                    <tr>
                        <td style="padding: 10px 0; color: #666; width: 35%; border-bottom: 1px solid #f9f9f9;">Tên tour:</td>
                        <td style="padding: 10px 0; color: #111; font-weight: 700; border-bottom: 1px solid #f9f9f9;">${departure?.tour_title || "Tour du lịch TravelGo"}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #f9f9f9;">Khởi hành:</td>
                        <td style="padding: 10px 0; color: #111; font-weight: 700; border-bottom: 1px solid #f9f9f9;">${formatHelper.formatDate(departure?.start_date)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #f9f9f9; vertical-align: top;">Số lượng khách:</td>
                        <td style="padding: 10px 0; color: #111; font-weight: 600; line-height: 1.6;">
                            ${quantity_adult > 0 ? `${quantity_adult} Người lớn <br/>` : ""}
                            ${quantity_children > 0 ? `${quantity_children} Trẻ em <br/>` : ""}
                            ${quantity_baby > 0 ? `${quantity_baby} Em bé` : ""}
                        </td>
                    </tr>
                </table>

                <!-- Bảng Chi tiết Thanh toán -->
                <h3 style="color: #333; font-size: 17px; border-bottom: 2px solid #f0ecfc; padding-bottom: 8px; margin-top: 30px;">
                    Chi tiết thanh toán
                </h3>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 25px;">
                    <tr>
                        <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #f9f9f9;">Tạm tính:</td>
                        <td style="padding: 10px 0; text-align: right; color: #333; border-bottom: 1px solid #f9f9f9;">${formatHelper.formatCurrency(sub_total)}</td>
                    </tr>
                    ${
                      discount > 0
                        ? `
                    <tr>
                        <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #f9f9f9;">Giảm giá:</td>
                        <td style="padding: 10px 0; text-align: right; color: #2e7d32; border-bottom: 1px solid #f9f9f9;">-${formatHelper.formatCurrency(discount)}</td>
                    </tr>`
                        : ""
                    }
                    <tr style="border-top: 1px dashed #ddd;">
                        <td style="padding: 15px 0; font-weight: bold; color: #111; font-size: 16px;">Tổng tiền tour:</td>
                        <td style="padding: 15px 0; text-align: right; font-weight: bold; color: #4502c7; font-size: 20px;">${formatHelper.formatCurrency(total)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #666; vertical-align: top;">
                            ${isPaidSuccess ? "Số tiền đã thanh toán" : "Số tiền cần thanh toán"}
                            <br/><span style="font-size: 13px; color: #999;">(${formatHelper.formatPaymentType(payment_type)})</span>:
                        </td>
                        <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #ff3b2f; font-size: 18px; vertical-align: top;">
                            ${formatHelper.formatCurrency(payable_amount)}
                        </td>
                    </tr>
                    ${
                      payment_type === "50"
                        ? `
                    <tr>
                        <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #f9f9f9;">Số tiền còn lại (Thanh toán khi đi tour):</td>
                        <td style="padding: 10px 0; text-align: right; color: #e65100; font-weight: 700; border-bottom: 1px solid #f9f9f9;">${formatHelper.formatCurrency(remainingAmount)}</td>
                    </tr>`
                        : ""
                    }
                    <tr>
                        <td style="padding: 10px 0; color: #666;">Phương thức:</td>
                        <td style="padding: 10px 0; text-align: right; color: #333; font-weight: 600;">${formatHelper.formatPaymentMethod(payment_method)}</td>
                    </tr>
                </table>

                <!-- Nút xem chi tiết -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${process.env.URL_FE_1}/booking/lookup/${booking_code}" style="background-color: #ff3b2f; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 30px; font-size: 15px; font-weight: bold; display: inline-block;">
                        Kiểm tra đơn hàng ngay
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px dashed #eee; margin: 30px 0;" />
                
                <p style="font-size: 14px; color: #666; margin-bottom: 5px; line-height: 1.5;">Nếu có bất kỳ thắc mắc nào về chuyến đi, vui lòng liên hệ tổng đài CSKH TravelGo để được hỗ trợ nhanh nhất.</p>
                <p style="font-size: 15px; font-weight: bold; color: #4502c7; margin-top: 10px;">Trân trọng, Đội ngũ TravelGo</p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f2f3f5; padding: 20px; text-align: center; font-size: 13px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 5px 0;">© 2026 TravelGo. Tất cả các quyền được bảo lưu.</p>
                <p style="margin: 0;">Email này được gửi tự động từ hệ thống, vui lòng không trả lời trực tiếp.</p>
            </div>
        </div>
    </div>
  `;

  return mailHelper.sendMail(email, subject, htmlContent);
};
