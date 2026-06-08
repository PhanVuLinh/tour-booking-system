import { MainLayout } from "../layouts";

import { Home } from "../modules/home";

import { TourList, TourDetail } from "../modules/tours";

// import { LoginPage, RegisterPage } from "../modules/auth";

import { OrderBooking } from "../modules/booking";

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

      // {
      //   path: "login",
      //   element: <Login />,
      // },

      // {
      //   path: "register",
      //   element: <Register />,
      // },

      {
        path: "tours",
        element: <TourList />,
      },

      {
        path: "tours/detail",
        element: <TourDetail />,
      },

      {
        element: <PrivateRoute />,
        children: [
          {
            path: "booking",
            element: <OrderBooking />,
            children: [
              { path: "info", element: <BookingInfoPage /> },
              { path: "payment", element: <BookingPaymentPage /> },
              { path: "success", element: <BookingSuccessPage /> },
            ],
          },
        ],
      },
    ],
  },
];
