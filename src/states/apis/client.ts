import api from "@/services/api/http";
import type { ClientStatus, IClient } from "@/types/client";
import type { PaginationResponse } from "@/types/common";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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

export const useGetClients = (filter: ClientFilter) => {
  const clientsQueryResult = useQuery<PaginationResponse<IClient>>({
    queryKey: ["clients", filter],
    queryFn: async () => {
      const response: PaginationResponse<IClient> = await api.get(
        "/api/v1/clients",
        { params: filter }
      );
      const list = response.data;
      const map = list.reduce((acc, item) => {
        acc[item.id!] = item;
        return acc;
      }, {} as Record<string, IClient>);
      return {
        ...response,
        map: map,
      };
    },
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: keepPreviousData,
  });

  return clientsQueryResult;
};

export const useGetArchivedClients = (filter: ClientFilter) => {
  const clientsQueryResult = useQuery<PaginationResponse<IClient>>({
    queryKey: ["clients", filter],
    queryFn: () => api.get("/api/v1/clients/archived", { params: filter }),
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

export const useUpdateClient = async ({
  id,
  values,
}: {
  id: string;
  values: IClient;
}) => {
  const res = await api.put(`/api/v1/clients/${id}`, values);
  return res;
};

export const useCreateNewClient = async (values: IClient) => {
  const res = await api.post("/api/v1/clients", values);
  return res;
};

export const useChangeStatusClient = async ({
  id,
  status,
}: {
  id: string;
  status: ClientStatus;
}) => {
  const res = await api.post(`/api/v1/clients/change-status`, { id, status });
  return res;
};

export const usePostArchiveClient = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean;
}) => {
  const res = await api.post(`/api/v1/clients/archive`, { id, isArchived });
  return res;
};
