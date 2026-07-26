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

module.exports.createPaymentUrlService = async (booking_code, ipAddr) => {
  const config = getVnpayConfig();
  const connection = await pool.getConnection();
  let orderDetail;

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `select
        payments.id AS paymentId,
        payments.booking_id AS bookingId,
        payments.amount,
        payments.payment_method,
        payments.payment_type,
        payments.payment_status,
        bookings.status AS bookingStatus
       FROM payments 
       JOIN bookings ON payments.booking_id = bookings.id
       WHERE bookings.booking_code = ? AND payments.payment_method = 'vnpay'
       ORDER BY payments.id DESC
       LIMIT 1
       FOR UPDATE`,
      [booking_code],
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

    if (orderDetail.payment_status === "paid") {
      throw createBusinessError("Đơn hàng đã thanh toán");
    }

    if (!["pending", "failed"].includes(orderDetail.payment_status)) {
      throw createBusinessError("Trạng thái thanh toán không hợp lệ");
    }

    if (Number(orderDetail.amount) < 5000) {
      throw createBusinessError("Số tiền thanh toán VNPay tối thiểu là 5.000đ");
    }

    // Nếu lần trước thất bại, tạo một payment mới cho lần thử lại.
    // Booking và stock cũ được giữ nguyên, không trừ thêm lần nữa.
    if (orderDetail.payment_status === "failed") {
      const [retryPayment] = await connection.query(
        `INSERT INTO payments
          (booking_id, payment_method, payment_type, amount, payment_status)
         VALUES (?, 'vnpay', ?, ?, 'pending')`,
        [orderDetail.bookingId, orderDetail.payment_type, orderDetail.amount],
      );

      orderDetail.paymentId = retryPayment.insertId;
      orderDetail.payment_status = "pending";
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
      `select
        payments.*,
        bookings.id AS bookingId,
        bookings.booking_code,
        bookings.status AS bookingStatus
       from payments 
       join bookings on payments.booking_id = bookings.id
       where payments.id = ?
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
      booking_code: payment.booking_code,
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
    if (payment.payment_status === "paid") {
      await connection.commit();
      return { success: true, ...resultInfo };
    }

    const isSuccess =
      params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00";

    if (isSuccess) {
      await connection.query(
        `update payments
         set payment_status = 'paid', transaction_id = ?, paid_at = NOW()
         where id = ?`,
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
        "update bookings set status = 'confirmed' where id = ?",
        [payment.bookingId],
      );

      // Nếu tồn tại payment pending cũ, đóng chúng lại sau khi một lần đã thành công.
      await connection.query(
        `update payments
         set payment_status = 'failed'
         where booking_id = ? and id <> ? and payment_status = 'pending'`,
        [payment.bookingId, paymentId],
      );

      await connection.commit();
      return { success: true, ...resultInfo };
    }

    await connection.query(
      "update payments set payment_status = 'failed' where id = ?",
      [paymentId],
    );

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

module.exports.getPaymentStatusService = async (booking_code) => {
  const [rows] = await pool.query(
    `select
      bookings.id as bookingId,
      bookings.booking_code,
      bookings.status as bookingStatus,
      payments.id as paymentId,
      payments.payment_status,
      payments.amount,
      payments.transaction_id as transactionId,
      payments.paidAt
     from bookings 
     join payments on payments.booking_id = bookings.id
     where bookings.booking_code = ? and payments.payment_method = 'vnpay'
     order by case when payments.payment_status = 'paid' then 0 else 1 end, payments.id desc
     limit 1`,
    [booking_code],
  );

  if (rows.length === 0) return null;

  const payment = rows[0];
  return {
    ...payment,
    canRetry:
      payment.bookingStatus === "pending" &&
      payment.payment_status === "failed",
  };
};

// Lấy lại toàn bộ dữ liệu cho BookingSuccess sau khi quay về từ VNPay.
// Redirect qua cổng thanh toán làm mất location.state của React.
module.exports.getBookingSuccessDataService = async (bookingId) => {
  const [bookingRows] = await pool.query(
    `select
      bookings.id,
      bookings.booking_code,
      bookings.full_name,
      bookings.phone,
      bookings.email,
      bookings.address,
      bookings.quantity_adult,
      bookings.quantity_children,
      bookings.quantity_baby,
      bookings.sub_total,
      bookings.discount,
      bookings.total,
      bookings.note,
      bookings.status AS bookingStatus,
      departures.start_date,
      tours.title AS tourTitle,
      tours.thumbnail AS tourThumbnail,
      payments.payment_method,
      payments.payment_type,
      payments.amount AS payable_amount,
      payments.payment_status
     from bookings
     join departures on departures.id = bookings.departure_id
     join tours on tours.id = departures.tour_id
     join payments on payments.booking_id = bookings.id
     where bookings.id = ?
       and bookings.deleted = 0
       and payments.payment_method = 'vnpay'
       and payments.payment_status = 'paid'
     order by payments.id desc
     limit 1`,
    [bookingId],
  );

  if (bookingRows.length === 0) return null;

  const booking = bookingRows[0];
  const [passengerRows] = await pool.query(
    `select full_name, dob, gender, identity_card, phone, passenger_type
     from passengers
     where booking_id = ?
     order by id asc`,
    [bookingId],
  );

  const passengerDetails = {
    adults: [],
    children: [],
    infants: [],
  };

  for (const passenger of passengerRows) {
    const passengerData = {
      full_name: passenger.full_name,
      dob: passenger.dob,
      gender: passenger.gender,
      identity_card: passenger.identity_card,
      phone: passenger.phone,
    };

    if (passenger.passenger_type === "adult") {
      passengerDetails.adults.push(passengerData);
    } else if (passenger.passenger_type === "child") {
      passengerDetails.children.push(passengerData);
    } else {
      passengerDetails.infants.push(passengerData);
    }
  }

  const total = Number(booking.total) || 0;
  const payable_amount = Number(booking.payable_amount) || 0;

  return {
    booking_code: booking.booking_code,
    formData: {
      contact: {
        full_name: booking.full_name,
        phone: booking.phone,
        email: booking.email,
        address: booking.address,
      },
      note: booking.note,
      passengerDetails,
    },
    selectedDate: { start_date: booking.start_date },
    tour: {
      title: booking.tourTitle,
      thumbnail: booking.tourThumbnail,
    },
    passengers: {
      adults: Number(booking.quantity_adult) || 0,
      children: Number(booking.quantity_children) || 0,
      infants: Number(booking.quantity_baby) || 0,
    },
    subtotal: Number(booking.sub_total) || 0,
    discount: Number(booking.discount) || 0,
    total,
    payable_amount,
    remainingAmount: Math.max(total - payable_amount, 0),
    payment_method: booking.payment_method,
    payment_type: booking.payment_type,
    payment_status: booking.payment_status,
    bookingStatus: booking.bookingStatus,
  };
};
