import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Breadcrumb } from "../../../shared";
import { getProfile } from "../services/userService";

function ProfileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    auth_provider: null,
  });
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const canChangePassword =
    isProfileLoaded &&
    (!profile.auth_provider || profile.auth_provider === "local");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success) {
          const nextProfile = {
            full_name: response.data.full_name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            auth_provider: response.data.auth_provider || null,
          };

          setProfile(nextProfile);

          const userStr = localStorage.getItem("client_user");
          if (userStr) {
            const user = JSON.parse(userStr);
            localStorage.setItem(
              "client_user",
              JSON.stringify({ ...user, ...nextProfile }),
            );
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Lỗi lấy profile:", error);
      } finally {
        setIsProfileLoaded(true);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_user");
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title="Tài khoản của tôi"
        thumbnail="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
        list={[
          { title: "Trang chủ", url: "/" },
          { title: "Tài khoản", url: "/profile/info" },
        ]}
      />

      <div className="container profile-container">
        <div className="profile-layout">
          <aside className="profile-sidebar b-box">
            <div className="profile-user-brief">
              <div className="pu-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="pu-info">
                <h4>{profile.full_name || "Người dùng"}</h4>
                <span>Thành viên TravelGo</span>
              </div>
            </div>

            <div className="profile-nav">
              <Link
                to="/profile/info"
                className={`profile-nav-link ${
                  location.pathname === "/profile/info" ? "active" : ""
                }`}
              >
                <i className="fa-regular fa-id-card"></i> Thông tin cá nhân
              </Link>
              <Link
                to="/profile/history"
                className={`profile-nav-link ${
                  location.pathname.startsWith("/profile/history")
                    ? "active"
                    : ""
                }`}
              >
                <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử đặt
                tour
              </Link>
              {canChangePassword && (
                <Link
                  to="/profile/change-password"
                  className={`profile-nav-link ${
                    location.pathname === "/profile/change-password"
                      ? "active"
                      : ""
                  }`}
                >
                  <i className="fa-solid fa-lock"></i> Đổi mật khẩu
                </Link>
              )}
              <button
                className="profile-nav-link profile-logout-btn text-red"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng
                xuất
              </button>
            </div>
          </aside>

          <Outlet context={{ profile, setProfile, isProfileLoaded }} />
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
