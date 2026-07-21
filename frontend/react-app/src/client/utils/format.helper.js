import moment from "moment";

export const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("vi-VN") + " đ";
};

export const formatDate = (dateString, pattern = "DD/MM/YYYY") => {
  if (!dateString) return "";
  return moment(dateString).format(pattern);
};
