import { useState } from "react";
import { Button } from "../components/ui/Button";
import { WeekGrid } from "../components/calendar/WeekGrid";
import { DayDetailDrawer } from "../components/entries/DayDetailDrawer";
import { useHabits } from "../hooks/useHabits";
import { useEntries } from "../hooks/useEntries";
import { getWeekDays, getWeekStart, getWeekEnd, addWeeks, subWeeks, toISODate, formatWeekRange } from "../utils/dates";
import type { HabitEntry } from "../types";

export function WeekPage() {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [drawerDate, setDrawerDate] = useState<string | null>(null);
  const [drawerEntries, setDrawerEntries] = useState<HabitEntry[]>([]);

  const days = getWeekDays(referenceDate);
  const startDate = toISODate(getWeekStart(referenceDate));
  const endDate = toISODate(getWeekEnd(referenceDate));

  const { data: habits = [] } = useHabits();
  const { data: entries = [] } = useEntries(startDate, endDate);

  const handleDayClick = (date: string, dayEntries: HabitEntry[]) => {
    setDrawerDate(date);
    setDrawerEntries(dayEntries);
  };

  const drawerHabit = drawerEntries[0]?.habit;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Week</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setReferenceDate(subWeeks(referenceDate, 1))}>
            ←
          </Button>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[160px] text-center">
            {formatWeekRange(days[0], days[6])}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReferenceDate(addWeeks(referenceDate, 1))}>
            →
          </Button>
        </div>
      </div>

      <WeekGrid days={days} habits={habits} entries={entries} onDayClick={handleDayClick} />

      <DayDetailDrawer
        open={!!drawerDate}
        onClose={() => setDrawerDate(null)}
        date={drawerDate ?? ""}
        entries={drawerEntries}
        habits={habits}
      />
    </div>
  );
}
