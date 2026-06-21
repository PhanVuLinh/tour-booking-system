const { pool } = require("../../config/database");

module.exports.getFlashSales = async () => {
  // const sql = `
  //   select *
  //   from tours join departures on tours.id = departures.tour_id
  //   where tours.deleted = 0 and departures.deleted = 0
  //   ORDER BY departures.startDate ASC

  // `;

  // const sql =
  //   "SELECT * FROM tours JOIN departures ON tours.id = departures.tour_id;";

  const sql = `
    SELECT 
        tours.id,
        tours.slug,
        tours.title,
        tours.thumbnail,
        tours.time AS time,
        departures.startDate,
        departures.priceAdult AS oldPrice,
        departures.discountPercentage,
        (departures.priceAdult - (departures.priceAdult * departures.discountPercentage / 100)) AS newPrice,
        (departures.stockAdult + departures.stockChildren + departures.stockBaby) AS slots,
        vehicles.name AS vehicleName,
        vehicles.vehicleType AS vehicleType
    FROM tours 
    JOIN departures ON tours.id = departures.tour_id
    join vehicles ON vehicles.id = departures.vehicle_id
    WHERE tours.deleted = 0 
      AND tours.status ="active"
      AND departures.deleted = 0
      AND departures.status ="active"
      AND departures.discountPercentage > 0
    ORDER BY departures.startDate ASC
  `;

  const [rows] = await pool.query(sql);

  return rows;
};

module.exports.getForeignTours = async () => {
  const sqlCategory =
    "SELECT id FROM categories WHERE slug = 'tour-quoc-te' AND deleted = 0 AND status = 'active'";
  const [categories] = await pool.query(sqlCategory);
  if (categories.length === 0) return [];
  const parentId = categories[0].id;

  const sqlChildren =
    "SELECT id FROM categories WHERE parent_id = ? AND deleted = 0 AND status = 'active'";
  const [children] = await pool.query(sqlChildren, [parentId]);

  const categoryIds = [parentId, ...children.map((item) => item.id)];

  const sqlTours = `
    SELECT 
        tours.id,
        tours.slug,
        tours.title,
        tours.thumbnail,
        tours.time AS time,
        departures.id AS departure_id,
        departures.startDate,
        departures.priceAdult AS oldPrice,
        departures.discountPercentage,
        (departures.priceAdult - (departures.priceAdult * departures.discountPercentage / 100)) AS newPrice,
        (departures.stockAdult + departures.stockChildren + departures.stockBaby) AS slots,
        vehicles.name AS vehicleName,
        vehicles.vehicleType AS vehicleType
    FROM tours 
    JOIN departures ON tours.id = departures.tour_id
    LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
    WHERE tours.deleted = 0 
      AND tours.status = 'active'
      AND departures.deleted = 0
      AND departures.status = 'active'
      AND tours.category_id IN (?)
    ORDER BY departures.startDate ASC
    LIMIT 8 
  `;

  const [rows] = await pool.query(sqlTours, [categoryIds]);
  return rows;
};
