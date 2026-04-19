import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { collectionApi } from '../api/collection';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './ToastContext';
import type { CartItem, Item, LocalOrder } from '../api/types';

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  refresh: () => Promise<void>;
  addItem: (item: Item) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, qty: number) => void;
  checkout: () => Promise<LocalOrder | null>;
}

const QUANTITIES_KEY = 'freshbite_cart_quantities';
const ORDERS_KEY = 'freshbite_orders';

function loadQuantities(): Record<number, number> {
  try {
    return JSON.parse(localStorage.getItem(QUANTITIES_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveQuantities(q: Record<number, number>) {
  localStorage.setItem(QUANTITIES_KEY, JSON.stringify(q));
}

export function loadOrders(): LocalOrder[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveOrder(order: LocalOrder) {
  const orders = loadOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>(loadQuantities);

  const isHelper = isLoggedIn && role === 'HELPER';

  const refresh = useCallback(async () => {
    if (!isHelper) return;
    setLoading(true);
    try {
      const serverItems = await collectionApi.get();
      const q = loadQuantities();
      setItems(
        serverItems.map((item) => ({
          item,
          quantity: q[item.id] || 1,
        }))
      );
    } catch {
      // silently fail — user might not be logged in yet
    } finally {
      setLoading(false);
    }
  }, [isHelper]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (item: Item) => {
    const existing = items.find((ci) => ci.item.id === item.id);
    if (existing) {
      const newQty = existing.quantity + 1;
      updateQuantity(item.id, newQty);
      showToast(`Updated ${item.name} quantity to ${newQty}`, 'success');
      return;
    }
    try {
      await collectionApi.add(item.id);
      const newQ = { ...quantities, [item.id]: 1 };
      setQuantities(newQ);
      saveQuantities(newQ);
      setItems((prev) => [...prev, { item, quantity: 1 }]);
      showToast(`${item.name} added to cart`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add item';
      showToast(msg, 'error');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await collectionApi.remove(itemId);
      const newQ = { ...quantities };
      delete newQ[itemId];
      setQuantities(newQ);
      saveQuantities(newQ);
      setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
      showToast('Item removed from cart', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove item';
      showToast(msg, 'error');
    }
  };

  const updateQuantity = (itemId: number, qty: number) => {
    if (qty < 1) return;
    const newQ = { ...quantities, [itemId]: qty };
    setQuantities(newQ);
    saveQuantities(newQ);
    setItems((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: qty } : ci))
    );
  };

  const checkout = async (): Promise<LocalOrder | null> => {
    try {
      const res = await collectionApi.commit();
      const order: LocalOrder = {
        id: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        items: res.committedItems.map((ci) => ({
          id: ci.id,
          name: ci.name,
          quantity: quantities[ci.id] || 1,
          price: ci.price ?? 0,
        })),
        totalCost: res.committedItems.reduce(
          (sum, ci) => sum + (ci.price ?? 0) * (quantities[ci.id] || 1),
          0
        ),
      };
      saveOrder(order);
      setItems([]);
      setQuantities({});
      saveQuantities({});
      showToast('Order placed successfully!', 'success');
      return order;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      showToast(msg, 'error');
      return null;
    }
  };

  const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalPrice = items.reduce(
    (sum, ci) => sum + (ci.item.price ?? 0) * ci.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, loading, totalItems, totalPrice, refresh, addItem, removeItem, updateQuantity, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
