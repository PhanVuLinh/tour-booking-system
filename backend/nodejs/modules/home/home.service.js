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
        (departures.stockAdult + departures.stockChildren + departures.stockBaby) AS slots
    FROM tours 
    JOIN departures ON tours.id = departures.tour_id
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
