import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as entriesApi from '../api/entries';
import { queryKeys } from '../api/queryKeys';

export function useTodayEntries() {
  return useQuery({
    queryKey: queryKeys.entries.today,
    queryFn: entriesApi.getTodayEntries,
  });
}

export function useEntries(startDate: string, endDate: string) {
  return useQuery({
    queryKey: queryKeys.entries.range(startDate, endDate),
    queryFn: () => entriesApi.getEntries(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useCreateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entriesApi.createEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.entries.all });
    },
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof entriesApi.updateEntry>[1] }) =>
      entriesApi.updateEntry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.entries.all });
    },
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entriesApi.deleteEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.entries.all });
    },
  });
}
