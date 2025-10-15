import { Select, SelectItem } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { getDayDate, getFortnightDates, getWeekDates } from "../util";
import type { DayDateInfo, ViewMode } from "../type";
import { monthNames } from "../constant";

interface SchedulerModeProps {
  viewMode: ViewMode;
  weekOffset: number;
  setDates: (dates: DayDateInfo[]) => void;
  dates: DayDateInfo[];
  setViewMode: (viewMode: ViewMode) => void;
  setWeekOffset: (weekOffset: number) => void;
  isAdmin: boolean;
}

const ViewModeOptions = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Fornightly", value: "fortnight" },
];

const ViewCarerModeOptions = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];

const SchedulerMode = ({
  viewMode,
  weekOffset,
  setDates,
  dates,
  setViewMode,
  setWeekOffset,
  isAdmin,
}: SchedulerModeProps) => {
  useEffect(() => {
    const _dates =
      viewMode === "fortnight"
        ? getFortnightDates(weekOffset)
        : viewMode === "week"
        ? getWeekDates(weekOffset)
        : [getDayDate(weekOffset)];
    setDates(_dates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, weekOffset]);

  const renderDateTime = useMemo(() => {
    if (viewMode === "day") {
      const _date = dates[0] || new Date();

      const _formatedDate = `${_date.day}, ${_date.date} ${
        monthNames[_date.month - 1]
      } ${_date.year}`;

      return (
        <span className="font-medium">{`${_formatedDate} ${
          _date.isToday ? "(Today)" : ""
        }`}</span>
      );
    }

    const firstItem = dates[0];
    const lastItem = dates[dates.length - 1];
    let _formatedDate = "";

    if (
      firstItem.month - 1 !== lastItem.month - 1 &&
      firstItem.year !== lastItem.year
    ) {
      _formatedDate = `${monthNames[firstItem.month - 1]} ${lastItem.year} - ${
        monthNames[lastItem.month - 1]
      } ${lastItem.year}`;
    }

    if (
      firstItem.year === lastItem.year &&
      firstItem.month - 1 !== lastItem.month - 1
    ) {
      _formatedDate = `${monthNames[firstItem.month - 1]} - ${
        monthNames[lastItem.month - 1]
      } ${lastItem.year}`;
    }

    if (
      firstItem.year === lastItem.year &&
      firstItem.month === lastItem.month
    ) {
      _formatedDate = `${monthNames[firstItem.month - 1]} ${firstItem.year}`;
    }

    return <span className="font-medium">{_formatedDate}</span>;
  }, [dates, viewMode]);

  return (
    <div className="flex flex-1 items-center gap-2">
      <Select
        label=""
        name="viewMode"
        placeholder=""
        isClearable={false}
        className="w-32"
        value={viewMode}
        defaultSelectedKeys={[
          (isAdmin ? ViewModeOptions : ViewCarerModeOptions)[0].label || "",
        ]}
        onSelectionChange={([value]) => {
          const _viewMode = (
            isAdmin ? ViewModeOptions : ViewCarerModeOptions
          ).find((o) => o.label === value);
          setViewMode(_viewMode?.value as ViewMode);
          setWeekOffset(0);
        }}
        classNames={{
          trigger: "cursor-pointer",
        }}
      >
        {(isAdmin ? ViewModeOptions : ViewCarerModeOptions).map((option) => (
          <SelectItem key={option.label}>{option.label}</SelectItem>
        ))}
      </Select>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight size={20} />
        </button>
        {renderDateTime}
      </div>
    </div>
  );
};

export default SchedulerMode;
