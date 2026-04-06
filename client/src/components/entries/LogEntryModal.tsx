import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useCreateEntry, useUpdateEntry } from "../../hooks/useEntries";
import { formatDisplayDate, fromISODate } from "../../utils/dates";
import type { Habit, HabitEntry } from "../../types";

interface LogEntryModalProps {
  open: boolean;
  onClose: () => void;
  habit?: Habit;
  date?: string;
  entry?: HabitEntry;
}

interface FormData {
  time: string;
  notes: string;
}

export function LogEntryModal({
  open,
  onClose,
  habit,
  date,
  entry,
}: LogEntryModalProps) {
  const isEdit = !!entry;
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();

  const { register, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: { time: "", notes: "" },
  });

  useEffect(() => {
    if (open) {
      let defaultTime = entry?.time ?? "";
      if (!entry) {
        const now = new Date();
        defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      }

      reset({
        time: defaultTime,
        notes: entry?.notes ?? "",
      });
    }
  }, [open, entry, reset]);

  const effectiveHabit = habit ?? entry?.habit;
  const effectiveDate = date ?? entry?.date;

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateEntry.mutateAsync({
          id: entry.id,
          data: { time: data.time || null, notes: data.notes || null },
        });
      } else {
        await createEntry.mutateAsync({
          habitId: effectiveHabit!.id,
          date: effectiveDate!,
          time: data.time || undefined,
          notes: data.notes || undefined,
        });
      }
      onClose();
    } catch {
      // handled by mutation
    }
  };

  const isPending = createEntry.isPending || updateEntry.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Entry" : `Log: ${effectiveHabit?.name}`}
      bottomSheet
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 flex flex-col gap-4"
      >
        {/* Habit info */}
        {effectiveHabit && (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: effectiveHabit.color }}
            />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {effectiveHabit.name}
            </span>
            {effectiveHabit.emoji && <span>{effectiveHabit.emoji}</span>}
          </div>
        )}

        {/* Date display */}
        {effectiveDate && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatDisplayDate(fromISODate(effectiveDate))}
          </p>
        )}

        {/* Time */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="entry-time"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Time <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="entry-time"
              type="time"
              {...register("time")}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-fit"
            />
            <button
              type="button"
              onClick={() => setValue("time", "")}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="entry-notes"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Notes <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="entry-notes"
            {...register("notes")}
            rows={3}
            placeholder="Add a note..."
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isEdit ? "Save Changes" : "Log Habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
