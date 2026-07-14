const blogService = require("./blog.service");

module.exports.getBlogList = async (req, res) => {
  try {
    const { page, limit, sort } = req.query;
    const result = await blogService.getBlogs(page, limit, sort);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi getBlogList:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi Server khi lấy bài viết" });
  }
};
