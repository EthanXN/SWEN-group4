import { api } from './client';
import type { User } from './types';

export interface UserCreatePayload {
  username: string;
  password: string;
  role: 'OWNER' | 'HELPER';
}

export interface UserUpdatePayload {
  username?: string;
  password?: string;
  role?: 'OWNER' | 'HELPER';
}

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (body: UserCreatePayload) => api.post<User>('/users/add', body),
  update: (id: number, body: UserUpdatePayload) => api.put<User>(`/users/${id}/update`, body),
  delete: (id: number) => api.delete<{ message: string }>(`/users/${id}/delete`),
};
