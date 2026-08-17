const { pool } = require("../../config/database");
const {
  getPagination,
  getPaginationMeta,
} = require("../../helpers/pagination.helper");

const buildCategoryTree = (categories, parent_id = null) => {
  const tree = [];
  categories.forEach((item) => {
    if (item.parent_id === parent_id) {
      tree.push({
        id: item.id,
        title: item.title,
        slug: item.slug,
        thumbnail: item.thumbnail,
        status: item.status,
        created_by: item.created_by,
        updated_by: item.updated_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
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

module.exports.getCategoryAndToursBySlug = async (
  slug,
  page = 1,
  limit = 9,
  departure_from = null,
  priceLevel = null,
  start_date = null,
  adults = 0,
  children = 0,
  babies = 0,
  sort = null,
) => {
  const { currentPage, pageLimit, offset } = getPagination(page, limit, 9);

  const [categories] = await pool.query(
    `SELECT 
        c1.id, 
        c1.title, 
        c1.slug, 
        c1.thumbnail,
        c2.title AS parentTitle, 
        c2.slug AS parentSlug
     FROM categories c1
     LEFT JOIN categories c2 ON c1.parent_id = c2.id
     WHERE c1.slug = ? AND c1.deleted = 0 AND c1.status = 'active'`,
    [slug],
  );

  if (categories.length === 0) {
    return { category: null, tours: [] };
  }

  const category = categories[0];

  let sqlConditions = `
      WHERE (category_id = ? or Category_id IN (SELECT id FROM categories WHERE parent_id = ?))
        AND tours.deleted = 0 
        AND tours.status = 'active'
        AND departures.deleted = 0
        AND departures.status = 'active'
        AND departures.start_date >= NOW()
  `;
  const queryParams = [category.id, category.id];

  if (departure_from) {
    sqlConditions += ` AND departures.departure_from = ?`;
    queryParams.push(departure_from);
  }

  if (priceLevel) {
    const priceCalc = `(departures.price_adult - (departures.price_adult * departures.discount_percentage / 100))`;
    if (priceLevel === "1") {
      sqlConditions += ` AND ${priceCalc} < 5000000`;
    } else if (priceLevel === "2") {
      sqlConditions += ` AND ${priceCalc} >= 5000000 AND ${priceCalc} <= 10000000`;
    } else if (priceLevel === "3") {
      sqlConditions += ` AND ${priceCalc} > 10000000`;
    }
  }

  if (start_date) {
    sqlConditions += ` AND DATE(departures.start_date) = ?`;
    queryParams.push(start_date);
  }

  if (adults > 0) {
    sqlConditions += ` AND departures.stock_adult >= ?`;
    queryParams.push(adults);
  }

  if (children > 0) {
    sqlConditions += ` AND departures.stock_children >= ?`;
    queryParams.push(children);
  }

  if (babies > 0) {
    sqlConditions += ` AND departures.stock_baby >= ?`;
    queryParams.push(babies);
  }

  const sqlTours = ` SELECT tours.id,
        tours.slug,
        tours.title,
        tours.thumbnail,
        tours.time AS time,
        departures.id AS departure_id,
        departures.departure_from,
        departures.start_date,
        departures.price_adult AS oldPrice,
        departures.discount_percentage,
        (departures.price_adult - (departures.price_adult * departures.discount_percentage / 100)) AS newPrice,
        (departures.stock_adult + departures.stock_children + departures.stock_baby) AS slots,
        vehicles.name AS vehicleName,
        vehicles.vehicle_type AS vehicle_type
      FROM tours JOIN departures ON tours.id = departures.tour_id
      LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
      ${sqlConditions}
      `;

  const countSql = `
    SELECT COUNT(tours.id) as total
    FROM tours JOIN departures ON tours.id = departures.tour_id
    ${sqlConditions}
  `;

  const [countResult] = await pool.query(countSql, queryParams);
  const totalTours = countResult[0].total;
  const paginationMeta = getPaginationMeta(totalTours, currentPage, pageLimit);

  let sortQuery = "ORDER BY tours.id DESC";
  if (sort === "priceAsc") {
    sortQuery = "ORDER BY newPrice ASC";
  } else if (sort === "priceDesc") {
    sortQuery = "ORDER BY newPrice DESC";
  } else if (sort === "hot") {
    sortQuery = "ORDER BY departures.discount_percentage DESC";
  }

  const [tours] = await pool.query(
    sqlTours + ` ${sortQuery} LIMIT ? OFFSET ?`,
    [...queryParams, pageLimit, offset],
  );

  return {
    category: category,
    tours: tours,
    pagination: {
      currentPage: paginationMeta.currentPage,
      totalPages: paginationMeta.totalPages,
      totalTours: paginationMeta.totalItems,
      limit: paginationMeta.limit,
    },
  };
};

module.exports.getDepartureLocations = async () => {
  const sql = `
    SELECT DISTINCT departure_from 
    FROM departures 
    WHERE deleted = 0 AND status = 'active' AND departure_from IS NOT NULL AND departure_from != ''
  `;
  const [rows] = await pool.query(sql);
  return rows.map((row) => row.departure_from);
};
