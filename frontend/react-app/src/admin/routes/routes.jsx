// import Dashboard from "../../pages/admin/Dashboard";
// import Tours from "../../pages/admin/Tours";
// import Categories from "../../pages/admin/Categories";
// import Users from "../../pages/admin/Users";
// import Bookings from "../../pages/admin/Bookings";

// import Login from "../../pages/admin/Login";

// import AdminLayout from "../layouts/MainLayout";
// import AdminAuthLayout from "../layouts/AuthLayout";

import { Dashboard } from "../modules/dashboard";
import { TourList } from "../modules/tours";
import { CategoryList } from "../modules/categories";
import { UserList } from "../modules/users";
import { Booking } from "../modules/bookings";

import { Login } from "../modules/login";

import { MainLayout } from "../layouts";
import { AuthLayout } from "../layouts";

import PrivateRoute from "./PrivateRoute";

export const adminRoutes = [
  {
    element: <AuthLayout />,
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
        element: <MainLayout />,
        children: [
          {
            path: "/admin",
            element: <Dashboard />,
          },
          {
            path: "/admin/tours",
            element: <TourList />,
          },
          {
            path: "/admin/categories",
            element: <CategoryList />,
          },
          {
            path: "/admin/users",
            element: <UserList />,
          },
          {
            path: "/admin/bookings",
            element: <Booking />,
          },
        ],
      },
    ],
  },
];
