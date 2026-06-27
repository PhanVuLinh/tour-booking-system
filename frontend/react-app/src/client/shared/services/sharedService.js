import { get, post } from "../../utils/request";

export const getHeaderCategories = async () => {
    const result = await get("/categories");
    return result;
};

export const postCreateContact = async (email) => {
    const result = await post("/contacts/create", { email });
    return result;
}