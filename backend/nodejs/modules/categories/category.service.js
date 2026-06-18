const { pool } = require("../../config/database");

const buildCategoryTree = (categories, parentId = null) => {
  const tree = [];
  categories.forEach((item) => {
    if (item.parent_id === parentId) {
      tree.push({
        id: item.id,
        title: item.title,
        slug: item.slug,
        thumbnail: item.thumbnail,
        status: item.status,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        children: buildCategoryTree(categories, item.id),
      });
    }
  });
  return tree;
};

module.exports.getCategoryTree = async () => {
  const sql = "SELECT * FROM categories WHERE deleted = 0";

  const [rows] = await pool.query(sql);

  const categoryTree = buildCategoryTree(rows, null);

  return categoryTree;
};
