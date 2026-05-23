import { weekKeys } from "../utils/dateHelpers.js";
import { Check } from "lucide-react";

export default function WeeklyGrid({
  habits,
  logsByHabit,
  days: customDays,
}) {
  const days = customDays || weekKeys();

  const todayKey = new Date()
    .toISOString()
    .slice(0, 10);

  if (!habits.length) {
    return (
      <div className="card p-6 text-center text-muted text-sm">
        Create a habit to see your weekly
        grid.
      </div>
    );
  }

  return (
    <div className="card p-5 overflow-x-auto">
      <div className="min-w-[520px]">
        <div className="grid grid-cols-[180px_repeat(7,minmax(0,1fr))] gap-2 items-center mb-2">
          <div className="text-xs font-medium text-muted uppercase tracking-wider">
            Habit
          </div>

          {days.map((d) => (
            <div
              key={d.key}
              className={`text-center text-xs font-medium ${
                d.key === todayKey
                  ? "text-brand-600 dark:text-brand-300"
                  : "text-muted"
              }`}
            >
              <div>{d.label}</div>

              <div className="text-faint">
                {d.short}
              </div>
            </div>
          ))}
        </div>

        {habits.map((h) => {
          // FIXED DATE MATCHING
          const done = new Set(
            (logsByHabit[h._id] || []).map(
              (date) =>
                String(date).slice(0, 10)
            )
          );

          return (
            <div
              key={h._id}
              className="grid grid-cols-[180px_repeat(7,minmax(0,1fr))] gap-2 items-center py-2 border-t divider"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{
                    background: `${h.color}26`,
                    color: h.color,
                  }}
                >
                  {h.icon}
                </span>

                <span className="text-sm truncate">
                  {h.name}
                </span>
              </div>

              {days.map((d) => {
                const isDone = done.has(
                  d.key
                );

                return (
                  <div
                    key={d.key}
                    className="flex items-center justify-center"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                        isDone
                          ? "text-white scale-105"
                          : "bg-gray-100 dark:bg-zinc-800 border-transparent"
                      }`}
                      style={
                        isDone
                          ? {
                              backgroundColor:
                                h.color,
                              borderColor:
                                h.color,
                              boxShadow: `0 4px 14px ${h.color}66`,
                            }
                          : {}
                      }
                    >
                      {isDone && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          color="white"
                        />
                      )}
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
}