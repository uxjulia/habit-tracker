import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { MonthGrid } from '../components/calendar/MonthGrid';
import { DayDetailDrawer } from '../components/entries/DayDetailDrawer';
import { useHabits } from '../hooks/useHabits';
import { useEntries } from '../hooks/useEntries';
import {
  addMonths,
  subMonths,
  toISODate,
  formatMonthYear,
  startOfMonth,
  endOfMonth,
} from '../utils/dates';
import type { HabitEntry } from '../types';

export function MonthPage() {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [drawerDate, setDrawerDate] = useState<string | null>(null);

  const startDate = toISODate(startOfMonth(referenceDate));
  const endDate = toISODate(endOfMonth(referenceDate));

  const { data: habits = [] } = useHabits();
  const { data: entries = [] } = useEntries(startDate, endDate);

  const drawerEntries: HabitEntry[] = drawerDate
    ? entries.filter((e) => e.date === drawerDate)
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Month</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setReferenceDate(subMonths(referenceDate, 1))}>
            ←
          </Button>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[120px] text-center">
            {formatMonthYear(referenceDate)}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReferenceDate(addMonths(referenceDate, 1))}>
            →
          </Button>
        </div>
      </div>

      <MonthGrid
        month={referenceDate}
        entries={entries}
        onDayClick={(date) => setDrawerDate(date)}
      />

      {/* Color legend */}
      {habits.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {habit.emoji} {habit.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <DayDetailDrawer
        open={!!drawerDate}
        onClose={() => setDrawerDate(null)}
        date={drawerDate ?? ''}
        entries={drawerEntries}
        habits={habits}
      />
    </div>
  );
}
