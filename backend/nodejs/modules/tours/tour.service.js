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
        departures.departure_from,
        departures.start_date,
        departures.price_adult,
        departures.price_children,
        departures.price_baby,
        departures.discount_percentage,
        (departures.price_adult - (departures.price_adult * departures.discount_percentage / 100)) AS newPriceAdult,
        (departures.price_children - (departures.price_children * departures.discount_percentage / 100)) AS newPriceChildren,
        (departures.price_baby - (departures.price_baby * departures.discount_percentage / 100)) AS newPriceBaby,
        (departures.stock_adult + departures.stock_children + departures.stock_baby) AS slots,
        vehicles.name AS vehicleName,
        vehicles.vehicle_type AS vehicle_type
    FROM departures
    LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
    WHERE departures.tour_id = ? 
      AND departures.deleted = 0 
      AND departures.status = 'active'
      AND departures.start_date >= NOW()
    ORDER BY departures.start_date ASC
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

  const sqlGalleries = `
    SELECT
        id,
        image_url
    FROM tour_images
    WHERE tour_id = ?
      AND deleted = 0
    ORDER BY id ASC
  `;
  const [galleries] = await pool.query(sqlGalleries, [row.id]);

  return {
    ...formattedTour,
    departures: departures,
    schedules: schedules,
    galleries: galleries,
  };
};

module.exports.searchTours = async ({
  destination,
  quantity,
  date,
  page = 1,
  limit = 8,
}) => {
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const pageLimit = Math.max(Number.parseInt(limit, 10) || 8, 1);
  const offset = (currentPage - 1) * pageLimit;

  let sql = `
    FROM tours
    LEFT JOIN categories ON tours.category_id = categories.id
    JOIN departures ON tours.id = departures.tour_id
    LEFT JOIN vehicles ON departures.vehicle_id = vehicles.id
    WHERE tours.deleted = 0
      AND tours.status = 'active'
      AND departures.deleted = 0
      AND departures.status = 'active'
      AND departures.start_date >= NOW()
  `;
  const queryParams = [];

  if (destination?.trim()) {
    const keyword = `%${destination.trim()}%`;
    sql += `
    AND (
      tours.title LIKE ?
      OR categories.title LIKE ?
    )
  `;
    queryParams.push(keyword, keyword);
  }

  if (date) {
    sql += ` AND DATE(departures.start_date) = ?`;
    queryParams.push(date);
  }

  if (quantity) {
    const num = Number.parseInt(quantity, 10);
    if (!Number.isNaN(num) && num > 0) {
      sql += `
      AND (
        departures.stock_adult +
        departures.stock_children +
        departures.stock_baby
      ) >= ?
    `;
      queryParams.push(num);
    }
  }

  const countSql = `
    SELECT COUNT(*) AS totalTours
    ${sql}
  `;

  const [countRows] = await pool.query(countSql, queryParams);

  const totalTours = Number(countRows[0].totalTours);
  const totalPages = Math.max(Math.ceil(totalTours / pageLimit), 1);

  const dataSql = `
    SELECT
      tours.id,
      tours.slug,
      tours.title,
      tours.thumbnail,
      tours.time,

      departures.id AS departure_id,
      departures.departure_from,
      departures.start_date,
      departures.price_adult AS oldPrice,
      departures.discount_percentage,

      (
        departures.price_adult -
        (
          departures.price_adult *
          IFNULL(departures.discount_percentage, 0) / 100
        )
      ) AS newPrice,

      (
        departures.stock_adult +
        departures.stock_children +
        departures.stock_baby
      ) AS slots,

      vehicles.name AS vehicleName,
      vehicles.vehicle_type AS vehicle_type

    ${sql}

    ORDER BY
      departures.start_date ASC,
      tours.created_at DESC

    LIMIT ? OFFSET ?
  `;

  const dataParams = [...queryParams, pageLimit, offset];

  const [tours] = await pool.query(dataSql, dataParams);
  return {
    tours: tours,
    pagination: {
      currentPage: currentPage,
      totalPages: totalPages,
      totalTours: totalTours,
      limit: pageLimit,
    },
  };
};
