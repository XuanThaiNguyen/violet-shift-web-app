import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

const SchedularPersonal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Sample",
      start: new Date(2024, 11, 15, 9, 0),
      end: new Date(2024, 11, 15, 17, 0),
      category: "Personal Care",
      color: "teal",
    },
    {
      id: 2,
      title: "Sample",
      start: new Date(2024, 11, 16, 9, 0),
      end: new Date(2024, 11, 16, 17, 0),
      category: "Personal Care",
      color: "gray",
    },
  ]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: "",
    startTime: "09:00",
    endTime: "17:00",
    category: "Personal Care",
    color: "teal",
  });

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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

  const hours = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return "12am";
    if (i < 12) return `${i}am`;
    if (i === 12) return "12pm";
    return `${i - 12}pm`;
  });

  const navigate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + direction * 7);
    } else {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getDateRange = () => {
    if (viewMode === "month") {
      return `${
        monthNames[currentDate.getMonth()]
      } ${currentDate.getFullYear()}`;
    } else if (viewMode === "week") {
      const weekDays = getWeekDays(new Date(currentDate));
      const start = weekDays[0];
      const end = weekDays[6];
      return `${monthNames[start.getMonth()]} ${start.getDate()} - ${
        monthNames[end.getMonth()]
      } ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${
        monthNames[currentDate.getMonth()]
      } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    }
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
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

  const addEvent = () => {
    if (!newEvent.title || !newEvent.startDate) return;

    const [startHour, startMin] = newEvent.startTime.split(":").map(Number);
    const [endHour, endMin] = newEvent.endTime.split(":").map(Number);
    const eventDate = new Date(newEvent.startDate);

    const event = {
      id: Date.now(),
      title: newEvent.title,
      start: new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        startHour,
        startMin
      ),
      end: new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        endHour,
        endMin
      ),
      category: newEvent.category,
      color: newEvent.color,
    };

    setEvents([...events, event]);
    setShowEventForm(false);
    setNewEvent({
      title: "",
      startDate: "",
      startTime: "09:00",
      endTime: "17:00",
      category: "Personal Care",
      color: "teal",
    });
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div className="flex-1 bg-white">
        <div className="grid grid-cols-7 border-b">
          {daysOfWeek.map((day) => (
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
                  setSelectedDate(dayObj.date);
                  setShowEventForm(true);
                  setNewEvent({
                    ...newEvent,
                    startDate: dayObj.date.toISOString().split("T")[0],
                  });
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
                          onClick={() => deleteEvent(event.id)}
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

  const renderWeekView = () => {
    const weekDays = getWeekDays(new Date(currentDate));

    return (
      <div className="flex-1 bg-white overflow-auto">
        <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
          <div className="p-2 border-r"></div>
          {weekDays.map((day, i) => {
            const today = isToday(day);
            return (
              <div key={i} className="p-2 text-center border-r last:border-r-0">
                <div
                  className={`text-xs font-semibold ${
                    today ? "text-blue-500" : "text-blue-600"
                  }`}
                >
                  {daysOfWeek[i]}
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
            <div className="text-xs text-gray-500 text-right pr-2 pt-2 h-12">
              all-day
            </div>
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
                <div className="h-12 border-b"></div>
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
                          onClick={() => deleteEvent(event.id)}
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

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="flex-1 bg-white overflow-auto">
        <div className="border-b sticky top-0 bg-white z-10 p-4">
          <div className="text-center text-sm text-blue-500 uppercase tracking-wide font-semibold">
            {daysOfWeek[(currentDate.getDay() + 6) % 7]}
          </div>
        </div>
        <div className="flex">
          <div className="w-20 border-r">
            <div className="text-xs text-gray-500 text-right pr-2 pt-2 h-12">
              all-day
            </div>
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
            <div className="h-12 border-b"></div>
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
                      onClick={() => deleteEvent(event.id)}
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

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Calendar</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium text-gray-700 ml-2">
              {getDateRange()}
            </span>
          </div>
          <button
            onClick={() => setShowEventForm(true)}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("month")}
            className={`px-4 py-2 rounded ${
              viewMode === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded ${
              viewMode === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`px-4 py-2 rounded ${
              viewMode === "day"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === "month" && renderMonthView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Event</h2>
              <button onClick={() => setShowEventForm(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startDate: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startTime: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endTime: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newEvent.category}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, category: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex gap-2">
                  {Object.keys(colors).map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-8 h-8 rounded ${colors[color].solid} ${
                        newEvent.color === color ? "ring-2 ring-gray-800" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={addEvent}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedularPersonal;
