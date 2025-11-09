import api from "@/services/api/http";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type WorklogSegment = {
  _id: string;
  staff: string;
  rule: string;
  shift: string;
  hours: number;
  startedAt: number;
  endedAt: number;
  createdAt: Date;
  updatedAt: Date;
};

export type WorklogFilter = {
  staffId: string;
  from: number;
  to: number;
};
export const getWorklogQueryOptions = (params: WorklogFilter) => {
  return queryOptions<WorklogSegment[]>({
    queryKey: ["worklogs", params],
    queryFn: () =>
      api.get(`/api/v1/worklogs/staffs/${params.staffId}`, {
        params: {
          from: params.from,
          to: params.to,
        },
      }),
    enabled: !!localStorage.getItem("auth_token") && !!params.staffId,
  });
};
export const useGetWorklogs = (params: WorklogFilter) => {
  return useQuery({
    ...getWorklogQueryOptions(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};
