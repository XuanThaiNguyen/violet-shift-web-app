import type { User } from "@/types/user";
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
import { useGetSchedulesByStaffId } from "@/states/apis/shift";
import type { IGetStaffSchedule } from "@/types/shift";
import { formatTimeRange } from "@/utils/datetime";
import CreateShiftDrawer from "./CreateShiftDrawer";
import { useDisclosure } from "@heroui/react";

interface SchedulerManagementItemProps {
  viewMode: ViewMode;
  dates: DayDateInfo[];
  gridCols: string;
  staff: User;
  displayName: string;
}

const SchedulerManagementItem = ({
  staff,
  viewMode,
  dates,
  gridCols,
  displayName,
}: SchedulerManagementItemProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

  const { data: dataSchedules, isSuccess } = useGetSchedulesByStaffId(staff.id);

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

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((e) => +e._id !== eventId));
  };

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

  const getEventsForCell = (day: number, hour: number | null = null) => {
    if (viewMode === "day" && hour !== null) {
      return events.filter((e) => {
        const _date = new Date(e.timeFrom! * 1000);

        return (
          e.staff &&
          +e.staff === +staff.id &&
          _date.getDay() === day &&
          _date.getHours() === hour
        );
      });
    }

    return events.filter((e) => {
      const _date = new Date(e.timeFrom! * 1000);
      return _date.getDay() === day;
    });
  };

  return (
    <div
      key={staff.id}
      className={`grid ${gridCols} border-b hover:bg-gray-50`}
    >
      <div className="p-4 border-r bg-white sticky left-0 z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
            style={{ backgroundColor: "cyan" }}
          >
            {staff.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 truncate">
              {displayName || ""}
            </div>
          </div>
        </div>
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
                className={`p-1 border-r min-h-20 cursor-pointer transition-all ${
                  isOver
                    ? "bg-blue-100 border-2 border-blue-400 border-dashed"
                    : "hover:bg-blue-50"
                }`}
              >
                {cellEvents.map((event) => (
                  <div
                    key={event._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                    onDragEnd={handleDragEnd}
                    className={`p-1 rounded text-xs text-white relative group cursor-move ${
                      draggedEvent && +draggedEvent?._id === +event._id
                        ? "opacity-50"
                        : ""
                    }`}
                    style={{ backgroundColor: "red" }}
                  >
                    <div className="flex items-start gap-1">
                      <GripVertical
                        size={10}
                        className="opacity-50 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs truncate">
                        {event.title || "Title"}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(+event._id);
                      }}
                      className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            );
          })
        : dates.map((_, day) => {
            const cellEvents = getEventsForCell(day);
            const isOver = isDragOver(+staff.id, day);

            return (
              <div
                key={day}
                onClick={() => handleCellClick(+staff.id, day)}
                onDragOver={(e) => handleDragOver(e, +staff.id, day)}
                onDragLeave={handleDragLeave}
                // onDrop={(e) => handleDrop(e, +staff.id, day)}
                className={`p-2 border-r min-h-24 cursor-pointer transition-all ${
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
                        key={shift._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, shift)}
                        onDragEnd={handleDragEnd}
                        className={`p-2 rounded text-xs relative group cursor-move border-l-4 ${
                          draggedEvent && +draggedEvent?._id === +shift._id
                            ? "opacity-50"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedShiftId(shift.shift);
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
                              {shift.shiftType || "Personal Care"}
                            </div>
                            <div className="h-2"></div>
                            <div className="text-xs text-gray-500 truncate">
                              {shift.client || "Client"}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(+shift._id);
                          }}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

      <CreateShiftDrawer
        onClose={onClose}
        mode="view"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedShiftId={selectedShiftId}
      />
    </div>
  );
};

export default SchedulerManagementItem;
