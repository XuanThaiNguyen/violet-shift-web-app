import type { weekDays } from "./constant";

export interface DayDateInfo {
  date: number;
  day: (typeof weekDays)[number];
  month: number;
  year: number;
  isToday?: boolean;
}

export type ViewMode = "day" | "week" | "fortnight";

export interface EventItem {
  id: number;
  staffId: number;
  day: number;
  hour: number;
  duration: number;
  title: string;
  subtitle?: string;
  client: string;
}

export interface Staff {
  id: number;
  name: string;
  color: string;
  avatar: string;
  available: boolean;
  hours?: string;
}

export interface SchedulerManagementProps {
  viewMode: ViewMode;
  dates: DayDateInfo[];
}

export interface SelectedCell {
  staffId: number;
  day: number;
  hour?: number | null;
}

export interface DragOverCell {
  staffId: number;
  day: number;
  hour?: number | null;
}

export interface NewEventData {
  title: string;
  client: string;
  hour: number;
  duration: number;
}
