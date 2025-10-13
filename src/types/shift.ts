import type {
  AllowanceTypeKeys,
  PaymentMethodKeys,
  ShiftTypeKeys,
} from "@/pages/scheduler/constant";

export type ShiftTypeEnum = (typeof ShiftTypeKeys)[number];
export type AllowanceTypeEnum = (typeof AllowanceTypeKeys)[number];
export type PaymentMethodEnum = (typeof PaymentMethodKeys)[number];

export interface CreateShiftDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export interface IShiftValues {
  clientSchedules: IClientSchedule[];
  staffSchedules: IStaffSchedule[];
  shiftType: ShiftTypeEnum;
  additionalShiftTypes: ShiftTypeEnum[];
  allowances: AllowanceTypeEnum[];
  timeFrom: number | null;
  timeTo: number | null;
  address?: string;
  unitNumber?: string;
  bonus?: string;
  mileage?: string;
  mileageCap?: string;
  isCompanyVehicle?: boolean;
}

export interface IClientSchedule {
  client: string | null;
  timeFrom: number | null;
  timeTo: number | null;
}

export interface IStaffSchedule {
  staff: string | null;
  timeFrom: number | null;
  timeTo: number | null;
  paymentMethod: PaymentMethodEnum;
}

export interface TimeValue {
  hour: number;
  minute: number;
}

export interface DateValue {
  day: number;
  month: number;
  year: number;
}
