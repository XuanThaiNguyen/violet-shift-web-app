import type {
  AllowanceTypeKeys,
  PaymentMethodKeys,
  ShiftTypeKeys,
} from "@/pages/scheduler/constant";
import type { IClient } from "./client";

export type ShiftTypeEnum = (typeof ShiftTypeKeys)[number];
export type AllowanceTypeEnum = (typeof AllowanceTypeKeys)[number];
export type PaymentMethodEnum = (typeof PaymentMethodKeys)[number];

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
  bonus?: number;
  mileage?: string;
  mileageCap?: string;
  isCompanyVehicle?: boolean;
  tasks: ITask[];
}

export interface ITask {
  id?: string;
  name: string;
  isMandatory: boolean;
  isCompleted?: boolean;
}

export interface IClientSchedule {
  id?: string;
  client: string | null;
  timeFrom: number | null;
  timeTo: number | null;
  priceBook: string;
  fund: string;
}

export interface IStaffSchedule {
  staff: string | null;
  timeFrom: number | null;
  timeTo: number | null;
  paymentMethod: PaymentMethodEnum;
}

export interface IGetStaffSchedule {
  staff: string | null;
  shift: {
    adress?: string;
    shiftType: string;
    unitNumber?: string;
    _id: string;
  };
  clientNames: string[];
  timeFrom: number | null;
  timeTo: number | null;
  paymentMethod: PaymentMethodEnum;
  _id: string;
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

export interface IShiftRepeat {
  pattern: string;
  endDate: number;
  tz: string;
}

export interface IShiftDetail {
  // shift information
  shiftType: ShiftTypeEnum;
  additionalShiftTypes: ShiftTypeEnum[];
  allowances: AllowanceTypeEnum[];
  mileageInvoicing: Array<string | IClient>;
  shiftMileage: number;
  additionalCost: number;
  ignoreStaffCount: boolean;
  confirmationRequired: boolean;
  acceptedDeclinable: boolean;

  timeFrom: number;
  timeTo: number;
  breakTime: number; // minutes
  address: string; // address
  unitNumber: string; // unit/department/door number
  bonus: number; // bonus
  dropOffAddress?: string; // drop off address
  dropOffUnitNumber?: string; // drop off unit/department/door number
  repeat: IShiftRepeat | string;

  // instruction
  instruction: string; // rich text

  // tasks
  tasks: IShiftTask[];

  // mileage information
  mileageCap: number; // miles
  mileage: number; // miles
  isCompanyVehicle: boolean;

  // clock-out information
  clientClockOutRequired: boolean;
  staffClockOutRequired: boolean;
  clientClockOutTime: number;
  staffClockOutTime: number;
}

export interface IShiftTask {
  shift: IShiftDetail | string;
  name: string;
  description: string;
  isMandatory: boolean;
  isCompleted: boolean;
  completedAt: Date;
}
