import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { updateProfile } from "../services/userService";
import { validateProfileForm } from "../validations/user.validator";

function ProfileInfo() {
  const { profile, setProfile } = useOutletContext();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      fullName: profile.fullName || "",
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
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      if (response.success) {
        const nextProfile = {
          ...profile,
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
        };

        setProfile(nextProfile);
        toast.success("Cập nhật thông tin cá nhân thành công!");

        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.fullName = nextProfile.fullName;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        toast.error("Cập nhật thất bại: " + response.message);
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ. Vui lòng thử lại sau!");
    }
  };

  return (
    <main className="profile-main b-box">
      <div className="profile-header">
        <h2 className="profile-title">Hồ sơ của tôi</h2>
        <p className="profile-desc">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <div className="profile-form-wrapper">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Email đăng nhập</label>
            <div className="input-with-icon">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                className="b-input"
                value={formData.email}
                disabled
                style={{
                  backgroundColor: "#eaeaea",
                  color: "#888",
                  paddingLeft: "45px",
                  borderRadius: "10px",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#888",
                marginTop: "4px",
              }}
            >
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
                name="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  setErrors({ ...errors, fullName: "" });
                }}
                placeholder="Nhập họ và tên"
                required
              />
              {errors.fullName && (
                <span className="error-text">
                  <i
                    className="fa-solid fa-circle-exclamation"
                    style={{ marginRight: "4px" }}
                  ></i>
                  {errors.fullName}
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
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: "" });
                }}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <span className="error-text">
                  <i
                    className="fa-solid fa-circle-exclamation"
                    style={{ marginRight: "4px" }}
                  ></i>
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn-save-profile">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ProfileInfo;
