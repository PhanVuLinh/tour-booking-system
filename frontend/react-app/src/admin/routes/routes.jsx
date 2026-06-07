
import { Dashboard } from "../modules/dashboard";
import { TourList } from "../modules/tours";
import { CategoryList } from "../modules/categories";
import { UserList } from "../modules/users";
import { Booking } from "../modules/bookings";
import { Departure } from "../modules/departures";
import { Discount } from "../modules/discounts";
import { Login } from "../modules/login";
import { BlogList } from "../modules/blogs";
import { ReviewList } from "../modules/reviews";
import { BannerList } from "../modules/banners";

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
          {
            path: "/admin/discounts",
            element: <Discount />,
          },
          {
            path: "/admin/blogs",
            element: <BlogList />,
          },
          {
            path: "/admin/reviews",
            element: <ReviewList />,
          },
          {
            path: "/admin/banners",
            element: <BannerList />,
          },
        ],
      },
    ],
  },
];
