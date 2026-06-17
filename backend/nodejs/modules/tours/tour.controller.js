const tourService = require("./tour.service");

module.exports.tourList = async (req, res) => {
  try {
    const tours = await tourService.getAllTours();

    res.json({
      success: true,
      message: "Lấy danh sách tour thành công",
      data: tours,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
