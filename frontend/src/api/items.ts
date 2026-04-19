import { api } from './client';
import type { Item } from './types';

export const itemsApi = {
  getAll: () => api.get<Item[]>('/items'),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  search: (query: string) => api.get<Item[]>(`/items/search?query=${encodeURIComponent(query)}`),
  create: (item: Partial<Item>) => api.post<Item>('/items', item),
  update: (id: number, item: Partial<Item>) => api.put<Item>(`/items/${id}`, item),
  delete: (id: number) => api.delete<{ message: string }>(`/items/${id}`),
};
