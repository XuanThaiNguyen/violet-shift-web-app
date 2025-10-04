import { useMe } from "@/states/apis/me";
import { Navigate, Outlet } from "react-router";

import type { ComponentType } from "react";

const PrivateModule = (allowedRoles: string[]): ComponentType => {
  return (() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: user, isLoading } = useMe();
    if (isLoading) {
      return null;
    }
    if (!allowedRoles.includes(user?.role ?? "")) {
      return <Navigate to="/" />;
    }
    return <Outlet />;
  }) as ComponentType;
};

export default PrivateModule;
