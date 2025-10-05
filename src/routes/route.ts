import { createBrowserRouter } from "react-router";
import AuthorizedLayout from "@/layouts/AuthorizedLayout";
import { lazy } from "react";
import PublicLayout from "@/layouts/PublicLayout";
import NotFound from "@/pages/notfound/NotFound";
import PrivateModule from "@/hoc/PrivateModule";
import { ROLE_IDS } from "@/constants/roles";

const Home = lazy(() => import("@/pages/home/Home"));
const Login = lazy(() => import("@/pages/auth/login/Login"));
// const Register = lazy(() => import("@/pages/auth/register/Register"));
const ForgotPassword = lazy(
  () => import("@/pages/auth/forgot-password/ForgotPassword")
);
const NewPassword = lazy(() => import("@/pages/auth/new-password/NewPassword"));
const AcceptInvitation = lazy(() => import("@/pages/auth/accept-invitation/AcceptInvitation"));
const ProfileSetup = lazy(() => import("@/pages/auth/profile/Profile"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Scheduler = lazy(() => import("@/pages/scheduler/Scheduler"));
const StaffList = lazy(() => import("@/pages/staffs/StaffList"));
const AddStaff = lazy(() => import("@/pages/staffs/AddStaff"));
const ClientList = lazy(() => import("@/pages/clients/ClientList"));
const AddClient = lazy(() => import("@/pages/clients/AddClient"));

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: PublicLayout,
    children: [
      { path: "login", Component: Login },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "new-password", Component: NewPassword },
      { path: "profile", Component: ProfileSetup },
      { path: "accept-invitation", Component: AcceptInvitation },
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
      {
        path: "staffs",
        Component: PrivateModule([
          ROLE_IDS.ADMIN,
          ROLE_IDS.COORDINATOR,
          ROLE_IDS.OFFICE_SUPPORT,
          ROLE_IDS.HR,
        ]),
        children: [
          { path: "list", Component: StaffList },
          { path: "new", Component: AddStaff },
        ],
      },
      {
        path: "clients",
        Component: PrivateModule([ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR]),
        children: [
          { path: "list", Component: ClientList },
          { path: "new", Component: AddClient },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
