export const buildCategoryBreadcrumb = (category, currentSlug) => {
  const list = [{ url: "/", title: "Trang Chủ" }];

  if (!category && !currentSlug) return list;

  if (category?.parentTitle) {
    list.push({
      url: `/category/${category.parentSlug}`,
      title: category.parentTitle,
    });
  }

  list.push({
    url: `/category/${currentSlug || category?.slug}`,
    title: category?.title || "Danh mục",
  });

  return list;
};

export const buildTourDetailBreadcrumb = (tour, currentSlug) => {
  const list = buildCategoryBreadcrumb(tour?.category, tour?.category?.slug);

  if (tour || currentSlug) {
    list.push({
      url: `/tour/${currentSlug || tour?.slug}`,
      title: tour?.title || "Chi tiết tour",
    });
  }

  return list;
};
