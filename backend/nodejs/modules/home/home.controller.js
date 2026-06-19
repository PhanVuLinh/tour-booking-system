const homeService = require("./home.service");

module.exports.getTourFlashSales = async (req, res) => {
  try {
    // Gọi tới Service ở đây
    const data = await homeService.getFlashSales();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
