import { Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import clsx from "clsx";
import useSidebarStore from "../states/app/sidebar";

import type { FC } from "react";

const AuthorizedLayout: FC = () => {
  const { isOpen } = useSidebarStore();
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
        <div className="mt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthorizedLayout;
