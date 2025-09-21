import React from "react";
import dayjs from "dayjs";

export default function Calendar({ checkins = [] }) {
  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");
  const startOfCalendar = startOfMonth.startOf("week");
  const endOfCalendar = endOfMonth.endOf("week");

  // Create array of days for the calendar
  const days = [];
  let current = startOfCalendar;
  while (
    current.isBefore(endOfCalendar) ||
    current.isSame(endOfCalendar, "day")
  ) {
    days.push(current);
    current = current.add(1, "day");
  }

  // Group checkins by date
  const checkinsByDate = {};
  checkins.forEach((checkin) => {
    const date = dayjs(checkin.createdAt || checkin.timestamp).format(
      "YYYY-MM-DD"
    );
    checkinsByDate[date] = checkin;
  });

  const getMoodEmoji = (mood) => {
    switch (mood?.toLowerCase()) {
      case "happy":
        return "😊";
      case "sad":
        return "😢";
      case "stressed":
        return "😰";
      case "tired":
        return "😴";
      case "urgent":
        return "🚨";
      default:
        return "😐";
    }
  };

  const getMoodColor = (mood) => {
    switch (mood?.toLowerCase()) {
      case "happy":
        return "bg-green-100 text-green-800";
      case "sad":
        return "bg-blue-100 text-blue-800";
      case "stressed":
        return "bg-yellow-100 text-yellow-800";
      case "tired":
        return "bg-gray-100 text-gray-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Mood Calendar</h3>
        <div className="text-sm text-calm-600">{today.format("MMMM YYYY")}</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-calm-600"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const isCurrentMonth = day.isSame(today, "month");
          const isToday = day.isSame(today, "day");
          const dateStr = day.format("YYYY-MM-DD");
          const checkin = checkinsByDate[dateStr];

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              className={`
                p-2 min-h-[40px] flex flex-col items-center justify-center text-sm
                ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${isToday ? "bg-calm-100 rounded-full" : ""}
                hover:bg-gray-50 cursor-pointer
              `}
            >
              <div className="font-medium">{day.format("D")}</div>
              {checkin && (
                <div className="mt-1">
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${getMoodColor(checkin.mood)}
                    `}
                    title={`${checkin.mood} - ${checkin.message}`}
                  >
                    {getMoodEmoji(checkin.mood)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-calm-600 mb-2">Mood Legend:</div>
        <div className="flex flex-wrap gap-2">
          {["happy", "sad", "stressed", "tired", "urgent"].map((mood) => (
            <div key={mood} className="flex items-center gap-1">
              <div
                className={`w-4 h-4 rounded-full ${getMoodColor(
                  mood
                )} flex items-center justify-center text-xs`}
              >
                {getMoodEmoji(mood)}
              </div>
              <span className="text-xs capitalize">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
