import { apiClient } from './client';

export async function login(username: string, password: string) {
  const res = await apiClient.post<{ data: { token: string; username: string }; error: null }>(
    '/auth/login',
    { username, password }
  );
  return res.data.data;
}

export async function setup(username: string, password: string) {
  const res = await apiClient.post<{ data: { token: string; username: string }; error: null }>(
    '/auth/setup',
    { username, password }
  );
  return res.data.data;
}

export async function getMe() {
  const res = await apiClient.get<{ data: { username: string }; error: null }>('/auth/me');
  return res.data.data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await apiClient.put<{ data: { success: boolean }; error: null }>('/auth/password', {
    currentPassword,
    newPassword,
  });
  return res.data.data;
}

export async function getStatus(): Promise<{ setupRequired: boolean }> {
  const res = await apiClient.get<{ data: { setupRequired: boolean }; error: null }>('/auth/status');
  return res.data.data;
}
