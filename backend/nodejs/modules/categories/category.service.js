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
  const sql =
    "SELECT * FROM categories WHERE deleted = 0 AND status = 'active'";

  const [rows] = await pool.query(sql);

  const categoryTree = buildCategoryTree(rows, null);

  return categoryTree;
};

module.exports.getCategoryAndToursBySlug = async (slug) => {
  const [categories] = await pool.query(
    "SELECT id,title,slug,thumbnail  FROM categories WHERE slug=? AND deleted = 0 AND status = 'active'",
    [slug],
  );

  if (categories.length === 0) {
    return { category: null, tours: [] };
  }

  const category = categories[0];

  const [tours] = await pool.query(
    ` SELECT * FROM tours
      WHERE (category_id = ? or Category_id IN (SELECT id FROM categories WHERE parent_id = ?))
      AND deleted = 0 AND status = "active"`,
    [category.id, category.id],
  );
  return {
    category: category,
    tours: tours,
  };
};
