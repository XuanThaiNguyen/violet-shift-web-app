import { useGetSchedulesByStaffId } from "@/states/apis/shift";
import type { IGetStaffSchedule } from "@/types/shift";
import type { User as IUser } from "@/types/user";
import { formatTimeRange } from "@/utils/datetime";
import { getDisplayName } from "@/utils/strings";
import { useDisclosure, User } from "@heroui/react";
import { format, isValid } from "date-fns";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { hours } from "../constant";
import type {
  DayDateInfo,
  DragOverCell,
  NewEventData,
  SelectedCell,
  ViewMode,
} from "../type";
import { getShiftTypeLabel } from "../util";
import ShiftDrawer from "./ShiftDrawer";
import { useSubscribeRefresh } from "../store/refreshStore";

interface SchedulerManagementItemProps {
  viewMode: ViewMode;
  dates: DayDateInfo[];
  gridCols: string;
  staff: IUser;
  displayName: string;
  from: number | null;
  to: number | null;
}

const SchedulerManagementItem = ({
  staff,
  viewMode,
  dates,
  gridCols,
  from,
  to,
}: SchedulerManagementItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useSubscribeRefresh(staff.id);

  const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>(
    undefined
  );

  const [draggedEvent, setDraggedEvent] = useState<IGetStaffSchedule | null>(
    null
  );
  const [events, setEvents] = useState<IGetStaffSchedule[]>([]);
  const [, setSelectedCell] = useState<SelectedCell | null>(null);
  const [, setShowEventForm] = useState<boolean>(false);
  const [, setNewEventData] = useState<NewEventData>({
    title: "",
    client: "",
    hour: 9,
    duration: 1,
  });
  const [dragOverCell, setDragOverCell] = useState<DragOverCell | null>(null);

  const { data: dataSchedules, isSuccess } = useGetSchedulesByStaffId(
    staff.id,
    from,
    to
  );

  useEffect(() => {
    if (isSuccess && dataSchedules) {
      setEvents(dataSchedules);
    }
  }, [dataSchedules, isSuccess]);

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

  const name = getDisplayName(staff);
  const actualName = `${staff.firstName}+${staff.lastName}`;
  const avatar =
    staff.avatar || `https://ui-avatars.com/api/?name=${actualName}`;

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

  const getEventsForCell = (date: number, hour: number | null = null) => {
    if (viewMode === "day" && hour !== null) {
      return events.filter((e) => {
        if (!isValid(e.timeFrom)) return false;
        const _date = new Date(e.timeFrom!);
        return _date.getHours() === hour;
      });
    }

    return events.filter((e) => {
      if (!isValid(e.timeFrom)) return false;
      const fromDate = format(e.timeFrom!, "yyyy-MM-dd");
      const _date = format(date, "yyyy-MM-dd");
      return _date === fromDate;
    });
  };

  return (
    <div key={staff.id} className={`grid ${gridCols} hover:bg-gray-50`}>
      <div className="p-4 border-r border-b bg-white sticky left-0 z-10">
        <User
          avatarProps={{
            src: avatar,
          }}
          name={name}
          description={staff.email}
        />
      </div>

      {viewMode === "day"
        ? hours.map((hour) => {
            const cellEvents = getEventsForCell(0, hour);
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
                        setSelectedShiftId(event.shift._id);
                        onOpen();
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
              </div>
            );
          })
        : dates.map((d, day) => {
            const date = new Date(d.year, d.month - 1, d.date);
            const cellEvents = getEventsForCell(date.getTime());
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
                          setSelectedShiftId(shift?.shift?._id);
                          onOpen();
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
                </div>
              </div>
            );
          })}

      {isOpen && selectedShiftId && (
        <ShiftDrawer
          onClose={onClose}
          isOpen={isOpen}
          isAdmin={true}
          selectedShiftId={selectedShiftId}
        />
      )}
    </div>
  );
};

export default SchedulerManagementItem;
