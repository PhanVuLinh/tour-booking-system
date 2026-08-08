const reviewService = require("./review.service");

module.exports.createReview = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const { tour_id, booking_id, rating, content } = req.body;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập để gửi đánh giá.",
      });
    }

    if (!tour_id || !booking_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin.",
      });
    }

    const result = await reviewService.createReview({
      user_id,
      tour_id,
      booking_id,
      rating: Number(rating),
      content,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Lỗi controller createReview:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi gửi đánh giá.",
    });
  }
};

module.exports.getReviewsByTourId = async (req, res) => {
  try {
    const { tourId } = req.params;
    const result = await reviewService.getReviewsByTourId(tourId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi controller getReviewsByTourId:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi lấy danh sách đánh giá.",
    });
  }
};

module.exports.checkBookingReviewStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await reviewService.checkBookingReviewStatus(bookingId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi controller checkBookingReviewStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi kiểm tra trạng thái đánh giá.",
    });
  }
};
