import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const isAdmin = true;

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" />;
}

export default PrivateRoute;
