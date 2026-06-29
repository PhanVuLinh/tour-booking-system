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

module.exports.getCategoryAndToursBySlug = async (slug, page = 1, limit = 9, departureFrom = null, priceLevel = null, startDate = null, adults = 0, children = 0, babies = 0, sort = null) => {
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
  `;
  const queryParams = [category.id, category.id];

  if (departureFrom) {
    sqlConditions += ` AND departures.departureFrom = ?`;
    queryParams.push(departureFrom);
  }

  if (priceLevel) {
    const priceCalc = `(departures.priceAdult - (departures.priceAdult * IFNULL(departures.discountPercentage, 0) / 100))`;
    if (priceLevel === "1") {
      sqlConditions += ` AND ${priceCalc} < 5000000`;
    } else if (priceLevel === "2") {
      sqlConditions += ` AND ${priceCalc} >= 5000000 AND ${priceCalc} <= 10000000`;
    } else if (priceLevel === "3") {
      sqlConditions += ` AND ${priceCalc} > 10000000`;
    }
  }

  if (startDate) {
    sqlConditions += ` AND DATE(departures.startDate) >= ?`;
    queryParams.push(startDate);
  }

  if (adults > 0) {
    sqlConditions += ` AND departures.stockAdult >= ?`;
    queryParams.push(adults);
  }

  if (children > 0) {
    sqlConditions += ` AND departures.stockChildren >= ?`;
    queryParams.push(children);
  }

  if (babies > 0) {
    sqlConditions += ` AND departures.stockBaby >= ?`;
    queryParams.push(babies);
  }

  const sqlTours = ` SELECT tours.id,
        tours.slug,
        tours.title,
        tours.thumbnail,
        tours.time AS time,
        departures.id AS departure_id,
        departures.departureFrom,
        departures.startDate,
        departures.priceAdult AS oldPrice,
        departures.discountPercentage,
        (departures.priceAdult - (departures.priceAdult * IFNULL(departures.discountPercentage, 0) / 100)) AS newPrice,
        (departures.stockAdult + departures.stockChildren + departures.stockBaby) AS slots,
        vehicles.name AS vehicleName,
        vehicles.vehicleType AS vehicleType
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
  const totalPages = Math.ceil(totalTours / limit);
  const offset = (page - 1) * limit;

  let sortQuery = "";
  if (sort === "priceAsc") {
    sortQuery = "ORDER BY newPrice ASC";
  } else if (sort === "priceDesc") {
    sortQuery = "ORDER BY newPrice DESC";
  } else if (sort === "hot") {
    sortQuery = "ORDER BY departures.discountPercentage DESC";
  }

  const [tours] = await pool.query(
    sqlTours + ` ${sortQuery} LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset],
  );

  return {
    category: category,
    tours: tours,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalTours: totalTours
    }
  };
};

module.exports.getDepartureLocations = async () => {
  const sql = `
    SELECT DISTINCT departureFrom 
    FROM departures 
    WHERE deleted = 0 AND status = 'active' AND departureFrom IS NOT NULL AND departureFrom != ''
  `;
  const [rows] = await pool.query(sql);
  return rows.map(row => row.departureFrom);
};
