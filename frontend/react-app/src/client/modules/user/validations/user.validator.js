export const validateProfileForm = (formData) => {
  const errors = {};
  const full_name = formData.full_name?.trim() || "";
  const phone = formData.phone?.trim() || "";

  if (!full_name) {
    errors.full_name = "Họ và tên không được để trống";
  } else if (full_name.length < 2) {
    errors.full_name = "Họ và tên phải có ít nhất 2 ký tự";
  } else if (full_name.length > 100) {
    errors.full_name = "Họ và tên không được vượt quá 100 ký tự";
  }

  if (phone) {
    const phoneRegex = /^(84|0[35789])[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateChangePasswordForm = (formData) => {
  const errors = {};
  const currentPassword = formData.currentPassword || "";
  const newPassword = formData.newPassword || "";
  const confirmPassword = formData.confirmPassword || "";

  if (!currentPassword.trim()) {
    errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
  }

  if (!newPassword || newPassword.length < 6) {
    errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
  } else if (newPassword === currentPassword) {
    errors.newPassword = "Mật khẩu mới không được trùng mật khẩu hiện tại";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
