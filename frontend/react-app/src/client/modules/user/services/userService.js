import { get, put } from "../../../utils/request";

export const getProfile = async () => {
    const result = await get("/user/profile/info");
    return result;
};

export const updateProfile = async (data) => {
    const result = await put("/user/profile/info", data);
    return result;
};

export const changePassword = async (data) => {
    const result = await put("/user/profile/change-password", data);
    return result;
};
