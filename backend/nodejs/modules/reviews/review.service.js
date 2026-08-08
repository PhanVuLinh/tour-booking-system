const { pool } = require("../../config/database");

const wordFilterHelper = require("../../helpers/wordFilter.helper");

module.exports.createReview = async ({
  user_id,
  tour_id,
  booking_id,
  rating,
  content,
}) => {
  try {
    const checkResult = wordFilterHelper.checkBadWords(content);

    if (checkResult.hasBadWords) {
      return {
        success: false,
        message:
          "Nội dung nhận xét chứa từ ngữ không phù hợp. Vui lòng điều chỉnh lại!",
      };
    }

    const [bookingRows] = await pool.query(
      `select bookings.id, bookings.status 
       from bookings 
       join departures on bookings.departure_id = departures.id
       where bookings.id = ? and bookings.user_id = ? and departures.tour_id = ?`,
      [booking_id, user_id, tour_id],
    );

    if (bookingRows.length === 0) {
      return {
        success: false,
        message:
          "Đơn đặt tour không tồn tại hoặc không thuộc tài khoản của bạn.",
      };
    }

    const [existingReview] = await pool.query(
      `select id from reviews where booking_id = ? and deleted = 0`,
      [booking_id],
    );

    if (existingReview.length > 0) {
      return {
        success: false,
        message: "Bạn đã gửi đánh giá cho đơn đặt tour này rồi.",
      };
    }

    await pool.query(
      `insert into reviews (user_id, tour_id, booking_id, rating, content, is_approved, deleted, created_at, updated_at) values (?, ?, ?, ?, ?, 1, 0, NOW(), NOW())`,
      [user_id, tour_id, booking_id, rating, content],
    );

    return {
      success: true,
      message: "Gửi đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến.",
    };
  } catch (error) {
    console.error("Lỗi service createReview:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi gửi đánh giá.",
    };
  }
};

module.exports.getReviewsByTourId = async (tourId) => {
  try {
    const [reviews] = await pool.query(
      `select 
        reviews.id,
        reviews.rating,
        reviews.content,
        reviews.created_at,
        users.full_name as user_name
      from reviews
      join users on reviews.user_id = users.id
      where reviews.tour_id = ? and reviews.deleted = 0
      order by reviews.created_at desc`,
      [tourId],
    );

    const totalReviews = reviews.length;

    let avgRating = 0;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sumRating = reviews.reduce((sum, item) => {
        ratingCounts[item.rating] = (ratingCounts[item.rating] || 0) + 1;
        return sum + item.rating;
      }, 0);
      avgRating = parseFloat((sumRating / totalReviews).toFixed(1));
    }
    return {
      success: true,
      data: {
        avgRating,
        totalReviews,
        ratingCounts,
        reviews,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách đánh giá.",
    };
  }
};

module.exports.checkBookingReviewStatus = async (bookingId) => {
  const [rows] = await pool.query(
    `select id, rating, content from reviews where booking_id = ? and deleted = 0`,
    [bookingId],
  );
  return {
    success: true,
    isReviewed: rows.length > 0,
    review: rows[0] || null,
  };
};
