import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  GripVertical,
} from "lucide-react";

// Sample data structure
const initialStaff = [
  {
    id: 1,
    name: "Vacant Shift",
    color: "#ef4444",
    avatar: "VS",
    available: false,
    hours: "1.00 Hours of vacant shift",
  },
  { id: 2, name: "Job Board", color: "#3b82f6", avatar: "JB", available: true },
  {
    id: 3,
    name: "Wegoro",
    color: "#06b6d4",
    avatar: "WE",
    hours: "0.00 Hours",
    available: true,
  },
];

const initialEvents = [
  {
    id: 1,
    staffId: 1,
    day: 6,
    hour: 9,
    duration: 1,
    title: "9am - 10am",
    subtitle: "Personal care",
    client: "No client selected",
  },
  {
    id: 2,
    staffId: 3,
    day: 2,
    hour: 9,
    duration: 3,
    title: "Morning Shift",
    client: "Client A",
  },
  {
    id: 5,
    staffId: 3,
    day: 2,
    hour: 10,
    duration: 3,
    title: "Morning Shift 2",
    client: "Client AB",
  },
  {
    id: 6,
    staffId: 3,
    day: 2,
    hour: 10,
    duration: 3,
    title: "Morning Shift 23",
    client: "Client AB3",
  },
  {
    id: 3,
    staffId: 3,
    day: 3,
    hour: 14,
    duration: 2,
    title: "Afternoon Visit",
    client: "Client B",
  },
  {
    id: 4,
    staffId: 2,
    day: 4,
    hour: 10,
    duration: 4,
    title: "Full Day Care",
    client: "Client C",
  },
];

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const hours = Array.from({ length: 24 }, (_, i) => i);

const getWeekDates = (weekOffset = 0) => {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.getDate();
  });
};

const getFortnightDates = (weekOffset = 0) => {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + weekOffset * 14);

  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      date: date.getDate(),
      day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
    };
  });
};

const getDayDate = (dayOffset = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + dayOffset);
  return {
    date: today.getDate(),
    day: weekDays[today.getDay() === 0 ? 6 : today.getDay() - 1],
  };
};

export default function TimeTable() {
  const [staff, setStaff] = useState(initialStaff);
  const [events, setEvents] = useState(initialEvents);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    client: "",
    hour: 9,
    duration: 1,
  });
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [viewMode, setViewMode] = useState("week"); // 'day', 'week', 'fortnight'

  const dates =
    viewMode === "fortnight"
      ? getFortnightDates(weekOffset)
      : viewMode === "week"
      ? getWeekDates(weekOffset).map((d, i) => ({ date: d, day: weekDays[i] }))
      : [getDayDate(weekOffset)];

  const gridCols =
    viewMode === "day"
      ? "grid-cols-[240px_repeat(24,minmax(60px,1fr))]"
      : viewMode === "fortnight"
      ? "grid-cols-[240px_repeat(14,minmax(80px,1fr))]"
      : "grid-cols-[240px_repeat(7,minmax(100px,1fr))]";

  const handleCellClick = (staffId, day, hour = null) => {
    setSelectedCell({ staffId, day, hour });
    setShowEventForm(true);
    setNewEventData({ title: "", client: "", hour: hour || 9, duration: 1 });
  };

  const handleAddEvent = () => {
    if (selectedCell && newEventData.title) {
      const newEvent = {
        id: events.length + 1,
        staffId: selectedCell.staffId,
        day: selectedCell.day,
        hour: selectedCell.hour || newEventData.hour,
        duration: newEventData.duration,
        title: newEventData.title,
        client: newEventData.client,
      };
      setEvents([...events, newEvent]);
      setShowEventForm(false);
      setNewEventData({ title: "", client: "", hour: 9, duration: 1 });
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  const getEventsForCell = (staffId, day, hour = null) => {
    if (viewMode === "day" && hour !== null) {
      return events.filter(
        (e) => e.staffId === staffId && e.day === day && e.hour === hour
      );
    }
    return events.filter((e) => e.staffId === staffId && e.day === day);
  };

  const handleDragStart = (e, event) => {
    e.stopPropagation();
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDragOverCell(null);
  };

  const handleDragOver = (e, staffId, day, hour = null) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverCell({ staffId, day, hour });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e, targetStaffId, targetDay, targetHour = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedEvent) {
      const updateData = { staffId: targetStaffId, day: targetDay };
      if (viewMode === "day" && targetHour !== null) {
        updateData.hour = targetHour;
      }

      setEvents(
        events.map((event) =>
          event.id === draggedEvent.id ? { ...event, ...updateData } : event
        )
      );
    }

    setDraggedEvent(null);
    setDragOverCell(null);
  };

  const isDragOver = (staffId, day, hour = null) => {
    if (!dragOverCell) return false;
    if (viewMode === "day") {
      return (
        dragOverCell.staffId === staffId &&
        dragOverCell.day === day &&
        dragOverCell.hour === hour
      );
    }
    return dragOverCell.staffId === staffId && dragOverCell.day === day;
  };

  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Staff Scheduler
            </h1>
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              <Plus size={20} />
              Add Carer
            </button>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {
                setViewMode("day");
                setWeekOffset(0);
              }}
              className={`px-4 py-2 rounded ${
                viewMode === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => {
                setViewMode("week");
                setWeekOffset(0);
              }}
              className={`px-4 py-2 rounded ${
                viewMode === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => {
                setViewMode("fortnight");
                setWeekOffset(0);
              }}
              className={`px-4 py-2 rounded ${
                viewMode === "fortnight"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Fortnight
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-600" />
              <span className="font-medium">
                {viewMode === "day"
                  ? weekOffset === 0
                    ? "Today"
                    : `Day ${weekOffset > 0 ? "+" : ""}${weekOffset}`
                  : viewMode === "fortnight"
                  ? weekOffset === 0
                    ? "This Fortnight"
                    : `Fortnight ${weekOffset > 0 ? "+" : ""}${weekOffset}`
                  : weekOffset === 0
                  ? "This Week"
                  : `Week ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
              </span>
            </div>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
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
                  <div
                    key={hour}
                    className="p-2 text-center border-r bg-gray-50"
                  >
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

          {/* Staff rows */}
          {staff.map((person) => (
            <div
              key={person.id}
              className={`grid ${gridCols} border-b hover:bg-gray-50`}
            >
              {/* Staff info cell */}
              <div className="p-4 border-r bg-white sticky left-0 z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {person.name}
                    </div>
                    {person.hours && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {person.hours}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cells */}
              {viewMode === "day"
                ? // Hourly view for day mode
                  hours.map((hour) => {
                    const cellEvents = getEventsForCell(person.id, 0, hour);
                    const isOver = isDragOver(person.id, 0, hour);

                    return (
                      <div
                        key={hour}
                        onClick={() => handleCellClick(person.id, 0, hour)}
                        onDragOver={(e) =>
                          handleDragOver(e, person.id, 0, hour)
                        }
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, person.id, 0, hour)}
                        className={`p-1 border-r min-h-20 cursor-pointer transition-all ${
                          isOver
                            ? "bg-blue-100 border-2 border-blue-400 border-dashed"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        {cellEvents.map((event) => (
                          <div
                            key={event.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event)}
                            onDragEnd={handleDragEnd}
                            className={`p-1 rounded text-xs text-white relative group cursor-move ${
                              draggedEvent?.id === event.id ? "opacity-50" : ""
                            }`}
                            style={{ backgroundColor: person.color }}
                          >
                            <div className="flex items-start gap-1">
                              <GripVertical
                                size={10}
                                className="opacity-50 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 text-xs truncate">
                                {event.title}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
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
                : // Daily view for week/fortnight mode
                  dates.map((d, day) => {
                    const cellEvents = getEventsForCell(person.id, day);
                    const isOver = isDragOver(person.id, day);

                    return (
                      <div
                        key={day}
                        onClick={() => handleCellClick(person.id, day)}
                        onDragOver={(e) => handleDragOver(e, person.id, day)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, person.id, day)}
                        className={`p-2 border-r min-h-24 cursor-pointer transition-all ${
                          isOver
                            ? "bg-yellow-50 border-2 border-yellow-400"
                            : "hover:bg-blue-50"
                        } ${cellEvents.length > 0 ? "bg-yellow-50" : ""}`}
                      >
                        <div className="space-y-1">
                          {cellEvents.map((event) => (
                            <div
                              key={event.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, event)}
                              onDragEnd={handleDragEnd}
                              className={`p-2 rounded text-xs relative group cursor-move border-l-4 ${
                                draggedEvent?.id === event.id
                                  ? "opacity-50"
                                  : ""
                              }`}
                              style={{
                                backgroundColor: "white",
                                borderLeftColor: person.color,
                              }}
                            >
                              <div className="flex items-start gap-1">
                                <GripVertical
                                  size={12}
                                  className="opacity-50 flex-shrink-0 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-800 truncate">
                                    {event.title}
                                  </div>
                                  {event.subtitle && (
                                    <div className="text-xs text-gray-600 truncate">
                                      {event.subtitle}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500 truncate">
                                    {event.client}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(event.id);
                                }}
                                className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
            </div>
          ))}
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEventData.title}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Morning Shift"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newEventData.client}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        client: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Client A"
                  />
                </div>
                {viewMode === "day" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Hour
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={newEventData.hour}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            hour: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={newEventData.duration}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setShowEventForm(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
