import Dashboard from "../../pages/admin/Dashboard";
import Tours from "../../pages/admin/Tours";
import Categories from "../../pages/admin/Categories";
import Users from "../../pages/admin/Users";
import Bookings from "../../pages/admin/Bookings";

import Login from "../../pages/admin/Login";

import AdminLayout from "../../layouts/admin/MainLayout";
import AdminAuthLayout from "../../layouts/admin/AuthLayout";

import PrivateRoute from "./PrivateRoute";

export const adminRoutes = [
  {
    element: <AdminAuthLayout />,
    children: [
      {
        path: "/admin/login",
        element: <Login />,
      },
    ],
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <Dashboard />,
          },
          {
            path: "/admin/tours",
            element: <Tours />,
          },
          {
            path: "/admin/categories",
            element: <Categories />,
          },
          {
            path: "/admin/users",
            element: <Users />,
          },
          {
            path: "/admin/bookings",
            element: <Bookings />,
          },
        ],
      },
    ],
  },
];
