import { useQuery } from "@tanstack/react-query";
import api from "@/services/api/http";
import type { User } from "@/types/user";

export const useMe = () => {
  const userQueryResult = useQuery<User>({
    queryKey: ["me"],
    queryFn: () => api.get("/api/v1/me"),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return userQueryResult;
};
