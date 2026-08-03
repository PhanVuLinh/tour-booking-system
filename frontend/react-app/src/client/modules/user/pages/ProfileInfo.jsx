import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { updateProfile } from "../services/userService";
import { validateProfileForm } from "../validations/user.validator";

function ProfileInfo() {
  const { profile, setProfile, isProfileLoaded } = useOutletContext();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData({
      full_name: profile.full_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
    });
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateProfileForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }

    try {
      const response = await updateProfile({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
      });

      if (response.success) {
        const nextProfile = {
          ...profile,
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
        };

        setProfile(nextProfile);
        setIsEditing(false);
        toast.success("Cập nhật thông tin cá nhân thành công!");

        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.full_name = nextProfile.full_name;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        toast.error("Cập nhật thất bại: " + response.message);
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ. Vui lòng thử lại sau!");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      full_name: profile.full_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  if (isProfileLoaded === false) {
    return (
      <main className="profile-main b-box">
        <div className="client-loading-state" style={{ padding: "60px 0" }}>
          <div className="client-spinner"></div>
          <p>Đang tải thông tin cá nhân...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-main b-box">
      <div className="profile-header">
        <div>
          <h2 className="profile-title">Hồ sơ của tôi</h2>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="btn-edit-profile"
            onClick={() => setIsEditing(true)}
          >
            <i className="fa-regular fa-pen-to-square"></i> Chỉnh sửa
          </button>
        )}
      </div>

      <div className="profile-form-wrapper">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Email đăng nhập</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                className="b-input profile-email-input"
                value={formData.email}
                disabled
              />
            </div>
            <span className="profile-field-note">
              Email không thể thay đổi.
            </span>
          </div>

          <div className="b-grid-2">
            <div className="form-group">
              <label className="form-label">
                Họ và tên <span className="text-red">(*)</span>
              </label>
              <input
                type="text"
                className="b-input"
                name="full_name"
                value={formData.full_name}
                disabled={!isEditing}
                onChange={(e) => {
                  setFormData({ ...formData, full_name: e.target.value });
                  setErrors({ ...errors, full_name: "" });
                }}
                placeholder="Nhập họ và tên"
                required
              />
              {errors.full_name && (
                <span className="error-text">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {errors.full_name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="b-input"
                name="phone"
                value={formData.phone}
                disabled={!isEditing}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: "" });
                }}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <span className="error-text">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button
                type="button"
                className="btn-cancel-profile"
                onClick={handleCancelEdit}
              >
                Hủy
              </button>
              <button type="submit" className="btn-save-profile">
                Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default ProfileInfo;
