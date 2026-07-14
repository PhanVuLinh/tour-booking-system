const { pool } = require("../../config/database");

module.exports.getBlogs = async (page = 1, limit = 9, sort = "created_at") => {
  try {
    const offset = (page - 1) * limit;

    // Xử lý Sắp xếp
    let orderBy = "ORDER BY createdAt DESC";
    if (sort === "oldest") orderBy = "ORDER BY createdAt ASC";
    // if (sort === "popular") orderBy = "ORDER BY views DESC";

    const sql = `
    select id, title, slug, thumbnail, description, createdAt
    from blogs
    where status = 'active' and deleted = 0
    ${orderBy}
    limit ? offset ?
  `;

    const [blogs] = await pool.query(sql, [parseInt(limit), parseInt(offset)]);

    const countSql = `
    select count(*) as total
    from blogs
    where status = 'active' and deleted = 0
  `;
    const [countResult] = await pool.query(countSql);
    const total = countResult[0].total;

    return {
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
      },
    };
  } catch (error) {
    console.error("Lỗi getBlogs:", error);
    throw new Error("Lỗi Server khi lấy bài viết");
  }
};
