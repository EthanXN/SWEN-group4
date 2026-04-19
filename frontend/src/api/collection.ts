import { api } from './client';
import type { Item, CollectionResponse, CommitResponse } from './types';

export const collectionApi = {
  get: () => api.get<Item[]>('/collection'),
  add: (itemId: number) => api.post<CollectionResponse>(`/collection/${itemId}`),
  remove: (itemId: number) => api.delete<CollectionResponse>(`/collection/${itemId}`),
  commit: () => api.post<CommitResponse>('/collection/commit'),
};
