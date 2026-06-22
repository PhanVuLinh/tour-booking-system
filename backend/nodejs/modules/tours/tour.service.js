// const { pool } = require("../../config/database");

// module.exports.getTourDetailBySlug = async (slug) => {
//   const sqlTour = `
//     SELECT
//         tours.id,
//         tours.title,
//         tours.slug,
//         tours.thumbnail,
//         tours.description,
//         tours.time,
//         categories.title AS categoryName,
//         categories.slug AS categorySlug,
//         categories.thumbnail as categoryThumbnail
//     FROM tours
//     LEFT JOIN categories ON tours.category_id = categories.id
//     WHERE tours.slug = ?
//       AND tours.deleted = 0
//       AND tours.status = 'active'
//   `;

//   const [tours] = await pool.query(sqlTour, [slug]);

//   if (tours.length === 0) {
//     return null;
//   }

//   const tour = tours[0];

//   const sqlDepartures = `
//     SELECT
//         departures.id AS departure_id,
//         departures.startDate,
//         departures.priceAdult,
//         departures.priceChildren,
//         departures.priceBaby,
//         departures.discountPercentage,
//         -- Tính giá mới sau khi giảm cho từng loại vé
//         (departures.priceAdult - (departures.priceAdult * departures.discountPercentage / 100)) AS newPriceAdult,
//         (departures.priceChildren - (departures.priceChildren * departures.discountPercentage / 100)) AS newPriceChildren,
//         (departures.priceBaby - (departures.priceBaby * departures.discountPercentage / 100)) AS newPriceBaby,
//         -- Tổng số chỗ còn nhận
//         (departures.stockAdult + departures.stockChildren + departures.stockBaby) AS slots,
//         vehicles.name AS vehicleName,
//         vehicles.vehicleType AS vehicleType
//     FROM departures
//     LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
//     WHERE departures.tour_id = ?
//       AND departures.deleted = 0
//       AND departures.status = 'active'
//     ORDER BY departures.startDate ASC
//   `;

//   const [departures] = await pool.query(sqlDepartures, [tour.id]);

//   return {
//     ...tour,
//     departures: departures,
//   };
// };

const { pool } = require("../../config/database");

module.exports.getTourDetailBySlug = async (slug) => {
  const sqlTour = `
    SELECT 
        tours.id,
        tours.title,
        tours.slug,
        tours.thumbnail,
        tours.description,
        tours.time,
        
        -- Thông tin danh mục hiện tại (c1)
        c1.title AS categoryTitle,
        c1.slug AS categorySlug,
        c1.thumbnail AS categoryThumbnail,
        
        -- Thông tin danh mục cha (c2)
        c2.title AS parentTitle,
        c2.slug AS parentSlug
    FROM tours
    LEFT JOIN categories c1 ON tours.category_id = c1.id
    LEFT JOIN categories c2 ON c1.parent_id = c2.id
    WHERE tours.slug = ? 
      AND tours.deleted = 0 
      AND tours.status = 'active'
  `;

  const [tours] = await pool.query(sqlTour, [slug]);

  if (tours.length === 0) {
    return null;
  }

  const row = tours[0];

  const formattedTour = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    thumbnail: row.thumbnail,
    description: row.description,
    time: row.time,
    category: {
      title: row.categoryTitle,
      slug: row.categorySlug,
      thumbnail: row.categoryThumbnail,
      parentTitle: row.parentTitle,
      parentSlug: row.parentSlug,
    },
  };

  const sqlDepartures = `
    SELECT 
        departures.id AS departure_id,
        departures.startDate,
        departures.priceAdult,
        departures.priceChildren,
        departures.priceBaby,
        departures.discountPercentage,
        (departures.priceAdult - (departures.priceAdult * departures.discountPercentage / 100)) AS newPriceAdult,
        (departures.priceChildren - (departures.priceChildren * departures.discountPercentage / 100)) AS newPriceChildren,
        (departures.priceBaby - (departures.priceBaby * departures.discountPercentage / 100)) AS newPriceBaby,
        (departures.stockAdult + departures.stockChildren + departures.stockBaby) AS slots,
        vehicles.name AS vehicleName,
        vehicles.vehicleType AS vehicleType
    FROM departures
    LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
    WHERE departures.tour_id = ? 
      AND departures.deleted = 0 
      AND departures.status = 'active'
    ORDER BY departures.startDate ASC
  `;

  const [departures] = await pool.query(sqlDepartures, [row.id]);

  const sqlSchedules = `
    SELECT 
        id, 
        day_number, 
        title, 
        content
    FROM schedules
    WHERE tour_id = ? 
      AND deleted = 0
    ORDER BY day_number ASC
  `;
  const [schedules] = await pool.query(sqlSchedules, [row.id]);

  return {
    ...formattedTour,
    departures: departures,
    schedules: schedules,
  };
};
