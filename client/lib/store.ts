import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id?: number; // Optional cart ID from the server
  product_id: number; // Product ID
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'id'>) => void;
  removeItem: (product_id: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  syncWithServer: () => Promise<void>;
};

const debounce = <F extends (...args: Parameters<F>) => Promise<void>>(func: F, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<void> =>
    new Promise((resolve, reject) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          await func(...args);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.product_id === item.product_id);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
        get().syncWithServer();
      },

      removeItem: (product_id) => {
        set({ items: get().items.filter((item) => item.product_id !== product_id) });
        get().syncWithServer();
      },
      updateQuantity: (product_id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.product_id !== product_id) });
        } else {
          set({
            items: get().items.map((item) =>
              item.product_id === product_id ? { ...item, quantity } : item
            ),
          });
        }
        get().syncWithServer();
      },
      clearCart: () => {
        set({ items: [] });
        get().syncWithServer();
      },
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      syncWithServer: debounce(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const items = get().items;
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ items }),
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Failed to sync cart: ${errorData.message}`);
          }
          console.log('Cart synced successfully');
        } catch (error) {
          console.error('Cart sync error:', error);
        }
      }, 1000),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

if (typeof window !== 'undefined') {
  const initializeCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Failed to load cart: ${errorData.message}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const mappedItems = data.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          }));
          useCartStore.setState({ items: mappedItems });
        }
      } catch (error) {
        console.error('Initial cart load error:', error);
      }
    }
  };
  initializeCart();
}