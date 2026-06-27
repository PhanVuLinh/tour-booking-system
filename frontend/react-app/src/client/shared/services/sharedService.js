import { get } from "../../utils/request";

export const getHeaderCategories = async () => {
    const result = await get("/categories");
    return result;
};
