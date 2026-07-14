import { get } from "../../../utils/request";

export const getBlogList = async (params) => {
  const queryParams = new URLSearchParams(params).toString();

  const result = await get(`/blog/list?${queryParams}`);
  return result;
};

export const getBlogDetail = async (slug) => {
  const result = await get(`/blog/detail/${slug}`);
  return result;
};
