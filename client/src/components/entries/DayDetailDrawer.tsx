import { useState } from "react";
import { createPortal } from "react-dom";
import { LogEntryModal } from "./LogEntryModal";
import { useDeleteEntry } from "../../hooks/useEntries";
import { formatDisplayDate, fromISODate, formatTime } from "../../utils/dates";
import type { HabitEntry, Habit } from "../../types";

interface DayDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  date: string;
  entries: HabitEntry[];
  habits: Habit[];
}

export function DayDetailDrawer({ open, onClose, date, entries, habits }: DayDetailDrawerProps) {
  const [editingEntry, setEditingEntry] = useState<HabitEntry | null>(null);
  const [addingHabit, setAddingHabit] = useState<Habit | null>(null);
  const deleteEntry = useDeleteEntry();

  if (!open) return null;

  const handleDelete = async (entry: HabitEntry) => {
    if (window.confirm(`Remove this ${entry.habit.name} entry?`)) {
      await deleteEntry.mutateAsync(entry.id);
    }
  };

  const activeHabits = habits.filter((h) => !h.archived);

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col md:left-auto md:top-0 md:right-0 md:bottom-0 md:rounded-none md:rounded-l-2xl md:w-80 md:max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{formatDisplayDate(fromISODate(date))}</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
          {/* Logged entries */}
          {entries.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Logged</p>
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: entry.habit.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {entry.habit.emoji} {entry.habit.name}
                      </span>
                      {entry.time && <span className="text-xs text-zinc-400">{formatTime(entry.time)}</span>}
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{entry.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry)}
                      className="text-xs text-red-400 hover:text-red-600 p-1 rounded"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add more */}
          {activeHabits.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Add</p>
              {activeHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => setAddingHabit(habit)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {habit.emoji} {habit.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {entries.length === 0 && activeHabits.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-4">No habits to show</p>
          )}
        </div>
      </div>

      <LogEntryModal open={!!editingEntry} onClose={() => setEditingEntry(null)} entry={editingEntry ?? undefined} />
      <LogEntryModal
        open={!!addingHabit}
        onClose={() => setAddingHabit(null)}
        habit={addingHabit ?? undefined}
        date={date}
      />
    </>,
    document.body
  );
}
