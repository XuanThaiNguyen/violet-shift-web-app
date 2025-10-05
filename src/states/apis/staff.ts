import { useQuery } from "@tanstack/react-query";
import api from "@/services/api/http";
import type { User } from "@/types/user";
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
