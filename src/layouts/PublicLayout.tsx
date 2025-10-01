import type { FC } from "react";
import { Outlet } from "react-router";

const PublicLayout: FC = () => {
  return (
    <div className="min-h-screen w-[min(100vw,100%)] bg-background">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
