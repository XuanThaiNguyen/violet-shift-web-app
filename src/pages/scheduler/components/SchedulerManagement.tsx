import { EMPTY_ARRAY } from "@/constants/empty";
import { useStaffs } from "@/states/apis/staff";
import { useMemo } from "react";
import { hours } from "../constant";
import type { DayDateInfo, ViewMode } from "../type";
import { formatHour } from "../util";
import SchedulerManagementItem from "./SchedulerManagementItem";
import type { User } from "@/types/user";
import { getDisplayName } from "@/utils/strings";

interface SchedulerManagementProps {
  viewMode: ViewMode;
  dates: DayDateInfo[];
}

const SchedulerManagement = ({ viewMode, dates }: SchedulerManagementProps) => {
  const { data: dataStaffs } = useStaffs({ limit: 50 });

  const _dataStaffs = dataStaffs?.data || EMPTY_ARRAY;

  const gridCols = useMemo(() => {
    return viewMode === "day"
      ? "grid-cols-[240px_repeat(24,minmax(60px,1fr))]"
      : viewMode === "fortnight"
      ? "grid-cols-[240px_repeat(14,minmax(80px,1fr))]"
      : "grid-cols-[240px_repeat(7,minmax(100px,1fr))]";
  }, [viewMode]);

  const _renderScheduleByStaff = (staff: User) => {
    const _displayName = getDisplayName({
      firstName: staff.firstName,
      lastName: staff.lastName,
      middleName: staff.middleName,
      salutation: staff.salutation,
    });

    return (
      <SchedulerManagementItem
        key={staff.id}
        staff={staff}
        gridCols={gridCols}
        displayName={_displayName}
        viewMode={viewMode}
        dates={dates}
      />
    );
  };

  return (
    <div className="px-4">
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div className={`grid ${gridCols} border-b`}>
          {/* Corner cell */}
          <div className="p-4 bg-gray-50 border-r sticky left-0 z-20">
            <input
              type="text"
              placeholder="Search by team, staff..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Headers */}
          {viewMode === "day"
            ? hours.map((hour) => (
                <div key={hour} className="p-2 text-center border-r bg-gray-50">
                  <div className="text-xs font-semibold text-gray-600">
                    {formatHour(hour)}
                  </div>
                </div>
              ))
            : dates.map((d, i) => (
                <div key={i} className="p-4 text-center border-r bg-gray-50">
                  <div className="text-sm font-semibold text-gray-600">
                    {d.day}
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {d.date}
                  </div>
                </div>
              ))}
        </div>

        {/* <SchedulerManagementItem
          staffs={_dataStaffs}
          gridCols={gridCols}
          dates={dates}
          viewMode={viewMode}
        /> */}

        {_dataStaffs.map(_renderScheduleByStaff)}
      </div>
    </div>
  );
};

export default SchedulerManagement;
