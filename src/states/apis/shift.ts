import api from "@/services/api/http";
import type {
  IShiftValues as IAddShift,
  IClientScheduleDetail,
  IGetStaffSchedule,
  IShiftDetail,
  IShiftTask,
  IUpdateShift,
} from "@/types/shift";
import { useQuery } from "@tanstack/react-query";

export const createNewShift = async (values: IAddShift) => {
  const res = await api.post("/api/v1/shifts", values);
  return res.data;
};

export const updateShift = async (values: IUpdateShift) => {
  const res = await api.put(`/api/v1/shifts/${values._id}`, values);
  return res.data;
};
export const deleteShift = async (shiftId: string) => {
  const res = await api.delete(`/api/v1/shifts/${shiftId}`);
  return res.data;
};

export const useGetSchedulesByStaffId = (
  staffId: string,
  from?: number | null,
  to?: number | null
) => {
  const schedulesByStaffId = useQuery<IGetStaffSchedule[]>({
    queryKey: ["staffSchedules", staffId, from, to],
    queryFn: () =>
      api.get(`/api/v1/staff-schedules/staff/${staffId}`, {
        params: { from, to },
      }),
    enabled: !!localStorage.getItem("auth_token") && !!staffId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return schedulesByStaffId;
};

export const useGetStaffSchedulesByShift = (
  shiftId: string
) => {
  const schedulesByStaffId = useQuery<IGetStaffSchedule[]>({
    queryKey: ["staffSchedulesByShift", shiftId],
    queryFn: () =>
      api.get(`/api/v1/shifts/${shiftId}/staff-schedules`),
    enabled: !!localStorage.getItem("auth_token") && !!shiftId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return schedulesByStaffId;
};

export const  useGetClientSchedulesByShift = (
  shiftId: string
) => {
  const clientSchedulesByShift = useQuery<IClientScheduleDetail[]>({
    queryKey: ["clientSchedulesByShift", shiftId],
    queryFn: () =>
      api.get(`/api/v1/shifts/${shiftId}/client-schedules`),
    enabled: !!localStorage.getItem("auth_token") && !!shiftId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return clientSchedulesByShift;
};


export const useGetTasksByShift = (
  shiftId: string
) => {
  const tasksByShift = useQuery<IShiftTask[]>({
    queryKey: ["tasksByShiftId", shiftId],
    queryFn: () => api.get(`/api/v1/shifts/${shiftId}/tasks`),
    enabled: !!localStorage.getItem("auth_token") && !!shiftId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return tasksByShift;
};

export const useGetShiftDetail = (shiftId?: string) => {
  const shiftDetail = useQuery<IShiftDetail>({
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
