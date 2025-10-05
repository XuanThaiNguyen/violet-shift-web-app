import { useEffect } from "react";
import api from "@/services/api/http";
import { addToast } from "@heroui/react";

import type { FC } from "react";

const AcceptInvitation: FC = () => {
  useEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(window.location.search);
      console.log("🚀 ~ searchParams:", searchParams)
      const token = searchParams.get("token");
      console.log("🚀 ~ token ne:", token);
      if (!token) {
        return;
      }
      try {
        const response = await api.get("/api/v1/staffs/accept-invitation", {
          params: {
            token,
          },
        });

        if (response.token) {
          addToast({
            title: "Accept invitation successful",
            description: "Please set a new password",
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
          return window.history.replaceState({}, "", `/auth/new-password?token=${response.token}`);
        } else {
          addToast({
            title: "Accept invitation failed",
            description: "Please try again",
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
          return window.history.replaceState({}, "", "/auth/login");
        }
      } catch {
        addToast({
          title: "Accept invitation failed",
          description: "Please try again",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
        return window.history.replaceState({}, "", "/auth/login");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default AcceptInvitation;
