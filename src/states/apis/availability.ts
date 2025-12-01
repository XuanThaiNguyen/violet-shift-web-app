import api from "@/services/api/http";
import type { AvailabilityTypeEnum, IAvailibility } from "@/types/availability";
import { queryOptions, useQuery } from "@tanstack/react-query";

interface GetAvailabilitiesParams {
  staffs?: string[];
  from?: number | null;
  to?: number | null;
  type?: AvailabilityTypeEnum;
  isApproved?: boolean;
}

export const getAvailQueryOptions = (params: GetAvailabilitiesParams) => {
  return queryOptions<IAvailibility[]>({
    queryKey: ["availabilities", params],
    queryFn: () =>
      api.get(`api/v1/availabilities`, {
        params: {
          staffs: params.staffs,
          from: params.from,
          to: params.to,
          type: params.type,
          isApproved: params.isApproved,
        },
      }),
    enabled:
      !!localStorage.getItem("auth_token") &&
      !isNaN(params.from!) &&
      !isNaN(params.to!) &&
      params.from! < params.to!,
  });
};

export const useGetAvailabilities = (params: GetAvailabilitiesParams) => {
  return useQuery<IAvailibility[]>({
    ...getAvailQueryOptions(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useGetStaffAvailability = ({
  staff,
  from,
  to,
  type,
  isApproved,
}: {
  staff: string;
  from?: number | null;
  to?: number | null;
  type?: AvailabilityTypeEnum;
  isApproved?: boolean;
}) => {
  const staffAvails = useQuery<IAvailibility[]>({
    queryKey: ["staffAvailability", staff, from, to, type, isApproved],
    queryFn: () =>
      api.get(`api/v1/availabilities/staffs/${staff}`, {
        params: { from, to, type, isApproved },
      }),
    enabled: !!localStorage.getItem("auth_token") && !!staff,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return staffAvails;
};

export const declineLeaveRequest = (unavailabilityId: string) => {
  return api.post(`/api/v1/availabilities/${unavailabilityId}/decline`);
};
