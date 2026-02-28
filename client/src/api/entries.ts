import { apiClient } from './client';
import type { HabitEntry } from '../types';

export async function getTodayEntries(): Promise<HabitEntry[]> {
  const res = await apiClient.get<{ data: HabitEntry[] }>('/entries/today');
  return res.data.data;
}

export async function getEntries(startDate: string, endDate: string, habitId?: string): Promise<HabitEntry[]> {
  const res = await apiClient.get<{ data: HabitEntry[] }>('/entries', {
    params: { startDate, endDate, ...(habitId ? { habitId } : {}) },
  });
  return res.data.data;
}

export async function createEntry(data: {
  habitId: string;
  date: string;
  time?: string;
  notes?: string;
}): Promise<HabitEntry> {
  const res = await apiClient.post<{ data: HabitEntry }>('/entries', data);
  return res.data.data;
}

export async function updateEntry(
  id: string,
  data: { time?: string | null; notes?: string | null }
): Promise<HabitEntry> {
  const res = await apiClient.put<{ data: HabitEntry }>(`/entries/${id}`, data);
  return res.data.data;
}

export async function deleteEntry(id: string): Promise<void> {
  await apiClient.delete(`/entries/${id}`);
}
