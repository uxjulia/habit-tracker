import { useState } from "react";
import { addDays, subDays } from "date-fns";
import { Button } from "../components/ui/Button";
import { LogEntryModal } from "../components/entries/LogEntryModal";
import { useHabits } from "../hooks/useHabits";
import { useEntries, useDeleteEntry } from "../hooks/useEntries";
import { format } from "date-fns";
import { toISODate, formatDisplayDate, formatTime } from "../utils/dates";
import type { Habit, HabitEntry } from "../types";

export function TodayPage() {
  const todayStr = toISODate(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = toISODate(currentDate);
  const isCurrentDay = dateStr === todayStr;

  const { data: habits = [] } = useHabits();
  const { data: entries = [] } = useEntries(dateStr, dateStr);
  const deleteEntry = useDeleteEntry();

  const [logTarget, setLogTarget] = useState<{ habit: Habit; date: string } | null>(null);
  const [editTarget, setEditTarget] = useState<HabitEntry | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const goToPreviousDay = () => setCurrentDate((d) => subDays(d, 1));
  const goToNextDay = () => {
    if (!isCurrentDay) setCurrentDate((d) => addDays(d, 1));
  };

  const handleDelete = async (entry: HabitEntry) => {
    if (window.confirm(`Remove this ${entry.habit.name} entry?`)) {
      await deleteEntry.mutateAsync(entry.id);
    }
  };

  // Group entries by habitId for display
  const entriesByHabit = entries.reduce<Record<string, HabitEntry[]>>((acc, entry) => {
    if (!acc[entry.habitId]) acc[entry.habitId] = [];
    acc[entry.habitId].push(entry);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousDay}
            className="flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Previous day"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {isCurrentDay ? "Today" : format(currentDate, "EEEE")}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatDisplayDate(currentDate)}</p>
          </div>
          <button
            onClick={goToNextDay}
            disabled={isCurrentDay}
            className="flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400"
            aria-label="Next day"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {!isCurrentDay && (
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-sm px-2.5 py-1 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">No habits yet</p>
          <a href="/habits" className="text-sm text-zinc-600 dark:text-zinc-400 underline underline-offset-2">
            Create your first habit →
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {habits.map((habit) => {
            const habitEntries = entriesByHabit[habit.id] ?? [];
            const isLogged = habitEntries.length > 0;

            return (
              <div
                key={habit.id}
                className="bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden"
              >
                {/* Habit row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {habit.emoji} {habit.name}
                    </span>
                  </div>
                  <Button
                    variant={isLogged ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => setLogTarget({ habit, date: dateStr })}
                  >
                    {isLogged ? "+ Log Again" : "Log"}
                  </Button>
                </div>

                {/* Logged entries for today */}
                {habitEntries.length > 0 && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {habitEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5">
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          {entry.time && (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-2">
                              {formatTime(entry.time)}
                            </span>
                          )}
                          {entry.notes && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{entry.notes}</span>
                          )}
                          {!entry.time && !entry.notes && <span className="text-xs text-zinc-400">Logged</span>}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setEditTarget(entry)}
                            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry)}
                            className="text-xs text-red-400 hover:text-red-600 px-1"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FAB for mobile */}
      <button
        onClick={() => setShowPicker(true)}
        className="fixed bottom-20 right-4 md:hidden w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg flex items-center justify-center text-2xl z-20 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        aria-label="Quick log"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Habit picker bottom sheet */}
      {showPicker && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowPicker(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-2xl p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-4" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Log a habit</p>
            <div className="flex flex-col gap-1">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => {
                    setShowPicker(false);
                    setLogTarget({ habit, date: dateStr });
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {habit.emoji} {habit.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <LogEntryModal
        open={!!logTarget}
        onClose={() => setLogTarget(null)}
        habit={logTarget?.habit}
        date={logTarget?.date}
      />
      <LogEntryModal open={!!editTarget} onClose={() => setEditTarget(null)} entry={editTarget ?? undefined} />
    </div>
  );
}
