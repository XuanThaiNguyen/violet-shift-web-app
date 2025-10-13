import { startOfDay, endOfDay } from "date-fns";

// To filter time for start or end of the day
export const convertDateToMs = (
  date: Date | string | number,
  type: "startOf" | "endOf" = "startOf"
): number => {
  const _date = typeof date === "number" ? new Date(date) : new Date(date);

  const target = type === "startOf" ? startOfDay(_date) : endOfDay(_date);

  return target.getTime();
};
