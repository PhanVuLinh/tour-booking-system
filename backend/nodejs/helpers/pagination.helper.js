module.exports.getPagination = (page, limit, defaultLimit = 9) => {
  let currentPage = Number.parseInt(page, 10);
  let pageLimit = Number.parseInt(limit, 10);

  if (Number.isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }

  if (Number.isNaN(pageLimit) || pageLimit < 1) {
    pageLimit = defaultLimit;
  }

  const offset = (currentPage - 1) * pageLimit;

  return {
    currentPage,
    pageLimit,
    offset,
  };
};

module.exports.getPaginationMeta = (totalItems, currentPage, pageLimit) => {
  const total = Number(totalItems) || 0;

  return {
    currentPage,
    totalPages: Math.max(Math.ceil(total / pageLimit), 1),
    totalItems: total,
    limit: pageLimit,
  };
};
