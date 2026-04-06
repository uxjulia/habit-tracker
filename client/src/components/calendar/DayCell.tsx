import { cn } from "../../utils/cn";
import { isToday, isSameMonth, formatDayNumber, fromISODate, toISODate } from "../../utils/dates";
import type { HabitEntry } from "../../types";

const MAX_DOTS = 6;

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  entries: HabitEntry[];
  onClick: (date: string) => void;
}

export function DayCell({ date, currentMonth, entries, onClick }: DayCellProps) {
  const dateStr = toISODate(date);
  const today = isToday(date);
  const sameMonth = isSameMonth(date, currentMonth);

  // Deduplicate dots by habit (show one dot per habit, even if logged multiple times)
  const seen = new Set<string>();
  const uniqueHabitEntries = entries.filter((e) => {
    if (seen.has(e.habitId)) return false;
    seen.add(e.habitId);
    return true;
  });

  const visible = uniqueHabitEntries.slice(0, MAX_DOTS);
  const overflow = uniqueHabitEntries.length - MAX_DOTS;

  return (
    <button
      onClick={() => onClick(dateStr)}
      className={cn(
        "relative flex flex-col p-1.5 sm:p-2 rounded-xl text-left transition-colors min-h-[52px] sm:min-h-[64px]",
        sameMonth ? "hover:bg-zinc-100 dark:hover:bg-zinc-800" : "opacity-30 pointer-events-none",
        today && "bg-zinc-100 dark:bg-zinc-800"
      )}
    >
      <span
        className={cn(
          "text-xs sm:text-sm font-medium leading-none mb-1.5 self-end",
          today
            ? "w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-xs"
            : "text-zinc-700 dark:text-zinc-300"
        )}
      >
        {formatDayNumber(date)}
      </span>

      <div className="flex flex-wrap gap-0.5">
        {visible.map((entry) => (
          <span
            key={entry.habitId}
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.habit.color }}
            title={entry.habit.name}
          />
        ))}
        {overflow > 0 && <span className="text-[9px] text-zinc-400 leading-none self-end">+{overflow}</span>}
      </div>
    </button>
  );
}
