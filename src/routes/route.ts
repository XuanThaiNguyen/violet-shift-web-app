import { createBrowserRouter } from "react-router";
import AuthorizedLayout from "../layouts/AuthorizedLayout";
import { lazy } from "react";
import PublicLayout from "../layouts/PublicLayout";

const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/login/Login"));
const Register = lazy(() => import("../pages/register/Register"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthorizedLayout,
    children: [
      { index: true, Component: Home },
    ],
  },
  {
    path: "/auth",
    Component: PublicLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  }
]);
