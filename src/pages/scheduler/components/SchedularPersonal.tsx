import { useMe } from "@/states/apis/me";
import { useGetSchedulesByStaffId } from "@/states/apis/shift";
import type { IGetStaffSchedule } from "@/types/shift";
import { convertDateToMs } from "@/utils/datetime";
import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { hours, weekDays } from "../constant";
import type { DayDateInfo, ViewMode } from "../type";
import { getShiftTypeLabel } from "../util";
import ShiftDrawer from "./ShiftDrawer";

interface SchedularPersonalProps {
  viewMode: ViewMode;
  dates: DayDateInfo[];
}

const SchedularPersonal = ({ viewMode, dates }: SchedularPersonalProps) => {
  const { data: user } = useMe();

  const [events, setEvents] = useState<IGetStaffSchedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>(
    undefined
  );

  const {
    data: dataSchedules,
    isSuccess,
    refetch,
  } = useGetSchedulesByStaffId(user?.id || "", from, to);

  useEffect(() => {
    if (isSuccess && dataSchedules) {
      setEvents(dataSchedules);
    }
  }, [dataSchedules, isSuccess]);

  useEffect(() => {
    if (from && to) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

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
      setCurrentDate(fullDate);
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

  const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2) return false;

    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.timeFrom!), date));
  };

  const getEventPosition = (event: IGetStaffSchedule, hourHeight = 48) => {
    const startHour =
      new Date(event.timeFrom!).getHours() +
      new Date(event.timeFrom!).getMinutes() / 60;
    const endHour =
      new Date(event.timeTo!).getHours() +
      new Date(event.timeTo!).getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: startHour * hourHeight,
      height: duration * hourHeight,
    };
  };

  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="flex-1 bg-white overflow-auto">
        <div className="border-b sticky top-0 bg-white z-10 p-4"></div>
        <div className="flex">
          <div className="w-20 border-r">
            {hours.map((hour, i) => (
              <div
                key={i}
                className="h-16 text-xs text-gray-500 text-right pr-2 border-t"
              >
                {hour}
              </div>
            ))}
          </div>
          <div className="flex-1 relative">
            {hours.map((_, i) => (
              <div key={i} className="h-16 border-t"></div>
            ))}
            {dayEvents.map((event, index) => {
              const _start = new Date(event.timeFrom!);
              const _end = new Date(event.timeTo!);
              const pos = getEventPosition(event, 64);

              const widthPercent = 100 - index * 10; // e.g. 100%, 90%, 80%
              const leftPercent = index * 30;
              return (
                <div
                  onClick={() => {
                    setSelectedShiftId(event.shift._id);
                    onOpen();
                  }}
                  key={event._id}
                  className={`absolute left-2 right-2 border-l-4 p-3 rounded group bg-background`}
                  style={{
                    top: `${pos.top}px`,
                    height: `${pos.height}px`,
                    width: `${widthPercent}%`,
                    left: `${leftPercent}%`,
                    zIndex: dayEvents.length - index, // higher items on top
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <div className={`font-medium`}>
                          {_start.getHours()}:
                          {_start.getMinutes().toString().padStart(2, "0")} -{" "}
                          {_end.getHours()}:
                          {_end.getMinutes().toString().padStart(2, "0")}
                        </div>
                        <div className={`font-semibold`}>
                          {getShiftTypeLabel(event.shift.shiftType)}
                        </div>
                      </div>
                      <div className="h-1"></div>
                      <div className="text-gray-500 text-sm mt-1">
                        Client: {event.clientNames[0]}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const _weekDays = getWeekDays(new Date(currentDate));

    return (
      <div className="flex-1 bg-white overflow-auto">
        <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
          <div className="p-2 border-r"></div>
          {_weekDays.map((day, i) => {
            const today = isToday(day);
            return (
              <div key={i} className="p-2 text-center border-r last:border-r-0">
                <div
                  className={`text-xs font-semibold ${
                    today ? "text-blue-500" : "text-blue-600"
                  }`}
                >
                  {weekDays[i]}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    today
                      ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      : "text-gray-800"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-8">
          <div className="border-r">
            {hours.map((hour, i) => (
              <div
                key={i}
                className="h-12 text-xs text-gray-500 text-right pr-2 border-t"
              >
                {hour}
              </div>
            ))}
          </div>
          {_weekDays.map((day, i) => {
            const dayEvents = getEventsForDate(day);
            return (
              <div key={i} className="border-r last:border-r-0 relative">
                {hours.map((_, j) => (
                  <div key={j} className="h-12 border-t"></div>
                ))}
                {dayEvents.map((event) => {
                  const _start = new Date(event.timeFrom!);
                  const _end = new Date(event.timeTo!);
                  const pos = getEventPosition(event);
                  return (
                    <div
                      onClick={() => {
                        setSelectedShiftId(event.shift._id);
                        onOpen();
                      }}
                      key={event._id}
                      className={`absolute left-1 right-1 border-l-4 p-2 rounded text-xs group bg-background`}
                      style={{
                        top: `${pos.top + 48}px`,
                        height: `${pos.height}px`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-2">
                            <div className={`font-medium`}>
                              {_start.getHours()}:
                              {_start.getMinutes().toString().padStart(2, "0")}{" "}
                              - {_end.getHours()}:
                              {_end.getMinutes().toString().padStart(2, "0")}
                            </div>
                            <div className={`font-semibold truncate`}>
                              {getShiftTypeLabel(event.shift.shiftType)}
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs">
                            Client: {event.clientNames[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div className="flex-1 bg-white">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-semibold text-blue-600 border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((dayObj, index) => {
            const dayEvents = getEventsForDate(dayObj.date);
            const today = isToday(dayObj.date);

            return (
              <div
                key={index}
                className={`border-r border-b last:border-r-0 h-32 p-2 text-sm relative ${
                  today ? "bg-yellow-50" : ""
                }`}
                onClick={() => {
                  // setSelectedDate(dayObj.date);
                  // setShowEventForm(true);
                  // setNewEvent({
                  //   ...newEvent,
                  //   startDate: dayObj.date.toISOString().split("T")[0],
                  // });
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`${
                      dayObj.isCurrentMonth ? "text-gray-800" : "text-gray-300"
                    } ${
                      today
                        ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        : ""
                    }`}
                  >
                    {dayObj.day}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => {
                    const _start = new Date(event.timeFrom!);
                    const _end = new Date(event.timeTo!);

                    return (
                      <div
                        key={event._id}
                        className={`border-l-4 p-1 text-xs rounded group relative bg-background`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedShiftId(event.shift._id);
                          onOpen();
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex gap-2">
                              <div className={`font-medium truncate`}>
                                {_start.getHours()}:
                                {_start
                                  .getMinutes()
                                  .toString()
                                  .padStart(2, "0")}{" "}
                                - {_end.getHours()}:
                                {_end.getMinutes().toString().padStart(2, "0")}
                              </div>
                              <div className={`font-semibold truncate`}>
                                {getShiftTypeLabel(event.shift.shiftType)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Client: {event.clientNames[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {viewMode === "day" && renderDayView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "month" && renderMonthView()}

      {isOpen && selectedShiftId && (
        <ShiftDrawer
          onClose={onClose}
          isOpen={isOpen}
          selectedShiftId={selectedShiftId}
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default SchedularPersonal;
