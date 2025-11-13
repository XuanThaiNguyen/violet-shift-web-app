export const WEEKDAYS = ["holidays", "weekdays", "saturday", "sunday"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const Weekdays = {
  HOLIDAYS: "holidays",
  WEEKDAYS: "weekdays",
  SATURDAY: "saturday",
  SUNDAY: "sunday",
} as const;

export type WeekdaysKey = keyof typeof Weekdays;
export type WeekdaysValue = (typeof Weekdays)[WeekdaysKey];

export default WEEKDAYS;
