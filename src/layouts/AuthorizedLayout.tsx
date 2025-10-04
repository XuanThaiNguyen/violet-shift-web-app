import { Outlet, useNavigate } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import clsx from "clsx";
import useSidebarStore from "../states/app/sidebar";
import { useMe } from "@/states/apis/me";
import { useEffect } from "react";

import type { FC } from "react";

const AuthorizedLayout: FC = () => {
  const { isOpen } = useSidebarStore();
  const { data: user, isLoading } = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    (() => {
      if (isLoading) return;
      if (!user) {
        localStorage.removeItem("auth_token");
        navigate("/auth/login");
        return;
      }

      if (!user?.firstName) {
        navigate("/auth/profile");
      }
    })();
  }, [user, isLoading, navigate]);

  return (
    <div
      className="min-h-screen w-[min(100vw,100%)] bg-background"
      id="app-layout"
    >
      <Sidebar />
      <div
        className={clsx(
          "w-full transition-all duration-300 ",
          isOpen ? "lg:pl-64" : "lg:pl-18"
        )}
        id="app-content"
      >
        <Header />
        <div className="mt-8"></div>

        {isLoading ? (
          <div className="w-full h-[calc(100vh-6rem)] px-4">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/images/loading.gif"
                alt="loading"
                className="w-36 h-36 object-cover"
              />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default AuthorizedLayout;
