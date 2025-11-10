import { EMPTY_STRING } from "@/constants/empty";
import type { IShiftValues } from "@/types/shift";
import { parseTimeInput } from "@/utils/datetime";
import { DatePicker, Select, SelectItem, Switch } from "@heroui/react";
import { ZonedDateTime } from "@internationalized/date";
import { format, isValid } from "date-fns";
import type { FormikErrors } from "formik";
import { useEffect, useMemo, useState, type SetStateAction } from "react";
import { RecurrenceOptions } from "../../constant";

type DayOfWeek = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
const days: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getUnit = (recurrence: string) => {
  switch (recurrence) {
    case "daily":
      return "Day(s)";
    case "weekly":
      return "Week(s)";
    case "monthly":
      return "Month(s)";
  }
};

const getMaxRepeat = (recurrence: string) => {
  switch (recurrence) {
    case "daily":
      return 15;
    case "weekly":
      return 12;
    case "monthly":
      return 3;
    default:
      return 1;
  }
};

const getRepeatGapOptions = (recurrence: string) => {
  const unit = getUnit(recurrence);
  return [...Array(getMaxRepeat(recurrence))].map((_, i) => ({
    label: `${i + 1} ${unit}`,
    key: i + 1,
  }));
};

const getMaxDayInMonth = () => {
  return [...Array(31)].map((_, i) => ({
    label: `${i + 1}`,
    key: i + 1,
  }));
};

type RepeatFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const dayToCron: Record<DayOfWeek, string> = {
  Sun: "0",
  Mon: "1",
  Tue: "2",
  Wed: "3",
  Thu: "4",
  Fri: "5",
  Sat: "6",
};

const RepeatForm = ({ values, setValues }: RepeatFormProps) => {
  const [isRepeat, setIsRepeat] = useState(false);
  const [recurrence, setRecurrence] = useState(RecurrenceOptions[1].key);
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [selectedDays, setSelectedDays] = useState([days[1]]);
  const [monthDay, setMonthDay] = useState(1);
  const [endDate, setEndDate] = useState<number | null>(
    Date.now() + 86400000 * 7
  );

  useEffect(() => {
    if (isRepeat) {
      const date = new Date(endDate!);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      setValues((prev) => ({
        ...prev,
        repeat: {
          pattern: generateCronExpression(),
          endDate: endOfDay.getTime(),
          tz: "Australia/Sydney",
        },
      }));
    } else {
      setValues((prev) => ({ ...prev, repeat: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRepeat, endDate, selectedDays]);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const calculateOccurrences = (): number => {
    const start = new Date();
    const end = new Date(endDate!);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 0;
    const weeks = Math.floor(diffDays / 7 / repeatEvery);
    const months = Math.floor(diffDays / 30 / repeatEvery);

    switch (recurrence) {
      case "daily":
        return Math.floor(diffDays / repeatEvery) + 1;
      case "weekly":
        return (weeks + 1) * selectedDays.length;
      case "monthly":
        return months + 1;
      default:
        return 0;
    }
  };

  const getSummaryText = () => {
    const occurrences = calculateOccurrences();
    return `Every ${repeatEvery} ${getUnit(recurrence)} until ${
      isValid(new Date(endDate!))
        ? format(new Date(endDate!), "MMM d, yyyy")
        : EMPTY_STRING
    }, ${occurrences} occurrence${occurrences !== 1 ? "s" : ""}`;
  };

  const generateCronExpression = (): string => {
    // Extract hour and minute from timeFrom
    const date = new Date(values.timeFrom!);
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Specific days of week at specific time
    const cronDays = selectedDays
      .map((day) => dayToCron[day])
      .sort()
      .join(",");

    switch (recurrence) {
      case "daily":
        // Every N days at specific time
        if (repeatEvery === 1) {
          return `${minute} ${hour} * * *`; // Every day at specified time
        } else {
          return `${minute} ${hour} */${repeatEvery} * *`; // Every N days at specified time
        }

      case "weekly":
        if (repeatEvery === 1) {
          return `${minute} ${hour} * * ${cronDays}`; // Every week on selected days at specified time
        } else {
          return `${minute} ${hour} * * ${cronDays}/${repeatEvery}`;
        }

      case "monthly":
        // Specific day of month at specific time
        if (repeatEvery === 1) {
          return `${minute} ${hour} ${monthDay} * *`; // Every month on specific day at specified time
        } else {
          return `${minute} ${hour} ${monthDay} */${repeatEvery} *`; // Every N months on specific day at specified time
        }

      default:
        return `${minute} ${hour} * * *`;
    }
  };

  const timeFromEndDate = useMemo(
    () => (endDate ? parseTimeInput(endDate) : null),
    [endDate]
  );

  const repeatGapOptions = getRepeatGapOptions(recurrence);
  const maxDayInMonth = getMaxDayInMonth();

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Repeat</span>
        <Switch isSelected={isRepeat} onChange={() => setIsRepeat(!isRepeat)} />
      </div>
      {isRepeat ? (
        <div>
          <div className="h-4"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Recurrence</span>
            <Select
              className="max-w-xs"
              selectedKeys={[recurrence]}
              onSelectionChange={([value]) => {
                if (typeof value === "string") {
                  setRecurrence(value);
                }
              }}
            >
              {RecurrenceOptions.map((recurrence) => (
                <SelectItem key={recurrence.key}>{recurrence.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="h-4"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-sm">Repeat Every</span>
            <Select
              className="max-w-xs"
              selectedKeys={new Set([repeatEvery.toString()])}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setRepeatEvery(+value);
              }}
            >
              {repeatGapOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
          {recurrence === "weekly" ? (
            <div>
              <div className="h-4"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Occurs On</span>
                <div className="flex items-center justify-between max-w-xs w-full">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className="relative"
                    >
                      <div
                        className={`w-10 h-8 rounded-lg px-4 border-1 flex items-center justify-center text-sm transition-colors ${
                          selectedDays.includes(day)
                            ? "border-blue-500 bg-cyan-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        <span
                          className={
                            selectedDays.includes(day)
                              ? "text-blue-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          {day}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {recurrence === "monthly" ? (
            <>
              <div className="h-4"></div>
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm">Occurs On</span>
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-gray-700 mr-4 text-lg">Day</span>
                  <Select
                    className="w-20"
                    selectedKeys={new Set([monthDay.toString()])}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      setMonthDay(+value);
                    }}
                  >
                    {maxDayInMonth.map((day) => (
                      <SelectItem key={day.key}>{day.label}</SelectItem>
                    ))}
                  </Select>
                  <span className="text-gray-700 mr-4 text-lg">
                    of the month
                  </span>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="h-4"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm">End Date</span>
            <DatePicker
              className="w-80"
              showMonthAndYearPickers
              granularity="day"
              label=""
              name="birthdate"
              hideTimeZone
              value={timeFromEndDate}
              onChange={(date: ZonedDateTime | null) => {
                if (!date) return;
                const hour = date.hour;
                const minute = date.minute;
                const second = date.second;
                const day = date.day;
                const month = date.month;
                const year = date.year;
                const newEndDate = new Date(
                  year,
                  month - 1,
                  day,
                  hour,
                  minute,
                  second
                ).getTime();
                setEndDate(newEndDate);
              }}
            />
          </div>
          <div className="h-4"></div>
          <div className="flex items-center justify-between">
            <div>{""}</div>
            <span className="text-sm text-gray-400">{getSummaryText()}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RepeatForm;
