import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as habitsApi from "../api/habits";
import { queryKeys } from "../api/queryKeys";

export function useHabits(includeArchived = false) {
  return useQuery({
    queryKey: queryKeys.habits.list(includeArchived),
    queryFn: () => habitsApi.listHabits(includeArchived),
  });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.createHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.habits.all }),
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof habitsApi.updateHabit>[1] }) =>
      habitsApi.updateHabit(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.habits.all }),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.deleteHabit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.habits.all });
      qc.invalidateQueries({ queryKey: queryKeys.entries.all });
    },
  });
}

export function useReorderHabits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.reorderHabits,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.habits.all }),
  });
}
