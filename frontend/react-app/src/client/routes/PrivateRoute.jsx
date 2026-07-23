import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

function PrivateRoute() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    localStorage.removeItem("user");
  }

  const isLogin = Boolean(token && user);

  useEffect(() => {
    if (!isLogin) {
      toast.warning("Vui lòng đăng nhập để sử dụng chức năng này", {
        id: "private-route-login-required",
      });
    }
  }, [isLogin]);

  if (!isLogin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return <Outlet />;
}

export default PrivateRoute;
