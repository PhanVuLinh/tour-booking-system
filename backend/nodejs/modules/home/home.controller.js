const homeService = require("./home.service");

module.exports.getTourFlashSales = async (req, res) => {
  try {
    const data = await homeService.getFlashSales();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getTourDomestic = async (req, res) => {
  try {
    const data = await homeService.getDomesticTours();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getTourForeign = async (req, res) => {
  try {
    const data = await homeService.getForeignTours();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getBlog = async (req, res) => {
  try {
    const data = await homeService.getBlogs();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
