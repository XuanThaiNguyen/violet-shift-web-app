import { useState } from "react";
import { hours, weekDays } from "../constant";
import { X } from "lucide-react";
import type { ViewMode } from "../type";

interface SchedularPersonalProps {
  viewMode: ViewMode;
}

const colors = {
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-400",
    text: "text-teal-700",
    solid: "bg-teal-400",
  },
  gray: {
    bg: "bg-gray-100",
    border: "border-gray-400",
    text: "text-gray-700",
    solid: "bg-gray-400",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-400",
    text: "text-pink-700",
    solid: "bg-pink-400",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-700",
    solid: "bg-blue-400",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-700",
    solid: "bg-yellow-400",
  },
};

const SchedularPersonal = ({ viewMode }: SchedularPersonalProps) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(event.start, date));
  };

  const getEventPosition = (event, hourHeight = 48) => {
    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: startHour * hourHeight,
      height: duration * hourHeight,
    };
  };

  const getWeekDays = (date) => {
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

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const getDaysInMonth = (date) => {
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
            {dayEvents.map((event) => {
              const pos = getEventPosition(event, 64);
              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 ${
                    colors[event.color].bg
                  } ${colors[event.color].border} border-l-4 p-3 rounded group`}
                  style={{
                    top: `${pos.top + 48}px`,
                    height: `${pos.height}px`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div
                        className={`font-medium ${colors[event.color].text}`}
                      >
                        {event.start.getHours()}:
                        {event.start.getMinutes().toString().padStart(2, "0")} -{" "}
                        {event.end.getHours()}:
                        {event.end.getMinutes().toString().padStart(2, "0")}
                      </div>
                      <div
                        className={`${
                          colors[event.color].text
                        } font-semibold text-lg`}
                      >
                        {event.title}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {event.category}
                      </div>
                    </div>
                    <button
                      // onClick={() => deleteEvent(event.id)}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDate(day);
            return (
              <div key={i} className="border-r last:border-r-0 relative">
                {hours.map((_, j) => (
                  <div key={j} className="h-12 border-t"></div>
                ))}
                {dayEvents.map((event) => {
                  const pos = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 ${
                        colors[event.color].bg
                      } ${
                        colors[event.color].border
                      } border-l-4 p-2 rounded text-xs group`}
                      style={{
                        top: `${pos.top + 48}px`,
                        height: `${pos.height}px`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium ${
                              colors[event.color].text
                            }`}
                          >
                            {event.start.getHours()}:
                            {event.start
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}{" "}
                            - {event.end.getHours()}:
                            {event.end.getMinutes().toString().padStart(2, "0")}
                          </div>
                          <div
                            className={`${
                              colors[event.color].text
                            } font-semibold`}
                          >
                            {event.title}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {event.category}
                          </div>
                        </div>
                        <button
                          // onClick={() => deleteEvent(event.id)}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`${colors[event.color].bg} ${
                        colors[event.color].border
                      } border-l-4 p-1 text-xs rounded group relative`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium ${
                              colors[event.color].text
                            } truncate`}
                          >
                            {event.start.getHours()}:
                            {event.start
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}{" "}
                            - {event.end.getHours()}:
                            {event.end.getMinutes().toString().padStart(2, "0")}
                          </div>
                          <div
                            className={`${colors[event.color].text} truncate`}
                          >
                            {event.title}
                          </div>
                        </div>
                        <button
                          // onClick={() => deleteEvent(event.id)}
                          className="opacity-0 group-hover:opacity-100 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.category}
                      </div>
                    </div>
                  ))}
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
    </div>
  );
};

export default SchedularPersonal;
