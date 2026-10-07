const jwt = require("jsonwebtoken");

const extractToken = (req) => {
  if (req.cookies && req.cookies.client_token) {
    return req.cookies.client_token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

module.exports.requireAuth = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Vui lòng đăng nhập!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Phiên đăng nhập hết hạn!" });
  }
};

module.exports.optionalAuth = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Không làm gì cả, cứ coi như khách vãng lai nếu token sai
  }
  next();
};
