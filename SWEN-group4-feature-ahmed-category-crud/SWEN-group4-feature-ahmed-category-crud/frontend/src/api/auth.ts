import { api } from './client';
import type { LoginRequest, AuthResponse, AuthStatus } from './types';

export const authApi = {
  register: (data: LoginRequest) => api.post<{ message: string }>('/auth/register', data),
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  logout: () => api.post<{ message: string }>('/auth/logout'),
  status: () => api.get<AuthStatus>('/auth/status'),
};
