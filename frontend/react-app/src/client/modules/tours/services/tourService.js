import { get } from "../../../utils/request";

export const getToursByCategory = async (slug, page = 1) => {
    const result = await get(`/categories/${slug}?page=${page}`);
    return result;
};

export const getTourDetail = async (slug) => {
    const result = await get(`/tours/detail/${slug}`);
    return result;
};
