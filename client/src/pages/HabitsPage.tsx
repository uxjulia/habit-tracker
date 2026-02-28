import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../components/ui/Button';
import { HabitForm } from '../components/habits/HabitForm';
import { useHabits, useUpdateHabit, useDeleteHabit, useReorderHabits } from '../hooks/useHabits';
import type { Habit } from '../types';

function SortableHabitRow({ habit, onEdit, onArchive, onDelete }: {
  habit: Habit;
  onEdit: (h: Habit) => void;
  onArchive: (h: Habit) => void;
  onDelete: (h: Habit) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM9 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM9 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </button>

      {/* Color dot */}
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />

      {/* Name */}
      <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
        {habit.emoji && <span className="mr-1">{habit.emoji}</span>}
        {habit.name}
      </span>

      {/* Actions */}
      <Button variant="ghost" size="sm" onClick={() => onEdit(habit)}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onArchive(habit)} className="text-zinc-400">
        Archive
      </Button>
    </div>
  );
}

export function HabitsPage() {
  const { data: allHabits = [] } = useHabits(true);
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();
  const reorderHabits = useReorderHabits();

  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const activeHabits = allHabits.filter((h) => !h.archived);
  const archivedHabits = allHabits.filter((h) => h.archived);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeHabits.findIndex((h) => h.id === active.id);
    const newIndex = activeHabits.findIndex((h) => h.id === over.id);
    const reordered = arrayMove(activeHabits, oldIndex, newIndex);
    await reorderHabits.mutateAsync(reordered.map((h) => h.id));
  };

  const handleArchive = async (habit: Habit) => {
    await updateHabit.mutateAsync({ id: habit.id, data: { archived: true } });
  };

  const handleRestore = async (habit: Habit) => {
    await updateHabit.mutateAsync({ id: habit.id, data: { archived: false } });
  };

  const handleDelete = async (habit: Habit) => {
    if (window.confirm(`Delete "${habit.name}" and all its entries? This cannot be undone.`)) {
      await deleteHabit.mutateAsync(habit.id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Habits</h1>
        <Button
          size="sm"
          onClick={() => { setEditingHabit(undefined); setFormOpen(true); }}
        >
          + New Habit
        </Button>
      </div>

      {/* Active habits */}
      {activeHabits.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="mb-4">No habits yet</p>
          <p className="text-sm">Create your first habit to start tracking</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeHabits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {activeHabits.map((habit) => (
                <SortableHabitRow
                  key={habit.id}
                  habit={habit}
                  onEdit={(h) => { setEditingHabit(h); setFormOpen(true); }}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Archived habits */}
      {archivedHabits.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-3">Archived</p>
          <div className="flex flex-col gap-2">
            {archivedHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 opacity-60"
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 opacity-50" style={{ backgroundColor: habit.color }} />
                <span className="flex-1 text-sm text-zinc-600 dark:text-zinc-400 truncate line-through">
                  {habit.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleRestore(habit)}>
                  Restore
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(habit)} className="text-red-400 hover:text-red-600">
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <HabitForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingHabit(undefined); }}
        habit={editingHabit}
      />
    </div>
  );
}
