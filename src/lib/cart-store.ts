import { useSyncExternalStore } from "react";

export interface CartExtra {
  name: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  sizePrice: number;
  extras: CartExtra[];
  observation: string;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = "ifood-cart";

function loadCart(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

let state: CartState = loadCart();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): CartState {
    return state;
  },
  getServerSnapshot(): CartState {
    return { items: [] };
  },
  addItem(item: Omit<CartItem, "id">) {
    state = {
      items: [
        ...state.items,
        { ...item, id: crypto.randomUUID?.() ?? Math.random().toString(36) },
      ],
    };
    emit();
  },
  updateQuantity(id: string, delta: number) {
    state = {
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0),
    };
    emit();
  },
  removeItem(id: string) {
    state = { items: state.items.filter((i) => i.id !== id) };
    emit();
  },
  clear() {
    state = { items: [] };
    emit();
  },
  getTotal(): number {
    return state.items.reduce((sum, item) => {
      const extrasTotal = item.extras.reduce((s, e) => s + e.price * e.quantity, 0);
      return sum + (item.sizePrice + extrasTotal) * item.quantity;
    }, 0);
  },
  getCount(): number {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  },
};

export function useCart() {
  const cart = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );

  return {
    items: cart.items,
    total: cartStore.getTotal(),
    count: cartStore.getCount(),
    addItem: cartStore.addItem,
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.removeItem,
    clear: cartStore.clear,
  };
}
