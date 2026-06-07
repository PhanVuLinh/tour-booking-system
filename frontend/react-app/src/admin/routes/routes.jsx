
import { Dashboard } from "../modules/dashboard";
import { TourList } from "../modules/tours";
import { CategoryList } from "../modules/categories";
import { UserList } from "../modules/users";
import { Booking } from "../modules/bookings";
import { Departure } from "../modules/departures";

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
          {
            path: "/admin/departures",
            element: <Departure />,
          },
        ],
      },
    ],
  },
];
