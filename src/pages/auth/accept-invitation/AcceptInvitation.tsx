import { addToast } from "@heroui/react";
import { useEffect } from "react";

import api from "@/services/api/http";
import type { FC } from "react";
import { useNavigate } from "react-router";

const AcceptInvitation: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(window.location.search);
      console.log("🚀 ~ searchParams:", searchParams);
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
            title: "Accept invitation successfully",
            description: "Please set a new password",
            color: "success",
            timeout: 2000,
            isClosing: true,
          });
          return navigate(`/auth/new-password?token=${response.token}`, {
            replace: true,
          });
        }

        addToast({
          title: "Accept invitation failed",
          description: "Please try again",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
        return navigate("/auth/login", { replace: true });
      } catch {
        addToast({
          title: "Accept invitation failed",
          description: "Please try again",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
        return navigate("/auth/login", { replace: true });
      }
    })();
  }, [navigate]);

  return <></>;
};

export default AcceptInvitation;
