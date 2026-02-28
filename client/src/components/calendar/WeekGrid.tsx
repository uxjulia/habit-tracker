import { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import {
  toISODate,
  formatDayOfWeek,
  formatDayNumber,
  isToday,
} from "../../utils/dates";
import { LogEntryModal } from "../entries/LogEntryModal";
import type { Habit, HabitEntry } from "../../types";

interface WeekGridProps {
  days: Date[];
  habits: Habit[];
  entries: HabitEntry[];
  onDayClick: (date: string, entries: HabitEntry[]) => void;
}

export function WeekGrid({ days, habits, entries, onDayClick }: WeekGridProps) {
  const [logTarget, setLogTarget] = useState<{
    habit: Habit;
    date: string;
  } | null>(null);

  const entryMap = useMemo(() => {
    const map = new Map<string, HabitEntry[]>();
    for (const entry of entries) {
      const key = `${entry.habitId}-${entry.date}`;
      const existing = map.get(key) ?? [];
      existing.push(entry);
      map.set(key, existing);
    }
    return map;
  }, [entries]);

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No habits yet. Create one to get started.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-4 px-4 md:overflow-x-visible md:mx-0 md:px-0">
        <div className="min-w-[480px]">
          {/* Header row */}
          <div
            className="grid items-center mb-1"
            style={{ gridTemplateColumns: "120px repeat(7, 1fr)" }}
          >
            <div /> {/* Empty corner */}
            {days.map((day) => {
              const today = isToday(day);
              return (
                <div key={toISODate(day)} className="text-center">
                  <p className="text-xs text-zinc-400">
                    {formatDayOfWeek(day)}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium mx-auto w-7 h-7 flex items-center justify-center rounded-full",
                      today
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "text-zinc-700 dark:text-zinc-300",
                    )}
                  >
                    {formatDayNumber(day)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Habit rows */}
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="grid items-center py-1 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              style={{ gridTemplateColumns: "120px repeat(7, 1fr)" }}
            >
              {/* Habit label */}
              <div className="flex items-center gap-2 pr-3 overflow-hidden">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                  {habit.emoji} {habit.name}
                </span>
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const dateStr = toISODate(day);
                const key = `${habit.id}-${dateStr}`;
                const dayEntries = entryMap.get(key) ?? [];
                const hasEntries = dayEntries.length > 0;

                return (
                  <button
                    key={dateStr}
                    onClick={() =>
                      hasEntries
                        ? onDayClick(dateStr, dayEntries)
                        : setLogTarget({ habit, date: dateStr })
                    }
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 h-10 rounded-lg transition-colors",
                      hasEntries
                        ? "hover:opacity-80"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    )}
                  >
                    {dayEntries.map((entry) => (
                      <span
                        key={entry.id}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: habit.color }}
                        title={entry.time ?? undefined}
                      />
                    ))}
                    {!hasEntries && (
                      <span className="w-2.5 h-2.5 rounded-full border border-zinc-200 dark:border-zinc-700" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <LogEntryModal
        open={!!logTarget}
        onClose={() => setLogTarget(null)}
        habit={logTarget?.habit}
        date={logTarget?.date}
      />
    </>
  );
}
