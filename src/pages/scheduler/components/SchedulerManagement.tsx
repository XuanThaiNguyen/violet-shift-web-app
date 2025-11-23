import { EMPTY_ARRAY } from "@/constants/empty";
import { useStaffs } from "@/states/apis/staff";
import { useEffect, useMemo, useState } from "react";
import { hours } from "../constant";
import type { DayDateInfo, ViewMode } from "../type";
import { formatHour } from "../util";
import SchedulerManagementItem from "./SchedulerManagementItem";
import type { User } from "@/types/user";
import { getDisplayName } from "@/utils/strings";
import { convertDateToMs } from "@/utils/datetime";
import { useDebounceValue } from "usehooks-ts";

interface SchedulerManagementProps {
  viewMode: ViewMode;
  dates: DayDateInfo[];
  setSelectedShiftId: (shiftId: string) => void;
}

const SchedulerManagement = ({ viewMode, dates, setSelectedShiftId }: SchedulerManagementProps) => {
  const [query, setQuery] = useDebounceValue<string>("", 300);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);

  const queryParams = useMemo(() => {
    return {
      limit: 50,
      // roles: [ROLE_IDS.CARER],
      query: query,
      joined: true,
      archived: false,
    };
  }, [query]);

  const { data: dataStaffs } = useStaffs(queryParams);
  const _dataStaffs = dataStaffs?.data || EMPTY_ARRAY;

  useEffect(() => {
    if (dates && dates.length === 0) return;
    if (viewMode === "day") {
      const fullDate = new Date(
        dates[0].year,
        dates[0].month - 1,
        dates[0].date
      );
      const _from = convertDateToMs(fullDate, "startOf");
      const _to = convertDateToMs(fullDate, "endOf");
      setFrom(_from);
      setTo(_to);
    } else {
      const fullFromDate = new Date(
        dates[0].year,
        dates[0].month - 1,
        dates[0].date
      );
      const _from = convertDateToMs(fullFromDate, "startOf");
      const fullToDate = new Date(
        dates[dates.length - 1].year,
        dates[dates.length - 1].month - 1,
        dates[dates.length - 1].date
      );
      const _to = convertDateToMs(fullToDate, "endOf");
      setFrom(_from);
      setTo(_to);
    }
  }, [viewMode, dates]);

  const gridCols = useMemo(() => {
    return viewMode === "day"
      ? "grid-cols-[240px_repeat(24,minmax(60px,1fr))]"
      : viewMode === "fortnight"
      ? "grid-cols-[240px_repeat(14,minmax(80px,1fr))]"
      : "grid-cols-[240px_repeat(7,minmax(100px,1fr))]";
  }, [viewMode]);

  const _renderScheduleByStaff = (staff: User) => {
    const _displayName = getDisplayName({
      firstName: staff?.firstName,
      lastName: staff?.lastName,
      middleName: staff?.middleName,
      salutation: staff?.salutation,
      preferredName: staff?.preferredName,
    });

    return (
      <SchedulerManagementItem
        key={staff.id}
        staff={staff}
        gridCols={gridCols}
        displayName={_displayName}
        viewMode={viewMode}
        dates={dates}
        from={from}
        to={to}
        setSelectedShiftId={setSelectedShiftId}
      />
    );
  };

  return (
    <div className="px-4">
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div className={`grid ${gridCols}`}>
          <div className="p-4 bg-gray-50 border-r border-b sticky left-0 z-20">
            <input
              type="text"
              placeholder="Search by team, staff..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {viewMode === "day"
            ? hours.map((hour) => (
                <div
                  key={hour}
                  className="p-2 text-center border-r border-b bg-gray-50"
                >
                  <div className="text-xs font-semibold text-gray-600">
                    {formatHour(hour)}
                  </div>
                </div>
              ))
            : dates.map((d, i) => (
                <div
                  key={i}
                  className="p-4 text-center border-r border-b bg-gray-50"
                >
                  <div className="text-sm font-semibold text-gray-600">
                    {d.day}
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {d.date}
                  </div>
                </div>
              ))}
        </div>

        {_dataStaffs.map(_renderScheduleByStaff)}
      </div>
    </div>
  );
};

export default SchedulerManagement;
