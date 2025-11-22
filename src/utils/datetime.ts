import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { startOfDay, endOfDay, format, fromUnixTime } from "date-fns";
import { TZDate } from "@date-fns/tz";

export const convertDateToMs = (
  date: Date | string | number,
  type: "startOf" | "endOf" = "startOf"
): number => {
  const _date = typeof date === "number" ? new Date(date) : new Date(date);

  const target = type === "startOf" ? startOfDay(_date) : endOfDay(_date);

  return target.getTime();
};

export const formatTimeRange = (startTs: number, endTs: number) => {
  const startTime = format(fromUnixTime(startTs), "h:mm a");
  const endTime = format(fromUnixTime(endTs), "h:mm a");
  return `${startTime} - ${endTime}`;
};

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFormattedTz = (tz?: string) => {
  const _tz = tz || getDeviceTz();
  const date = new TZDate( new Date(), _tz);
  const utcDiff = date.toString().match(/\b(GMT|UTC)([+-]\d{2})(\d{2})\b/);
  if (!utcDiff) return "UTC+00:00";
  const formatted = `${utcDiff[1]}${utcDiff[2]}:${utcDiff[3]}`;
  return formatted;
};

export const parseTimeInput = (time: number): ZonedDateTime => {
  return parseAbsoluteToLocal(new Date(time).toISOString());
};

export const getDeviceTz = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};