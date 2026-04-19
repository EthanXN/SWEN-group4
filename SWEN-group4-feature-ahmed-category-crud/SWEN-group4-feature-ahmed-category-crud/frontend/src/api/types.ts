export interface Item {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  available: boolean;
  category: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  role: 'OWNER' | 'HELPER';
  message: string;
}

export interface AuthStatus {
  username: string;
  role: 'OWNER' | 'HELPER';
}

export interface CollectionResponse {
  message: string;
  collection: Item[];
}

export interface CommitResponse {
  message: string;
  committedItems: Item[];
  collection: Item[];
}

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface LocalOrder {
  id: string;
  submittedAt: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalCost: number;
}

export interface ApiError {
  error: string;
}
