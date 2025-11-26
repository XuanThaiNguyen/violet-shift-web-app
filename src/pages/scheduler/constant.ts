import { SHIFT_ERROR_CODE } from "@/constants/errorMsg";

export const PayMethodOptions = [
  {
    label: "Use staff member's default paygroup",
    key: "default",
  },
  {
    label: "Default Casual",
    key: "cash",
  },
];
export const PayMethodMap = PayMethodOptions.reduce((acc, item) => {
  acc[item.key] = item.label;
  return acc;
}, {} as Record<string, string>);

export const AllowanceOptions = [
  {
    label: "Expense",
    key: "expense",
  },
  {
    label: "Mileage",
    key: "mileage",
  },
  {
    label: "Sleepover",
    key: "sleepover",
  },
];
export const AllowanceTypeMap = AllowanceOptions.reduce((acc, item) => {
  acc[item.key] = item.label;
  return acc;
}, {} as Record<string, string>);

export const ShiftTypeOptions = [
  {
    label: "Personal Care",
    key: "personal_care",
  },
  {
    label: "Board and Lodging",
    key: "board_n_lodging",
  },
  {
    label: "Domestic Assistance",
    key: "domestic_assistance",
  },
  {
    label: "Night Shift",
    key: "night_shift",
  },
  {
    label: "On Call",
    key: "on_call",
  },
  {
    label: "Recall to work",
    key: "recall_to_work",
  },
  {
    label: "Remote Work",
    key: "remote_work",
  },
  {
    label: "Respite Care",
    key: "respite_care",
  },
  {
    label: "Sleepover",
    key: "sleepover",
  },
  {
    label: "Support Coordication",
    key: "support_coordination",
  },
  {
    label: "Transport",
    key: "transport",
  },
  {
    label: "24 Hour Care",
    key: "24_hour_care",
  },
];
export const ShiftTypeMap = ShiftTypeOptions.reduce((acc, item) => {
  acc[item.key] = item.label;
  return acc;
}, {} as Record<string, string>);

export const ShiftTypeKeys = ShiftTypeOptions.map((item) => item.key);
export const AllowanceTypeKeys = ShiftTypeOptions.map((item) => item.key);
export const PaymentMethodKeys = PayMethodOptions.map((item) => item.key);

export const ErrorMessages = {
  [SHIFT_ERROR_CODE.INVALID_REQUEST]: "Invalid request",
  [SHIFT_ERROR_CODE.SHIFT_NOT_FOUND]: "Shift is not found",
  [SHIFT_ERROR_CODE.SHIFT_HAPPENED]: "Shift has happened",
  [SHIFT_ERROR_CODE.STAFF_SCHEDULE_NOT_FOUND]:
    "Staff schedule not found or happened in some other time or already clocked in",
  [SHIFT_ERROR_CODE.TASK_NOT_FOUND]: "Task is not found",
  [SHIFT_ERROR_CODE.SHIFT_NOT_STARTED]: "Shift has not happened",
  [SHIFT_ERROR_CODE.SHIFT_ENDED]: "Shift has ended",
  [SHIFT_ERROR_CODE.STAFF_SIGNATURE_REQUIRED]: "Staff Signature is required",
  [SHIFT_ERROR_CODE.CLIENT_SIGNATURE_REQUIRED]: "Client Signature is required",
  [SHIFT_ERROR_CODE.STAFF_ALREADY_CLOCKED_IN]: "Staff is already clocked in",
  [SHIFT_ERROR_CODE.STAFF_ALREADY_CLOCKED_OUT]: "Staff is already clocked out",
  [SHIFT_ERROR_CODE.STAFF_NOT_CLOCKED_IN]: "Staff is not clocked in",
  [SHIFT_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};

export const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const hours = Array.from({ length: 24 }, (_, i) => i);

export const initialEventsMockUp = [
  {
    id: 1,
    staffId: 1,
    day: 6,
    hour: 9,
    duration: 1,
    title: "9am - 10am",
    subtitle: "Personal care",
    client: "No client selected",
  },
  {
    id: 2,
    staffId: 3,
    day: 2,
    hour: 9,
    duration: 3,
    title: "Morning Shift",
    client: "Client A",
  },
  {
    id: 5,
    staffId: 3,
    day: 2,
    hour: 10,
    duration: 3,
    title: "Morning Shift 2",
    client: "Client AB",
  },
  {
    id: 6,
    staffId: 3,
    day: 2,
    hour: 10,
    duration: 3,
    title: "Morning Shift 23",
    client: "Client AB3",
  },
  {
    id: 3,
    staffId: 3,
    day: 3,
    hour: 14,
    duration: 2,
    title: "Afternoon Visit",
    client: "Client B",
  },
  {
    id: 4,
    staffId: 2,
    day: 4,
    hour: 10,
    duration: 4,
    title: "Full Day Care",
    client: "Client C",
  },
];

export const initialStaffMockup = [
  {
    id: 1,
    name: "Yummy",
    color: "#ef4444",
    avatar: "YM",
    available: false,
    hours: "1.00 Hours",
  },
  {
    id: 2,
    name: "ShenLong",
    color: "#3b82f6",
    avatar: "SL",
    available: true,
  },
  {
    id: 3,
    name: "Wegoro",
    color: "#06b6d4",
    avatar: "WE",
    hours: "0.00 Hours",
    available: true,
  },
];
