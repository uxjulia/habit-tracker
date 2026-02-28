import { apiClient } from './client';
import type { Habit } from '../types';

export async function listHabits(includeArchived = false): Promise<Habit[]> {
  const res = await apiClient.get<{ data: Habit[] }>('/habits', {
    params: includeArchived ? { includeArchived: 'true' } : {},
  });
  return res.data.data;
}

export async function createHabit(data: { name: string; color: string; emoji?: string }): Promise<Habit> {
  const res = await apiClient.post<{ data: Habit }>('/habits', data);
  return res.data.data;
}

export async function updateHabit(
  id: string,
  data: { name?: string; color?: string; emoji?: string | null; archived?: boolean; sortOrder?: number }
): Promise<Habit> {
  const res = await apiClient.put<{ data: Habit }>(`/habits/${id}`, data);
  return res.data.data;
}

export async function deleteHabit(id: string): Promise<void> {
  await apiClient.delete(`/habits/${id}`);
}

export async function reorderHabits(ids: string[]): Promise<void> {
  await apiClient.put('/habits/reorder', { ids });
}
