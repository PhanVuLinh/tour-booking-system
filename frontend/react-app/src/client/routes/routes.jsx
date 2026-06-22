import { Navigate } from "react-router-dom";

import { MainLayout } from "../layouts";

import { Home } from "../modules/home";

import { TourList, TourDetail } from "../modules/tours";

import { OrderBooking } from "../modules/booking/layouts";

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
        element: <PrivateRoute />,
        children: [
          {
            path: "booking",
            element: <OrderBooking />,
            children: [
              { index: true, element: <Navigate to="info" replace /> },
              { path: "info", element: <BookingInfo /> },
              { path: "payment", element: <BookingPayment /> },
              { path: "success", element: <BookingSuccess /> },
            ],
          },
        ],
      },
    ],
  },
];
