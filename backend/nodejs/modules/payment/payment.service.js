const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");
const { pool } = require("../../config/database");
const sortPayHelper = require("../../utils/sortPay.helper");

const createBusinessError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getVnpayConfig = () => {
  const config = {
    tmnCode: process.env.VNP_TMN_CODE || process.env.VNPAY_CODE,
    secretKey: process.env.VNP_HASH_SECRET || process.env.VNPAY_SECRET,
    vnpUrl: process.env.VNP_URL || process.env.VNPAY_URL,
    returnUrl: process.env.VNP_RETURN_URL,
  };

  if (
    !config.tmnCode ||
    !config.secretKey ||
    !config.vnpUrl ||
    !config.returnUrl
  ) {
    throw new Error("Thiếu cấu hình VNPay");
  }

  return config;
};

module.exports.createPaymentUrlService = async (bookingCode, ipAddr) => {
  const config = getVnpayConfig();
  const connection = await pool.getConnection();
  let orderDetail;

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT
        p.id AS paymentId,
        p.booking_id AS bookingId,
        p.amount,
        p.paymentMethod,
        p.paymentType,
        p.paymentStatus,
        b.status AS bookingStatus
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       WHERE b.bookingCode = ? AND p.paymentMethod = 'vnpay'
       ORDER BY p.id DESC
       LIMIT 1
       FOR UPDATE`,
      [bookingCode],
    );

    if (rows.length === 0) {
      throw createBusinessError("Đơn hàng không tồn tại hoặc không dùng VNPay");
    }

    orderDetail = rows[0];

    if (orderDetail.bookingStatus !== "pending") {
      throw createBusinessError(
        orderDetail.bookingStatus === "confirmed"
          ? "Đơn hàng đã được xác nhận"
          : "Đơn hàng không còn được phép thanh toán",
      );
    }

    if (orderDetail.paymentStatus === "paid") {
      throw createBusinessError("Đơn hàng đã thanh toán");
    }

    if (!["pending", "failed"].includes(orderDetail.paymentStatus)) {
      throw createBusinessError("Trạng thái thanh toán không hợp lệ");
    }

    if (Number(orderDetail.amount) < 5000) {
      throw createBusinessError("Số tiền thanh toán VNPay tối thiểu là 5.000đ");
    }

    // Nếu lần trước thất bại, tạo một payment mới cho lần thử lại.
    // Booking và stock cũ được giữ nguyên, không trừ thêm lần nữa.
    if (orderDetail.paymentStatus === "failed") {
      const [retryPayment] = await connection.query(
        `INSERT INTO payments
          (booking_id, paymentMethod, paymentType, amount, paymentStatus)
         VALUES (?, 'vnpay', ?, ?, 'pending')`,
        [orderDetail.bookingId, orderDetail.paymentType, orderDetail.amount],
      );

      orderDetail.paymentId = retryPayment.insertId;
      orderDetail.paymentStatus = "pending";
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const now = moment().utcOffset(7 * 60);
  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: String(orderDetail.paymentId),
    vnp_OrderInfo: `Thanh toan don hang ${orderDetail.paymentId}`,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(Number(orderDetail.amount)) * 100,
    vnp_ReturnUrl: config.returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: now.format("YYYYMMDDHHmmss"),
    vnp_ExpireDate: now.clone().add(15, "minutes").format("YYYYMMDDHHmmss"),
  };

  const sortedParams = sortPayHelper.sortObject(vnpParams);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const secureHash = crypto
    .createHmac("sha512", config.secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  sortedParams.vnp_SecureHash = secureHash;
  return `${config.vnpUrl}?${querystring.stringify(sortedParams, { encode: false })}`;
};

module.exports.processVnpayReturnService = async (vnpParams) => {
  const config = getVnpayConfig();
  const params = { ...vnpParams };
  const secureHash = params.vnp_SecureHash;

  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sortedParams = sortPayHelper.sortObject(params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const signed = crypto
    .createHmac("sha512", config.secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (!secureHash || secureHash !== signed) {
    return {
      success: false,
      error: "invalid_signature",
      message:
        "Thông tin phản hồi từ VNPAY không hợp lệ. Hệ thống chưa ghi nhận thanh toán.",
    };
  }

  if (params.vnp_TmnCode !== config.tmnCode) {
    return {
      success: false,
      error: "invalid_tmn_code",
      message: "Mã website VNPay trả về không hợp lệ.",
    };
  }

  // URL mới dùng paymentId làm TxnRef. split vẫn hỗ trợ URL cũ dạng id-timestamp.
  const paymentId = String(params.vnp_TxnRef || "").split("-")[0];
  if (!/^\d+$/.test(paymentId)) {
    return {
      success: false,
      error: "invalid_transaction",
      message: "Mã giao dịch VNPay không hợp lệ.",
    };
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT
        p.*,
        b.id AS bookingId,
        b.bookingCode,
        b.status AS bookingStatus
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       WHERE p.id = ?
       FOR UPDATE`,
      [paymentId],
    );

    if (rows.length === 0) {
      await connection.rollback();
      return {
        success: false,
        error: "payment_not_found",
        message: "Không tìm thấy giao dịch thanh toán trong hệ thống.",
      };
    }

    const payment = rows[0];
    const resultInfo = {
      bookingId: payment.bookingId,
      bookingCode: payment.bookingCode,
      responseCode: params.vnp_ResponseCode,
    };

    const expectedAmount = Math.round(Number(payment.amount)) * 100;
    if (Number(params.vnp_Amount) !== expectedAmount) {
      await connection.rollback();
      return {
        success: false,
        error: "invalid_amount",
        message: "Số tiền VNPay trả về không khớp với đơn hàng.",
        ...resultInfo,
      };
    }

    // Callback gọi lại sau khi đã thanh toán thì trả thành công, không cập nhật lần hai.
    if (payment.paymentStatus === "paid") {
      await connection.commit();
      return { success: true, ...resultInfo };
    }

    const isSuccess =
      params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00";

    if (isSuccess) {
      await connection.query(
        `UPDATE payments
         SET paymentStatus = 'paid', transaction_id = ?, paidAt = NOW()
         WHERE id = ?`,
        [params.vnp_TransactionNo || null, paymentId],
      );

      if (payment.bookingStatus === "cancelled") {
        await connection.commit();
        return {
          success: false,
          error: "booking_cancelled",
          message: "Đơn hàng đã bị hủy và không thể xác nhận tự động.",
          ...resultInfo,
        };
      }

      await connection.query(
        "UPDATE bookings SET status = 'confirmed' WHERE id = ?",
        [payment.bookingId],
      );

      // Nếu tồn tại payment pending cũ, đóng chúng lại sau khi một lần đã thành công.
      await connection.query(
        `UPDATE payments
         SET paymentStatus = 'failed'
         WHERE booking_id = ? AND id <> ? AND paymentStatus = 'pending'`,
        [payment.bookingId, paymentId],
      );

      await connection.commit();
      return { success: true, ...resultInfo };
    }

    await connection.query(
      "UPDATE payments SET paymentStatus = 'failed' WHERE id = ?",
      [paymentId],
    );

    // Booking vẫn pending để khách có thể bấm thanh toán lại.
    await connection.commit();
    return {
      success: false,
      error: "payment_failed",
      message:
        "Giao dịch chưa hoàn tất hoặc đã bị hủy. Bạn có thể thanh toán lại.",
      ...resultInfo,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports.getPaymentStatusService = async (bookingCode) => {
  const [rows] = await pool.query(
    `SELECT
      b.id AS bookingId,
      b.bookingCode,
      b.status AS bookingStatus,
      p.id AS paymentId,
      p.paymentStatus,
      p.amount,
      p.transaction_id AS transactionId,
      p.paidAt
     FROM bookings b
     JOIN payments p ON p.booking_id = b.id
     WHERE b.bookingCode = ? AND p.paymentMethod = 'vnpay'
     ORDER BY CASE WHEN p.paymentStatus = 'paid' THEN 0 ELSE 1 END, p.id DESC
     LIMIT 1`,
    [bookingCode],
  );

  if (rows.length === 0) return null;

  const payment = rows[0];
  return {
    ...payment,
    canRetry:
      payment.bookingStatus === "pending" && payment.paymentStatus === "failed",
  };
};

// Lấy lại toàn bộ dữ liệu cho BookingSuccess sau khi quay về từ VNPay.
// Redirect qua cổng thanh toán làm mất location.state của React.
module.exports.getBookingSuccessDataService = async (bookingId) => {
  const [bookingRows] = await pool.query(
    `SELECT
      b.id,
      b.bookingCode,
      b.fullName,
      b.phone,
      b.email,
      b.address,
      b.quantityAdult,
      b.quantityChildren,
      b.quantityBaby,
      b.subTotal,
      b.discount,
      b.total,
      b.note,
      b.status AS bookingStatus,
      d.startDate,
      t.title AS tourTitle,
      t.thumbnail AS tourThumbnail,
      p.paymentMethod,
      p.paymentType,
      p.amount AS payableAmount,
      p.paymentStatus
     FROM bookings b
     JOIN departures d ON b.departure_id = d.id
     JOIN tours t ON d.tour_id = t.id
     JOIN payments p ON p.booking_id = b.id
     WHERE b.id = ?
       AND b.deleted = 0
       AND p.paymentMethod = 'vnpay'
       AND p.paymentStatus = 'paid'
     ORDER BY p.id DESC
     LIMIT 1`,
    [bookingId],
  );

  if (bookingRows.length === 0) return null;

  const booking = bookingRows[0];
  const [passengerRows] = await pool.query(
    `SELECT fullName, dob, gender, identity_card, phone, passengerType
     FROM passengers
     WHERE booking_id = ?
     ORDER BY id ASC`,
    [bookingId],
  );

  const passengerDetails = {
    adults: [],
    children: [],
    infants: [],
  };

  for (const passenger of passengerRows) {
    const passengerData = {
      fullName: passenger.fullName,
      dob: passenger.dob,
      gender: passenger.gender,
      identity_card: passenger.identity_card,
      phone: passenger.phone,
    };

    if (passenger.passengerType === "adult") {
      passengerDetails.adults.push(passengerData);
    } else if (passenger.passengerType === "child") {
      passengerDetails.children.push(passengerData);
    } else {
      passengerDetails.infants.push(passengerData);
    }
  }

  const total = Number(booking.total) || 0;
  const payableAmount = Number(booking.payableAmount) || 0;

  return {
    bookingCode: booking.bookingCode,
    formData: {
      contact: {
        fullName: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        address: booking.address,
      },
      note: booking.note,
      passengerDetails,
    },
    selectedDate: { startDate: booking.startDate },
    tour: {
      title: booking.tourTitle,
      thumbnail: booking.tourThumbnail,
    },
    passengers: {
      adults: Number(booking.quantityAdult) || 0,
      children: Number(booking.quantityChildren) || 0,
      infants: Number(booking.quantityBaby) || 0,
    },
    subtotal: Number(booking.subTotal) || 0,
    discount: Number(booking.discount) || 0,
    total,
    payableAmount,
    remainingAmount: Math.max(total - payableAmount, 0),
    paymentMethod: booking.paymentMethod,
    paymentType: booking.paymentType,
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
  };
};

module.exports.expireBookingForTestService = async (bookingCode) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [bookingRows] = await connection.query(
      `SELECT * FROM bookings WHERE bookingCode = ? FOR UPDATE`,
      [bookingCode],
    );

    if (bookingRows.length === 0) {
      throw createBusinessError("Không tìm thấy đơn hàng");
    }

    const booking = bookingRows[0];
    if (booking.status !== "pending") {
      throw createBusinessError("Chỉ đơn đang chờ mới có thể giả lập hết hạn");
    }

    const [paymentRows] = await connection.query(
      `SELECT * FROM payments
       WHERE booking_id = ? AND paymentMethod = 'vnpay'
       ORDER BY CASE WHEN paymentStatus = 'paid' THEN 0 ELSE 1 END, id DESC
       LIMIT 1
       FOR UPDATE`,
      [booking.id],
    );

    if (paymentRows.length === 0) {
      throw createBusinessError("Đơn hàng không sử dụng VNPay");
    }

    if (paymentRows[0].paymentStatus === "paid") {
      throw createBusinessError("Đơn hàng đã thanh toán, không thể hết hạn");
    }

    await connection.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [booking.id],
    );
    await connection.query(
      `UPDATE payments SET paymentStatus = 'failed'
       WHERE booking_id = ? AND paymentStatus = 'pending'`,
      [booking.id],
    );
    await connection.query(
      `UPDATE departures
       SET stockAdult = stockAdult + ?,
           stockChildren = stockChildren + ?,
           stockBaby = stockBaby + ?
       WHERE id = ?`,
      [
        booking.quantityAdult,
        booking.quantityChildren,
        booking.quantityBaby,
        booking.departure_id,
      ],
    );

    if (booking.coupon_id) {
      await connection.query(
        `UPDATE coupons
         SET usedCount = GREATEST(usedCount - 1, 0)
         WHERE id = ?`,
        [booking.coupon_id],
      );

      if (booking.user_id) {
        await connection.query(
          "DELETE FROM user_coupons WHERE user_id = ? AND coupon_id = ?",
          [booking.user_id, booking.coupon_id],
        );
      }
    }

    await connection.commit();
    return {
      bookingCode: booking.bookingCode,
      bookingStatus: "cancelled",
      paymentStatus: "failed",
      releasedStock: true,
      releasedCoupon: Boolean(booking.coupon_id),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
