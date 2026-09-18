const tourService = require("./tour.service");

module.exports.getTourDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const tourDetail = await tourService.getTourDetailBySlug(slug);

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay thong tin tour yeu cau!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lay chi tiet tour thanh cong!",
      data: tourDetail,
    });
  } catch (error) {
    console.error("Loi Controller getDetail:", error);
    return res.status(500).json({
      success: false,
      message: "Da xay ra loi he thong ben Server!",
    });
  }
};

module.exports.searchTours = async (req, res) => {
  try {
    const {
      destination,
      quantity,
      date,
      departure_from,
      priceLevel,
      sort,
      page = 1,
      limit = 8,
    } = req.query;

    const tours = await tourService.searchTours({
      destination,
      quantity,
      date,
      departure_from,
      priceLevel,
      sort,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Tìm kiếm tour thành công!",
      data: tours.tours,
      pagination: tours.pagination,
    });
  } catch (error) {
    console.error("Lỗi Controller searchTours:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống bên Server!",
    });
  }
};

module.exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await tourService.getSuggestions();

    return res.status(200).json({
      success: true,
      message: "Lấy gợi ý thành công!",
      data: suggestions,
    });
  } catch (error) {
    console.error("Lỗi Controller getSuggestions:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống bên Server!",
    });
  }
};
