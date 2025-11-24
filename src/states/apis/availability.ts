import api from "@/services/api/http";
import type { AvailabilityTypeEnum, IAvailibility } from "@/types/availability";
import { useQuery } from "@tanstack/react-query";

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
  const schedulesByStaffId = useQuery<IAvailibility[]>({
    queryKey: ["staffAvailability", staff, from, to, type, isApproved],
    queryFn: () =>
      api.get("api/v1/availabilities", {
        params: { from, to, type, staff, isApproved },
      }),
    enabled: !!localStorage.getItem("auth_token") && !!staff,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return schedulesByStaffId;
};

export const declineLeaveRequest = (unavailabilityId: string) => {
  return api.post(`/api/v1/availabilities/${unavailabilityId}/decline`);
};
