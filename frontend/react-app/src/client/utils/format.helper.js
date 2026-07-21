import moment from "moment";

// Format tiền tệ dạng "1.500.000 đ"
export const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("vi-VN") + " đ";
};

// Format tiền tệ chuẩn VND dạng "1.500.000 ₫"
export const formatCurrency = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price || 0);
};

// Format ngày tháng dùng moment
export const formatDate = (dateString, pattern = "DD/MM/YYYY") => {
  if (!dateString) return "";
  return moment(dateString).format(pattern);
};

// Format số có phân cách hàng nghìn "1.500.000"
export const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("vi-VN");
};
