import api from "@/services/api/http";
import type {
  IShiftValues as IAddShift,
  IGetStaffSchedule,
} from "@/types/shift";
import { useQuery } from "@tanstack/react-query";

export const createNewShift = async (values: IAddShift) => {
  const res = await api.post("/api/v1/shifts", values);
  return res.data;
};

export const useGetSchedulesByStaffId = (staffId: string) => {
  const schedulesByStaffId = useQuery<IGetStaffSchedule[]>({
    queryKey: ["staffSchedules", staffId],
    queryFn: () => api.get(`/api/v1/staff-schedules/staff/${staffId}`),
    enabled: !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return schedulesByStaffId;
};

export const useGetShiftDetail = (shiftId?: string) => {
  const shiftDetail = useQuery<IGetStaffSchedule[]>({
    queryKey: ["shiftDetail", shiftId],
    queryFn: () => api.get(`/api/v1/shifts/${shiftId}`),
    enabled: !!shiftId && !!localStorage.getItem("auth_token"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return shiftDetail;
};
