import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ColorPicker } from "../ui/ColorPicker";
import { useCreateHabit, useUpdateHabit } from "../../hooks/useHabits";
import { PRESET_COLORS } from "../../utils/colors";
import type { Habit } from "../../types";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  emoji: z.string().max(10).optional(),
});

type FormData = z.infer<typeof schema>;

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  habit?: Habit;
}

export function HabitForm({ open, onClose, habit }: HabitFormProps) {
  const isEdit = !!habit;
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", color: PRESET_COLORS[0], emoji: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: habit?.name ?? "",
        color: habit?.color ?? PRESET_COLORS[0],
        emoji: habit?.emoji ?? "",
      });
    }
  }, [open, habit, reset]);

  const color = watch("color");

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateHabit.mutateAsync({
          id: habit.id,
          data: {
            name: data.name,
            color: data.color,
            emoji: data.emoji || null,
          },
        });
      } else {
        await createHabit.mutateAsync({
          name: data.name,
          color: data.color,
          emoji: data.emoji || undefined,
        });
      }
      onClose();
    } catch {
      // errors handled by mutation
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Habit" : "New Habit"}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4">
        <Input
          label="Name"
          placeholder="e.g. Morning Run"
          error={errors.name?.message}
          {...register("name")}
          autoFocus
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Emoji <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <input
            {...register("emoji")}
            className="w-20 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:caret-white"
          />
        </div>

        <ColorPicker value={color} onChange={(c) => setValue("color", c)} />

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
