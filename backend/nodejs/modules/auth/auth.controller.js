const authService = require("./auth.service");

const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("client_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    path: "/",
  });
};

const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("client_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

module.exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Lỗi Controller Register:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi Server. Vui lòng thử lại sau.",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    if (result.data?.token) {
      setTokenCookie(res, result.data.token);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi Controller Login:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Lỗi Server. Vui lòng thử lại sau." });
  }
};

module.exports.loginGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    const result = await authService.loginGoogle(idToken);
    if (!result.success) return res.status(400).json(result);

    if (result.data?.token) {
      setTokenCookie(res, result.data.token);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi Controller Login Google:", error);
    res.status(500).json({ success: false, message: "Lỗi Server: " });
  }
};

module.exports.loginFacebook = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const result = await authService.loginFacebook(accessToken);
    if (!result.success) return res.status(400).json(result);

    if (result.data?.token) {
      setTokenCookie(res, result.data.token);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi Facebook Login:", error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Lỗi Controller Logout:", error);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

module.exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error("Lỗi Controller GetMe:", error);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};
