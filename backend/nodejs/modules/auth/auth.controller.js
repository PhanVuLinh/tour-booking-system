const authService = require("./auth.service");

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

    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi Controller Login:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Lỗi Server. Vui lòng thử lại sau." });
  }
};
