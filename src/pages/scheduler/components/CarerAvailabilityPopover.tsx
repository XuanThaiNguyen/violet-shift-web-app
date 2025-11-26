import type { IAvailibility } from "@/types/availability";
import type { User as IUser } from "@/types/user";
import { getDisplayName } from "@/utils/strings";
import { Popover, PopoverContent, PopoverTrigger, User } from "@heroui/react";
import clsx from "clsx";
import { shortMonthNames } from "../constant";
import type { DayDateInfo } from "../type";

interface CarerAvailabilityPopoverProps {
  staff: IUser;
  dates: DayDateInfo[];
  dataAvailabilities?: IAvailibility[];
}

const getDayRangeUTC = (year: number, month: number, day: number) => {
  const start = Date.UTC(year, month - 1, day, 0, 0, 0, 0); // 00:00:00.000 UTC
  const end = Date.UTC(year, month - 1, day, 23, 59, 59, 999); // 23:59:59.999 UTC
  return { start, end };
};

const isSlotInDay = (
  from: number,
  to: number,
  dayStart: number,
  dayEnd: number
) => {
  return from >= dayStart && to <= dayEnd;
};

const formatTime12 = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12; // convert 0 → 12
  const mm = minutes.toString().padStart(2, "0");
  return `${h12}:${mm}${ampm}`;
};

const isWholeDay = (
  from: number,
  to: number,
  dayStart: number,
  dayEnd: number
) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const fromIsMidnight =
    fromDate.getUTCHours() === 0 && fromDate.getUTCMinutes() === 0;

  const toIsEndOfDay =
    (toDate.getUTCHours() === 23 && toDate.getUTCMinutes() >= 0) ||
    to >= dayEnd;

  return fromIsMidnight && toIsEndOfDay;
};

const CarerAvailabilityPopover = ({
  staff,
  dates,
  dataAvailabilities,
}: CarerAvailabilityPopoverProps) => {
  const name = getDisplayName(staff);
  const actualName = `${staff.firstName}+${staff.lastName}`;
  const avatar =
    staff.avatar || `https://ui-avatars.com/api/?name=${actualName}`;

  const result = dates.map((dayObj) => {
    const { date, month, year } = dayObj;
    const { start: dayStart, end: dayEnd } = getDayRangeUTC(year, month, date);

    const labels = new Set<string>();

    dataAvailabilities?.forEach((slot) => {
      const { from, to } = slot;

      if (isSlotInDay(from, to, dayStart, dayEnd)) {
        if (isWholeDay(from, to, dayStart, dayEnd)) {
          labels.add("Whole day");
        } else {
          const label = `${formatTime12(from)}-${formatTime12(to)}`;
          labels.add(label);
        }
      }
    });

    return {
      ...dayObj,
      label: labels.size > 0 ? Array.from(labels) : undefined,
    };
  });

  return (
    <Popover placement="right" offset={10} showArrow>
      <PopoverTrigger>
        <User
          avatarProps={{
            src: avatar,
          }}
          name={name}
          description={
            <div className="flex flex-col gap-1">
              <span>{staff.email}</span>
              <span className="text-xs font-semibold text-green-300 cursor-pointer">
                View Availability
              </span>
            </div>
          }
        />
      </PopoverTrigger>

      <PopoverContent
        className={clsx(
          "p-0 overflow-hidden rounded-lg shadow-md border border-default-200",
          result.length === 1
            ? "w-auto"
            : "w-[90vw] max-w-md sm:max-w-lg md:max-w-xl"
        )}
      >
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded">
          <div
            className={clsx(
              "gap-3 py-2 px-2",
              result.length === 1
                ? "grid grid-cols-1 justify-items-center"
                : "grid grid-cols-7 min-w-[580px]"
            )}
          >
            {result.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 py-2 px-2 rounded-md hover:bg-default-100 transition-colors"
              >
                <span className="text-[10px] font-semibold text-default-500 uppercase tracking-wide">
                  {item.day}
                </span>

                <span className="text-sm font-semibold text-foreground">
                  {shortMonthNames[item.month - 1]} {item.date}
                </span>

                <div className="w-full mt-1 flex justify-center">
                  {item?.label && item.label.length > 0 ? (
                    <div className="flex flex-col gap-1 items-center">
                      {item.label.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-[10px] font-medium text-green-700 bg-green-100 rounded-full whitespace-nowrap"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-default-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CarerAvailabilityPopover;
