import api from "@/services/api/http";
import type { IClient } from "@/types/client";
import type { PaginationResponse } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export type ClientFilter = {
  query?: string;
  statusTypes?: string[];
  ageTypes?: string[];
  ages?: string[];
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
};

export const useClients = (filter: ClientFilter) => {
  const clientsQueryResult = useQuery<PaginationResponse<IClient>>({
    queryKey: ["clients", filter],
    queryFn: () => api.get("/api/v1/clients", { params: filter }),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return clientsQueryResult;
};

export const useClientDetail = (id: string) => {
  const clientDetailQueryResult = useQuery<IClient>({
    queryKey: ["clients", id],
    queryFn: () => api.get(`/api/v1/clients/${id}`),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return clientDetailQueryResult;
};
