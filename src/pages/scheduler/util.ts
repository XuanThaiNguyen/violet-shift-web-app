import { AllowanceOptions, ShiftTypeOptions, weekDays } from "./constant";

export const getWeekDates = (weekOffset = 0) => {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      date: date.getDate(),
      day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });
};

export const getFortnightDates = (weekOffset = 0) => {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + weekOffset * 14);

  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      date: date.getDate(),
      day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });
};

export const getDayDate = (dayOffset = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + dayOffset);
  const isToday = dayOffset === 0;

  return {
    date: today.getDate(),
    day: weekDays[today.getDay() === 0 ? 6 : today.getDay() - 1],
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    isToday,
  };
};

export const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
};

export const getShiftTypeLabel = (key: string): string => {
  const found = ShiftTypeOptions.find((item) => item.key === key);
  return found ? found.label : key;
};

export const getAllowanceTypeLabel = (key: string): string => {
  const found = AllowanceOptions.find((item) => item.key === key);
  return found ? found.label : key;
};
