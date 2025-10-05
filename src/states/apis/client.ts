import api from "@/services/api/http";
import type { IClient } from "@/types/client";
import type { PaginationResponse } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export type ClientFilter = {
  query?: string;
  statusTypes?: string[];
  ages?: string[];
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
};

export const useClients = (filter: ClientFilter) => {
  const staffsQueryResult = useQuery<PaginationResponse<IClient>>({
    queryKey: ["staffs", filter],
    queryFn: () => api.get("/api/v1/clients", { params: filter }),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return staffsQueryResult;
};
