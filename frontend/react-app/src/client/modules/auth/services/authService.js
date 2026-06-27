import { post } from "../../../utils/request";

export const register = async (options) => {
    const result = await post("/register", options);
    return result;
};
