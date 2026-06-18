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
