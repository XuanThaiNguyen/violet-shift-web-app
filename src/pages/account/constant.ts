import { PRICE_BOOK_ERROR_CODE } from "@/constants/errorMsg";

export const TABLE_HEADERS_WITH_EDIT = [
  {
    name: "Day of Week",
    uid: "dayOfWeek",
    width: 50,
    className: "min-w-[50px]",
  },
  { name: "Time", uid: "time", width: 260, className: "min-w-[260px]" },
  { name: "Per Hour", uid: "perHour" },
  { name: "Reference Number (Hour)", uid: "referenceNumberHour" },
  { name: "Per Km", uid: "perKm" },
  { name: "Reference Number", uid: "referenceNumberKm" },
  { name: "Effective Date", uid: "effectiveDate" },
  { name: "Duplicate", uid: "duplicate" },
  { name: "Delete", uid: "delete" },
];

export const TABLE_HEADERS_WITHOUT_EDIT = [
  {
    name: "Day of Week",
    uid: "dayOfWeek",
    width: 50,
    className: "min-w-[50px]",
  },
  { name: "Time", uid: "time", width: 260, className: "min-w-[260px]" },
  { name: "Per Hour", uid: "perHour" },
  { name: "Reference Number (Hour)", uid: "referenceNumberHour" },
  { name: "Per Km", uid: "perKm" },
  { name: "Reference Number", uid: "referenceNumberKm" },
  { name: "Effective Date", uid: "effectiveDate" },
];

export const weekdaysOptions = [
  { label: "Sunday", key: "sunday" },
  { label: "Weekdays - Mon Tue Wed Thu Fri", key: "weekdays" },
  { label: "Saturday", key: "saturday" },
  { label: "Public Holidays", key: "holidays" },
];

export const TIME_RANGE = [
  { key: "0", label: "12am" },
  { key: "60", label: "1am" },
  { key: "120", label: "2am" },
  { key: "180", label: "3am" },
  { key: "240", label: "4am" },
  { key: "300", label: "5am" },
  { key: "360", label: "6am" },
  { key: "420", label: "7am" },
  { key: "480", label: "8am" },
  { key: "540", label: "9am" },
  { key: "600", label: "10am" },
  { key: "660", label: "11am" },
  { key: "720", label: "12pm" },
  { key: "780", label: "1pm" },
  { key: "840", label: "2pm" },
  { key: "900", label: "3pm" },
  { key: "960", label: "4pm" },
  { key: "1020", label: "5pm" },
  { key: "1080", label: "6pm" },
  { key: "1140", label: "7pm" },
  { key: "1200", label: "8pm" },
  { key: "1260", label: "9pm" },
  { key: "1320", label: "10pm" },
  { key: "1380", label: "11pm" },
];

export const PriceErrorMessages = {
  [PRICE_BOOK_ERROR_CODE.INVALID_REQUEST]: "Invalid request",
  [PRICE_BOOK_ERROR_CODE.PRICE_BOOK_NOT_FOUND]: "Price book not found",
  [PRICE_BOOK_ERROR_CODE.PRICE_BOOK_IS_EXISTING]: "Price book is existing",
  [PRICE_BOOK_ERROR_CODE.CANNOT_ARCHIVE_LAST_ACTIVE]:
    "At least one active price book must remain.",
  [PRICE_BOOK_ERROR_CODE.PRICE_BOOK_RULES_OVERLAP]:
    "Price rules are overlapping",
  [PRICE_BOOK_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};
