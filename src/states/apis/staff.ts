import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/services/api/http";
import type { CreateUser, UpdateUser, User } from "@/types/user";
import type { PaginationResponse } from "@/types/common";

export type StaffFilter = {
  query?: string;
  roles?: string[];
  employmentTypes?: string[];
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
};

export const useStaffs = (filter: StaffFilter) => {
  const staffsQueryResult = useQuery<PaginationResponse<User>>({
    queryKey: ["staffs", filter],
    queryFn: () => api.get("/api/v1/staffs", { params: filter }),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: keepPreviousData,
  });

  return staffsQueryResult;
};

export const useGetArchivedStaffs = (filter: StaffFilter) => {
  const staffsQueryResult = useQuery<PaginationResponse<User>>({
    queryKey: ["staffs", filter],
    queryFn: () => api.get("/api/v1/staffs/archived", { params: filter }),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: keepPreviousData,
  });

  return staffsQueryResult;
};

export const useStaffDetail = (id: string) => {
  const clientDetailQueryResult = useQuery<User>({
    queryKey: ["staff", id],
    queryFn: () => api.get(`/api/v1/staffs/${id}`),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return clientDetailQueryResult;
};

export const createNewStaff = async (values: CreateUser) => {
  const res = await api.post("/api/v1/staffs/invite", values);
  return res.data;
};

export const usePostArchiveStaff = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean;
}) => {
  const res = await api.post(`/api/v1/staffs/archive`, { id, isArchived });
  return res;
};

export const useUpdateStaff = async ({
  id,
  values,
}: {
  id: string;
  values: UpdateUser;
}) => {
  const res = await api.patch(`/api/v1/staffs/${id}`, values);
  return res;
};
