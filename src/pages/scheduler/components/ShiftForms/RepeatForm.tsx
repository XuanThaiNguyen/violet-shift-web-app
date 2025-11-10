import { DatePicker, Select, SelectItem, Switch } from "@heroui/react";
import { useState } from "react";
import { RecurrenceOptions } from "../../constant";
import {
  parseAbsoluteToLocal,
  type ZonedDateTime,
} from "@internationalized/date";

type DayOfWeek = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
const days: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parseTimeInput = (time: number): ZonedDateTime => {
  return parseAbsoluteToLocal(new Date(time).toISOString());
};

const RepeatForm = () => {
  const [isRepeat, setIsRepeat] = useState(true);
  const [recurrence, setRecurrence] = useState(RecurrenceOptions[1].key);
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [selectedDays, setSelectedDays] = useState([days[1]]);
  const [monthDay, setMonthDay] = useState(1);
  const [endDate, setEndDate] = useState<number | null>(null);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getMaxRepeat = () => {
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

  const calculateOccurrences = (): number => {
    const start = new Date();
    const end = new Date(endDate);
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
    const unit =
      recurrence === "daily"
        ? "Day"
        : recurrence === "weekly"
        ? "Week"
        : "Month";
    return `Every ${repeatEvery} ${unit} until Nov 10, 2025, ${occurrences} occurrence${
      occurrences !== 1 ? "s" : ""
    }`;
  };

  const timeFromEndDate = endDate ? parseTimeInput(endDate) : null;

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
          <div className="flex items-center justify-between">
            <span className="text-sm">Repeat Every</span>
            <Select
              className="max-w-xs"
              selectedKeys={new Set([repeatEvery.toString()])}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setRepeatEvery(+value);
              }}
            >
              {[...Array(getMaxRepeat())].map((_, i) => (
                <SelectItem key={i + 1}>{i + 1}</SelectItem>
              ))}
            </Select>
          </div>
          {recurrence === "weekly" ? (
            <div>
              <div className="h-4"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Occurs On</span>
                <div>
                  {days.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`relative ${
                        index === days.length - 1 ? "mr-0" : "mr-3"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg px-4 border-1 flex items-center justify-center text-sm transition-colors ${
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
            <div>
              <div className="h-4"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Occurs On</span>
                <div className="flex items-center max-w">
                  <span className="text-gray-700 mr-4 text-lg">Day</span>
                  <Select
                    // className="w-2.5"
                    selectedKeys={[monthDay]}
                    onSelectionChange={([value]) => {
                      setMonthDay(+value + 1);
                    }}
                  >
                    {[...Array(31)].map((_, i) => (
                      <SelectItem key={i}>{i + 1}</SelectItem>
                    ))}
                  </Select>
                  <span className="text-gray-700 mr-4 text-lg">
                    of the month
                  </span>
                </div>
              </div>
            </div>
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
            <span className="text-sm text-grey-100">{getSummaryText()}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RepeatForm;
