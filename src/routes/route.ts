import { createBrowserRouter } from "react-router";
import AuthorizedLayout from "@/layouts/AuthorizedLayout";
import { lazy } from "react";
import PublicLayout from "@/layouts/PublicLayout";
import NotFound from "@/pages/notfound/NotFound";

const Home = lazy(() => import("@/pages/home/Home"));
const Login = lazy(() => import("@/pages/auth/login/Login"));
// const Register = lazy(() => import("@/pages/auth/register/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/forgot-password/ForgotPassword"));
const NewPassword = lazy(() => import("@/pages/auth/new-password/NewPassword"));
const ProfileSetup = lazy(() => import("@/pages/auth/profile/Profile"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Scheduler = lazy(() => import("@/pages/scheduler/Scheduler"));

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: PublicLayout,
    children: [
      { path: "login", Component: Login },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "new-password", Component: NewPassword },
      { path: "profile", Component: ProfileSetup },
    //   { path: "register", Component: Register },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/",
    Component: AuthorizedLayout,
    children: [
      { index: true, Component: Home },
      { path: "profile", Component: Profile },
      { path: "scheduler", Component: Scheduler },
      { path: "*", Component: NotFound },
    ],
  },
]);
