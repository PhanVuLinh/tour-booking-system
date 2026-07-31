const { pool } = require("../../config/database");

module.exports.getFlashSales = async () => {
  const sql = `
    SELECT 
        tours.id,
        tours.slug,
        tours.title,
        tours.thumbnail,
        tours.time AS time,
        departures.id as departure_id,
        departures.departure_from,
        departures.start_date,
        departures.price_adult AS oldPrice,
        departures.discount_percentage,
        (departures.price_adult - (departures.price_adult * departures.discount_percentage / 100)) AS newPrice,
        (departures.stock_adult + departures.stock_children + departures.stock_baby) AS slots,
        vehicles.name AS vehicleName,
        vehicles.vehicle_type AS vehicle_type
    FROM tours 
    JOIN departures ON tours.id = departures.tour_id
    LEFT JOIN vehicles ON vehicles.id = departures.vehicle_id
    WHERE tours.deleted = 0 
      AND tours.status ='active'
      AND departures.deleted = 0
      AND departures.status ='active'
      AND departures.discount_percentage > 0
      AND departures.start_date >= NOW()
      AND departures.start_date <= DATE_ADD(NOW(), INTERVAL 30 DAY)
    ORDER BY departures.start_date ASC, departures.discount_percentage DESC
    LIMIT 10
  `;

  const [rows] = await pool.query(sql);

  return rows;
};

module.exports.getDomesticTours = async () => {
  const sqlCategory =
    "SELECT id FROM categories WHERE slug = 'tour-trong-nuoc' AND deleted = 0 AND status = 'active'";
  const [categories] = await pool.query(sqlCategory);
  if (categories.length === 0) return [];
  const parent_id = categories[0].id;

  const sqlChildren =
    "SELECT id FROM categories WHERE parent_id = ? AND deleted = 0 AND status = 'active'";
  const [children] = await pool.query(sqlChildren, [parent_id]);

  const categoryIds = [parent_id, ...children.map((item) => item.id)];

  const sqlTours = `
    SELECT 
        tours.id,
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
    FROM tours 
    JOIN departures ON tours.id = departures.tour_id
    LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
    WHERE tours.deleted = 0 
      AND tours.status = 'active'
      AND departures.deleted = 0
      AND departures.status = 'active'
      AND departures.start_date >= NOW()
      AND tours.category_id IN (?)
    ORDER BY departures.start_date ASC
    LIMIT 8 
  `;

  const [rows] = await pool.query(sqlTours, [categoryIds]);
  return rows;
};

module.exports.getForeignTours = async () => {
  const sqlCategory =
    "SELECT id FROM categories WHERE slug = 'tour-quoc-te' AND deleted = 0 AND status = 'active'";
  const [categories] = await pool.query(sqlCategory);
  if (categories.length === 0) return [];
  const parent_id = categories[0].id;

  const sqlChildren =
    "SELECT id FROM categories WHERE parent_id = ? AND deleted = 0 AND status = 'active'";
  const [children] = await pool.query(sqlChildren, [parent_id]);

  const categoryIds = [parent_id, ...children.map((item) => item.id)];

  const sqlTours = `
    SELECT 
        tours.id,
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
    FROM tours 
    JOIN departures ON tours.id = departures.tour_id
    LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
    WHERE tours.deleted = 0 
      AND tours.status = 'active'
      AND departures.deleted = 0
      AND departures.status = 'active'
      AND departures.start_date >= NOW()
      AND tours.category_id IN (?)
    ORDER BY departures.start_date ASC
    LIMIT 8 
  `;

  const [rows] = await pool.query(sqlTours, [categoryIds]);
  return rows;
};

module.exports.getBlogs = async () => {
  const sql = `SELECT id,title,slug,thumbnail,description,created_at 
      FROM blogs 
      WHERE deleted = 0 
        AND status = 'active' 
      ORDER BY created_at DESC
      LIMIT 5`;

  const [rows] = await pool.query(sql);

  return rows;
};
