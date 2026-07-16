import { Navigate } from "react-router-dom";

import { MainLayout } from "../layouts";

import { Home } from "../modules/home";

import { TourList, TourDetail, SearchPage } from "../modules/tours";

import { OrderBooking } from "../modules/booking/layouts";

import { BlogList, BlogDetail } from "../modules/blog/pages";

import { SupportPage } from "../modules/support/pages";

import {
  Login,
  Register,
  ForgotPassword,
  VerifyOTP,
  ResetPassword,
} from "../modules/auth";

import {
  BookingInfo,
  BookingPayment,
  BookingSuccess,
} from "../modules/booking";

import PrivateRoute from "./PrivateRoute";

export const clientRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },

      {
        path: "verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },

      {
        path: "category/:slug",
        element: <TourList />,
      },

      {
        path: "tours/detail/:slug",
        element: <TourDetail />,
      },

      {
        path: "blog",
        element: <BlogList />,
      },

      {
        path: "blog/detail/:slug",
        element: <BlogDetail />,
      },

      {
        path: "support",
        element: <SupportPage />,
      },

      {
        element: <PrivateRoute />,
        children: [
          {
            path: "booking",
            element: <OrderBooking />,
            children: [
              {
                path: "info",
                element: <BookingInfo />,
              },
              {
                ath: "payment",
                element: <BookingPayment />,
              },
              {
                path: "success",
                element: <BookingSuccess />,
              },
            ],
          },
        ],
      },
    ],
  },
];
