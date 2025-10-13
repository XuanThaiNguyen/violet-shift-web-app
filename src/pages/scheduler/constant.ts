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

export const ShiftTypeKeys = ShiftTypeOptions.map((item) => item.key);
export const AllowanceTypeKeys = ShiftTypeOptions.map((item) => item.key);
export const PaymentMethodKeys = PayMethodOptions.map((item) => item.key);

export const ErrorMessages = {
  [SHIFT_ERROR_CODE.INVALID_REQUEST]: "Invalid request",
  [SHIFT_ERROR_CODE.SHIFT_NOT_FOUND]: "Shift is not found",
  [SHIFT_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};
