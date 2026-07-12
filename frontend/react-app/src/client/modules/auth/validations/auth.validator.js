export const validateRegisterForm = (userData) => {
  const errors = {};

  if (!userData.fullName || userData.fullName.trim() === "") {
    errors.fullName = "Họ và tên không được để trống";
  }

  if (!userData.email || userData.email.trim() === "") {
    errors.email = "Email không được để trống";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      errors.email = "Email không đúng định dạng.";
    }
  }

  if (!userData.password || userData.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  if (
    !userData.confirmPassword ||
    userData.confirmPassword !== userData.password
  ) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateLoginForm = (userData) => {
  const { email, password } = userData;
  const errors = {};
  if (!email || email.trim() === "") {
    errors.email = "Vui lòng nhập email.";
  }
  if (!password || password.trim() === "") {
    errors.password = "Vui lòng nhập mật khẩu.";
  }
  return Object.keys(errors).length > 0 ? errors : null;
};
