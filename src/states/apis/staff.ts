import { useQuery } from "@tanstack/react-query";
import api from "@/services/api/http";
import type { CreateUser, User } from "@/types/user";
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
  });

  return staffsQueryResult;
};

export const createNewStaff = async (values: CreateUser) => {
  const res = await api.post("/api/v1/staffs/invite", values);
  return res.data;
};
