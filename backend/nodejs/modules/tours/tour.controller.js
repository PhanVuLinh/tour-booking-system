const tourService = require("./tour.service");

module.exports.getTourDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const tourDetail = await tourService.getTourDetailBySlug(slug);

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tour yêu cầu!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết tour thành công!",
      data: tourDetail,
    });
  } catch (error) {
    console.error("Lỗi Controller getDetail:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống bên Server!",
    });
  }
};
