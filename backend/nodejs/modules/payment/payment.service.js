const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");
const { pool } = require("../../config/database");
const sortPayHelper = require("../../utils/sortPay.helper");

module.exports.createPaymentUrlService = async (bookingCode, ipAddr) => {
  const [rows] = await pool.query(
    `SELECT p.id as paymentId, p.amount, p.paymentStatus, b.id as bookingId, b.status as bookingStatus
     FROM payments p
     JOIN bookings b ON p.booking_id = b.id
     WHERE b.bookingCode = ? AND p.paymentMethod = 'vnpay'
     ORDER BY p.id DESC LIMIT 1`,
    [bookingCode],
  );

  if (rows.length === 0) {
    throw new Error("Đơn hàng không tồn tại hoặc không dùng VNPay");
  }

  const orderDetail = rows[0];

  if (orderDetail.paymentStatus === "paid") {
    throw new Error("Đơn hàng đã thanh toán");
  }

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let tmnCode = process.env.VNP_TMN_CODE || process.env.VNPAY_CODE;
  let secretKey = process.env.VNP_HASH_SECRET || process.env.VNPAY_SECRET;
  let vnpUrl = process.env.VNP_URL || process.env.VNPAY_URL;
  let returnUrl = process.env.VNP_RETURN_URL;

  let orderIdVNP = `${orderDetail.paymentId}-${Date.now()}`;
  let amount = orderDetail.amount;
  let bankCode = "";

  let locale = "vn";
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderIdVNP;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderIdVNP;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = Math.round(Number(amount)) * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortPayHelper.sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

module.exports.processVnpayReturnService = async (vnp_Params) => {
  const params = { ...vnp_Params };
  const secureHash = params["vnp_SecureHash"];

  delete params["vnp_SecureHash"];
  delete params["vnp_SecureHashType"];

  vnp_Params = sortPayHelper.sortObject(params);

  let secretKey = process.env.VNP_HASH_SECRET || process.env.VNPAY_SECRET;

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (
      vnp_Params["vnp_ResponseCode"] === "00" &&
      vnp_Params["vnp_TransactionStatus"] === "00"
    ) {
      const [paymentId, date] = vnp_Params["vnp_TxnRef"].split("-");

      const [rows] = await pool.query(
        "SELECT * FROM payments WHERE id = ? AND paymentStatus = 'pending'",
        [paymentId],
      );

      if (rows.length > 0) {
        const payment = rows[0];

        await pool.query(
          "UPDATE payments SET paymentStatus = 'paid' WHERE id = ?",
          [paymentId],
        );

        await pool.query(
          "UPDATE bookings SET status = 'confirmed' WHERE id = ?",
          [payment.booking_id],
        );

        return { success: true, bookingId: payment.booking_id };
      } else {
        const [rowsCheck] = await pool.query(
          "SELECT * FROM payments WHERE id = ?",
          [paymentId],
        );
        if (rowsCheck.length > 0) {
          return { success: true, bookingId: rowsCheck[0].booking_id };
        }
      }
    }
    return { success: false };
  } else {
    return { success: false, error: "invalid_signature" };
  }
};
