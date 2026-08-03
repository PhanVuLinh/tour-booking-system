import React, { useState } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { changePassword } from "../services/userService";
import { validateChangePasswordForm } from "../validations/user.validator";

function ProfileChangePassword() {
  const { profile, isProfileLoaded } = useOutletContext();

  const canChangePassword =
    isProfileLoaded &&
    (!profile.auth_provider || profile.auth_provider === "local");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateChangePasswordForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }

    try {
      const response = await changePassword(formData);
      if (response.success) {
        toast.success(response.message || "Đổi mật khẩu thành công");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        toast.error(response.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ. Vui lòng thử lại sau!");
    }
  };

  if (!isProfileLoaded) {
    return (
      <main className="profile-main b-box">
        <div className="profile-header">
          <h2 className="profile-title">Đổi mật khẩu</h2>
        </div>

        <div className="profile-form-wrapper">
          <div className="client-loading-state">
            <div className="client-spinner"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!canChangePassword) {
    return <Navigate to="/profile/info" replace />;
  }

  return (
    <main className="profile-main b-box">
      <div className="profile-header">
        <div>
          <h2 className="profile-title">Đổi mật khẩu</h2>
        </div>
      </div>

      <div className="profile-form-wrapper">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Mật khẩu hiện tại</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword.currentPassword ? "text" : "password"}
                className="b-input password-input"
                value={formData.currentPassword}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    currentPassword: e.target.value,
                  });
                  setErrors({ ...errors, currentPassword: "" });
                }}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <i
                className={`fa-regular ${
                  showPassword.currentPassword ? "fa-eye" : "fa-eye-slash"
                } show-pass`}
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    currentPassword: !showPassword.currentPassword,
                  })
                }
              ></i>
            </div>
            {errors.currentPassword && (
              <span className="error-text">
                <i className="fa-solid fa-circle-exclamation"></i>
                {errors.currentPassword}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu mới</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword.newPassword ? "text" : "password"}
                className="b-input password-input"
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData({ ...formData, newPassword: e.target.value });
                  setErrors({ ...errors, newPassword: "" });
                }}
                placeholder="Nhập mật khẩu mới"
              />
              <i
                className={`fa-regular ${
                  showPassword.newPassword ? "fa-eye" : "fa-eye-slash"
                } show-pass`}
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    newPassword: !showPassword.newPassword,
                  })
                }
              ></i>
            </div>
            {errors.newPassword && (
              <span className="error-text">
                <i className="fa-solid fa-circle-exclamation"></i>
                {errors.newPassword}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu mới</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                className="b-input password-input"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  });
                  setErrors({ ...errors, confirmPassword: "" });
                }}
                placeholder="Nhập lại mật khẩu mới"
              />
              <i
                className={`fa-regular ${
                  showPassword.confirmPassword ? "fa-eye" : "fa-eye-slash"
                } show-pass`}
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirmPassword: !showPassword.confirmPassword,
                  })
                }
              ></i>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">
                <i className="fa-solid fa-circle-exclamation"></i>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn-save-profile">
              Lưu mật khẩu mới
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ProfileChangePassword;
