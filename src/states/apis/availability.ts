import api from "@/services/api/http";
import type { AvailabilityTypeEnum, IAvailibility } from "@/types/availability";
import { useQuery } from "@tanstack/react-query";

export const useGetStaffAvailability = ({
  staff,
  from,
  to,
  type,
}: {
  staff: string;
  from?: number | null;
  to?: number | null;
  type?: AvailabilityTypeEnum;
}) => {
  const schedulesByStaffId = useQuery<IAvailibility[]>({
    queryKey: ["staffSchedules", staff, from, to, type],
    queryFn: () =>
      api.get("api/v1/availabilities", {
        params: { from, to, type, staff },
      }),
    enabled: !!localStorage.getItem("auth_token") && !!staff,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return schedulesByStaffId;
};
