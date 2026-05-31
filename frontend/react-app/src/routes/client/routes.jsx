import MainLayout from "../../layouts/client/MainLayout";

import Home from "../../pages/client/Home";
import Tour from "../../pages/client/Tours";
import Login from "../../pages/client/Login";
import Register from "../../pages/client/Register";

import Booking from "../../pages/client/Booking";

import PrivateRoute from "./PrivateRoute";

export const clientRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
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
        path: "tours",
        element: <Tour />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "booking",
            element: <Booking />,
          },
        ],
      },
    ],
  },
];
