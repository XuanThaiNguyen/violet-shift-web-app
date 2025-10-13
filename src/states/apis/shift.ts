import api from "@/services/api/http";
import type { IShiftValues as IAddShift } from "@/types/shift";

export const createNewShift = async (values: IAddShift) => {
  const res = await api.post("/api/v1/shifts", values);
  return res.data;
};
