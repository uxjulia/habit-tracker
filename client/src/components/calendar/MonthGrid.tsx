import { useMemo } from "react";
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { getMonthDays, toISODate } from "../../utils/dates";
import { DayCell } from "./DayCell";
import type { HabitEntry } from "../../types";

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthGridProps {
  month: Date;
  entries: HabitEntry[];
  onDayClick: (date: string) => void;
}

export function MonthGrid({ month, entries, onDayClick }: MonthGridProps) {
  const days = useMemo(() => {
    const monthDays = getMonthDays(month);
    const start = startOfWeek(monthDays[0], { weekStartsOn: 0 });
    const end = endOfWeek(monthDays[monthDays.length - 1], { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, HabitEntry[]>();
    for (const entry of entries) {
      const existing = map.get(entry.date) ?? [];
      existing.push(entry);
      map.set(entry.date, existing);
    }
    return map;
  }, [entries]);

  return (
    <div className="flex flex-col gap-1">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-zinc-400 dark:text-zinc-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day) => {
          const dateStr = toISODate(day);
          return (
            <DayCell
              key={dateStr}
              date={day}
              currentMonth={month}
              entries={entriesByDate.get(dateStr) ?? []}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
