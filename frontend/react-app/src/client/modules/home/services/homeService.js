import { get } from "../../../utils/request";

export const getBlogs = async () => {
    const result = await get("/home/blogs");
    return result;
};

export const getFlashSales = async () => {
    const result = await get("/home/flash-sales");
    return result;
};

export const getForeignTours = async () => {
    const result = await get("/home/foreign-tours");
    return result;
};

export const getDomesticTours = async () => {
    const result = await get("/home/domestic-tours");
    return result;
};
