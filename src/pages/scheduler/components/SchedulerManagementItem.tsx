import { useGetStaffAvailability } from "@/states/apis/availability";
import { useGetSchedulesByStaffId } from "@/states/apis/shift";
import type { IGetStaffSchedule } from "@/types/shift";
import type { User as IUser } from "@/types/user";
import { formatTimeRange } from "@/utils/datetime";
import { format } from "date-fns";
import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { hours } from "../constant";
import { useSubscribeRefresh } from "../store/refreshStore";
import { getShiftTypeLabel } from "../util";
import CarerAvailabilityPopover from "./CarerAvailabilityPopover";
import { EMPTY_ARRAY } from "@/constants/empty";

import type {
  DayDateInfo,
  DragOverCell,
  NewEventData,
  SelectedCell,
  ViewMode,
} from "../type";
import type { IAvailibility } from "@/types/availability";

interface SchedulerManagementItemProps {
  viewMode: ViewMode;
  dates: DayDateInfo[];
  gridCols: string;
  staff: IUser;
  displayName: string;
  from: number | null;
  to: number | null;
  setSelectedShiftId: (shiftId: string) => void;
  setSelectedUnavailability: (unavailability: IAvailibility) => void;
}

const SchedulerManagementItem = ({
  staff,
  viewMode,
  dates,
  gridCols,
  from,
  to,
  setSelectedShiftId,
  setSelectedUnavailability,
}: SchedulerManagementItemProps) => {
  useSubscribeRefresh(staff.id);

  const { data: dataAvailabilities } = useGetStaffAvailability({
    staff: staff.id,
    from,
    to,
    type: "available",
  });

  const [draggedEvent, setDraggedEvent] = useState<IGetStaffSchedule | null>(
    null
  );
  const [, setSelectedCell] = useState<SelectedCell | null>(null);
  const [, setShowEventForm] = useState<boolean>(false);
  const [, setNewEventData] = useState<NewEventData>({
    title: "",
    client: "",
    hour: 9,
    duration: 1,
  });
  const [dragOverCell, setDragOverCell] = useState<DragOverCell | null>(null);

  const { data: events = EMPTY_ARRAY } = useGetSchedulesByStaffId(
    staff.id,
    from,
    to
  );

  const { data: dataUnavailabilities = EMPTY_ARRAY } = useGetStaffAvailability({
    staff: staff.id,
    from,
    to,
    type: "unavailable",
    isApproved: true,
  });

  const scheduleAllocations = useMemo(() => {
    const allocations = new Map<string, IGetStaffSchedule[]>();
    events.forEach((event) => {
      if (viewMode === "day") {
        const _date = new Date(event.timeFrom!);
        const hour = _date.getHours();
        const _allocations = allocations.get(hour.toString()) || [];
        _allocations.push(event);
        allocations.set(hour.toString(), _allocations);
      } else {
        const fromDate = format(event.timeFrom!, "yyyy-MM-dd");
        const _allocations = allocations.get(fromDate) || [];
        _allocations.push(event);
        allocations.set(fromDate, _allocations);
      }
    });
    return allocations;
  }, [events, viewMode]);

  const unavailableAllocations = useMemo(() => {
    const allocations = new Map<string, IAvailibility[]>();
    dataUnavailabilities.forEach((avail) => {
      if (viewMode === "day") {
        const _date = new Date(avail.from);
        const hour = _date.getHours();
        const _allocations = allocations.get(hour.toString()) || [];
        _allocations.push(avail);
        allocations.set(hour.toString(), _allocations);
      } else {
        const fromDate = format(avail.from, "yyyy-MM-dd");
        const _allocations = allocations.get(fromDate) || [];
        _allocations.push(avail);
        allocations.set(fromDate, _allocations);
      }
    });
    return allocations;
  }, [dataUnavailabilities, viewMode]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    event: IGetStaffSchedule
  ) => {
    e.stopPropagation();
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDragOverCell(null);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    day: number,
    hour: number | null = null
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverCell({ staffId: +staff.id, day, hour });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  // const handleDrop = (
  //   e: React.DragEvent<HTMLDivElement>,
  //   targetStaffId: number,
  //   targetDay: number,
  //   targetHour: number | null = null
  // ) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (draggedEvent) {
  //     const updateData: Partial<IGetStaffSchedule> = {
  //       staff: targetStaffId,
  //       day: targetDay,
  //     };

  //     if (viewMode === "day" && targetHour !== null) {
  //       updateData.hour = targetHour;
  //     }

  //     setEvents((prev) =>
  //       prev.map((event) =>
  //         +event._id === +draggedEvent._id ? { ...event, ...updateData } : event
  //       )
  //     );
  //   }

  //   setDraggedEvent(null);
  //   setDragOverCell(null);
  // };

  const isDragOver = (day: number, hour: number | null = null) => {
    if (!dragOverCell) return false;
    if (viewMode === "day") {
      return dragOverCell.day === day && dragOverCell.hour === hour;
    }
    return dragOverCell.day === day;
  };

  // const handleDeleteEvent = (eventId: number) => {
  //   setEvents(events.filter((e) => +e._id !== eventId));
  // };

  // const handleAddEvent = () => {
  //   if (selectedCell && newEventData.title) {
  //     const newEvent = {
  //       id: events.length + 1,
  //       staffId: selectedCell.staffId,
  //       day: selectedCell.day,
  //       hour: selectedCell.hour || newEventData.hour,
  //       duration: newEventData.duration,
  //       title: newEventData.title,
  //       client: newEventData.client,
  //     };
  //     setEvents([...events, newEvent]);
  //     setShowEventForm(false);
  //     setNewEventData({ title: "", client: "", hour: 9, duration: 1 });
  //   }
  // };

  const handleCellClick = (day: number, hour: number | null = null) => {
    setSelectedCell({ staffId: +staff.id, day, hour });
    setShowEventForm(true);
    setNewEventData({ title: "", client: "", hour: hour || 9, duration: 1 });
  };

  return (
    <div key={staff.id} className={`grid ${gridCols} hover:bg-gray-50`}>
      <div className="p-4 border-r border-b bg-white sticky left-0 z-10">
        <CarerAvailabilityPopover
          staff={staff}
          dates={dates}
          dataAvailabilities={dataAvailabilities}
        />
      </div>

      {viewMode === "day"
        ? hours.map((hour) => {
            const cellEvents = scheduleAllocations.get(hour.toString()) || [];
            const cellUnavailabilities =
              unavailableAllocations.get(hour.toString()) || [];
            const isOver = isDragOver(0, hour);

            return (
              <div
                key={hour}
                onClick={() => handleCellClick(0, hour)}
                onDragOver={(e) => handleDragOver(e, 0, hour)}
                onDragLeave={handleDragLeave}
                // onDrop={(e) => handleDrop(e, +staff.id, 0, hour)}
                className={`p-1 border-r border-b min-h-20 cursor-pointer transition-all ${
                  isOver
                    ? "bg-blue-100 border-2 border-blue-400 border-dashed"
                    : "hover:bg-blue-50"
                }`}
              >
                {cellEvents.map((event) => {
                  const _timeShift = formatTimeRange(
                    event.timeFrom! / 1000,
                    event.timeTo! / 1000
                  );

                  return (
                    <div
                      key={event._id}
                      draggable
                      onClick={() => {
                        setSelectedShiftId(event.shift._id || "");
                      }}
                      onDragStart={(e) => handleDragStart(e, event)}
                      onDragEnd={handleDragEnd}
                      className={`p-1 rounded text-xs text-white relative group cursor-move mb-1 ${
                        draggedEvent && +draggedEvent?._id === +event._id
                          ? "opacity-50"
                          : ""
                      }`}
                      style={{ backgroundColor: "#f7f8fa" }}
                    >
                      <div className="flex items-start gap-1">
                        <GripVertical
                          size={10}
                          className="opacity-50 flex-shrink-0 text-gray-800"
                        />
                        <div className="flex-1 min-w-0 text-xs font-semibold text-gray-800 truncate">
                          {_timeShift}
                          <div className="h-1"></div>
                          <div className="font-medium text-gray-800 truncate">
                            {getShiftTypeLabel(event?.shift?.shiftType) ||
                              "Personal Care"}
                          </div>
                          <div className="h-2"></div>
                          <div className="text-xs text-gray-500 truncate">
                            {event.clientNames[0] || "Client"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {cellUnavailabilities.map((unavail) => {
                  return (
                    <div
                      key={unavail._id}
                      className="p-2 rounded text-xs text-danger bg-danger-50 relative group cursor-pointer overflow-hidden break-words"
                      onClick={() => setSelectedUnavailability(unavail)}
                    >
                      <div className="font-medium">Unavailable:</div>
                      <div className="whitespace-normal">
                        {formatTimeRange(
                          unavail.from / 1000,
                          unavail.to / 1000
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        : dates.map((d, day) => {
            const date = new Date(d.year, d.month - 1, d.date);
            const cellEvents =
              scheduleAllocations.get(format(date, "yyyy-MM-dd")) || [];
            const cellUnavailabilities =
              unavailableAllocations.get(format(date, "yyyy-MM-dd")) || [];
            const isOver = isDragOver(+staff.id, day);

            return (
              <div
                key={d.date}
                onClick={() => handleCellClick(+staff.id, day)}
                onDragOver={(e) => handleDragOver(e, +staff.id, day)}
                onDragLeave={handleDragLeave}
                // onDrop={(e) => handleDrop(e, +staff.id, day)}
                className={`p-2 border-r border-b min-h-24 cursor-pointer transition-all ${
                  isOver ? "bg-yellow-50 border-2" : "hover:bg-blue-50"
                }`}
              >
                <div className="space-y-1">
                  {cellEvents.map((shift) => {
                    const _timeShift = formatTimeRange(
                      shift.timeFrom! / 1000,
                      shift.timeTo! / 1000
                    );

                    return (
                      <div
                        key={`${d.year}-${d.month}-${d.date}-${shift?.shift?._id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, shift)}
                        onDragEnd={handleDragEnd}
                        className={`p-2 rounded text-xs relative group cursor-move border-l-4 ${
                          draggedEvent &&
                          +draggedEvent?._id === +shift?.shift?._id
                            ? "opacity-50"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedShiftId(shift?.shift?._id || "");
                        }}
                        style={{
                          backgroundColor: "#f7f8fa",
                          borderLeftColor: "red",
                        }}
                      >
                        <div className="flex items-start gap-1">
                          <GripVertical
                            size={12}
                            className="opacity-50 flex-shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 truncate">
                              {_timeShift}
                            </div>
                            <div className="h-1"></div>
                            <div className="font-medium text-gray-800 truncate">
                              {getShiftTypeLabel(shift?.shift?.shiftType) ||
                                "Personal Care"}
                            </div>
                            <div className="h-2"></div>
                            <div className="text-xs text-gray-500 truncate">
                              {shift.clientNames[0] || "Client"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {cellUnavailabilities.map((unavail) => {
                    return (
                      <div
                        key={unavail._id}
                        className="p-2 rounded text-xs text-danger bg-danger-50 relative group cursor-pointer overflow-hidden break-words"
                        onClick={() => setSelectedUnavailability(unavail)}
                      >
                        <div className="font-medium">Unavailable:</div>
                        <div className="whitespace-normal">
                          {formatTimeRange(
                            unavail.from / 1000,
                            unavail.to / 1000
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default SchedulerManagementItem;
