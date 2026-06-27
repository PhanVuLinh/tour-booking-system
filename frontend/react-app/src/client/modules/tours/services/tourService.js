import { get } from "../../../utils/request";

export const getToursByCategory = async (slug) => {
    const result = await get(`/categories/${slug}`);
    return result;
};

export const getTourDetail = async (slug) => {
    const result = await get(`/tours/detail/${slug}`);
    return result;
};
