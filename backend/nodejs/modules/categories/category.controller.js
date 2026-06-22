const categoryService = require("./category.service");

module.exports.getCategories = async (req, res) => {
  try {
    const categoryTree = await categoryService.getCategoryTree();
    res.status(200).json({
      success: true,
      data: categoryTree,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi Server khi tải danh mục",
      error: error.message,
    });
  }
};

module.exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await categoryService.getCategoryAndToursBySlug(slug);

    if (!data.category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log("Lỗi khi lấy chi tiết danh mục: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tải chi tiết danh mục",
      error: error.message,
    });
  }
};
