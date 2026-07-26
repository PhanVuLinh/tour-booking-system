import { get } from "../../../utils/request";

export const getToursByCategory = async (
  slug,
  page = 1,
  filterParams = {},
  sort = null,
) => {
  const queryParams = new URLSearchParams({ page });

  if (filterParams.departure_from)
    queryParams.append("departure_from", filterParams.departure_from);
  if (filterParams.priceLevel)
    queryParams.append("priceLevel", filterParams.priceLevel);
  if (filterParams.start_date)
    queryParams.append("start_date", filterParams.start_date);
  if (filterParams.adults) queryParams.append("adults", filterParams.adults);
  if (filterParams.children)
    queryParams.append("children", filterParams.children);
  if (filterParams.babies) queryParams.append("babies", filterParams.babies);
  if (sort) queryParams.append("sort", sort);

  const result = await get(`/categories/${slug}?${queryParams.toString()}`);
  return result;
};

export const getDepartureLocations = async () => {
  const result = await get("/categories/departure-locations");
  return result;
};

export const getTourDetail = async (slug) => {
  const result = await get(`/tours/detail/${slug}`);
  return result;
};

export const searchTours = async (filterParams = {}) => {
  const queryParams = new URLSearchParams();

  if (filterParams.destination)
    queryParams.append("destination", filterParams.destination);
  if (filterParams.quantity)
    queryParams.append("quantity", filterParams.quantity);
  if (filterParams.date) queryParams.append("date", filterParams.date);

  const result = await get(`/tours/search?${queryParams.toString()}`);
  return result;
};
