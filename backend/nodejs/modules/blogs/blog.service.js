const { pool } = require("../../config/database");

module.exports.getBlogs = async (page = 1, limit = 9, sort = "created_at") => {
  try {
    const offset = (page - 1) * limit;

    let orderBy = "ORDER BY created_at DESC";
    if (sort === "oldest") orderBy = "ORDER BY created_at ASC";

    const sql = `
    select id, title, slug, thumbnail, description, created_at
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

module.exports.getBlogDetailBySlug = async (slug) => {
  try {
    const sql = `
      select id, title, slug, thumbnail, description, content, created_at
      from blogs
      where slug = ? 
        and status = 'active' 
        and deleted = 0
    `;
    const [blogs] = await pool.query(sql, [slug]);

    if (blogs.length === 0) {
      return null;
    }

    const recentSql = `
            select id, title, slug, thumbnail, created_at
            from blogs
            where status = 'active' and deleted = 0 and slug != ?
            ORDER BY created_at DESC
            LIMIT 5
        `;
    const [recentBlogs] = await pool.query(recentSql, [slug]);
    return {
      blog: blogs[0],
      recentBlogs: recentBlogs,
    };
  } catch (error) {
    console.error("Lỗi getBlogDetailBySlug:", error);
    throw new Error("Lỗi Server khi lấy chi tiết bài viết");
  }
};
