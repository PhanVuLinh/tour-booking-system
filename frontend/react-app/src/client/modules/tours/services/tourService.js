import { get } from "../../../utils/request";

export const getToursByCategory = async (slug, page = 1, filterParams = {}) => {
    const queryParams = new URLSearchParams({ page });

    if (filterParams.departureFrom) queryParams.append('departureFrom', filterParams.departureFrom);
    if (filterParams.priceLevel) queryParams.append('priceLevel', filterParams.priceLevel);
    if (filterParams.startDate) queryParams.append('startDate', filterParams.startDate);
    if (filterParams.adults) queryParams.append('adults', filterParams.adults);
    if (filterParams.children) queryParams.append('children', filterParams.children);
    if (filterParams.babies) queryParams.append('babies', filterParams.babies);

    const result = await get(`/categories/${slug}?${queryParams.toString()}`);
    return result;
};

export const getDepartureLocations = async () => {
    const result = await get('/categories/departure-locations');
    return result;
};

export const getTourDetail = async (slug) => {
    const result = await get(`/tours/detail/${slug}`);
    return result;
};
