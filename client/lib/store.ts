import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  product_id?: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  image: string | string[];
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: Omit<CartItem, "quantity">, locale: string) => Promise<void>;
  removeItem: (id: number, locale: string) => Promise<void>;
  updateQuantity: (id: number, quantity: number, locale: string) => Promise<void>;
  clearCart: (locale: string) => Promise<void>;
  syncWithBackend: (locale: string) => Promise<void>;
  total: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: async (item, locale) => {
        set({ isLoading: true, error: null });

        try {
          const existingItem = get().items.find((i) => i.id === item.id);
          const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

          // Update local state first for immediate UI feedback
          if (existingItem) {
            set({
              items: get().items.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i)),
            });
          } else {
            set({ items: [...get().items, { ...item, quantity: 1 }] });
          }

          // Then sync with backend
          await syncCartItem(item.id, newQuantity, locale);
          await get().syncWithBackend(locale);
        } catch (error) {
          console.error("Error adding item to cart:", error);
          set({ error: "Failed to add item to cart" });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (id, locale) => {
        set({ isLoading: true, error: null });

        try {
          // Update local state first
          set({ items: get().items.filter((item) => item.id !== id) });

          // Then sync with backend
          await syncCartItem(id, 0, locale);
          await get().syncWithBackend(locale);
        } catch (error) {
          console.error("Error removing item from cart:", error);
          set({ error: "Failed to remove item from cart" });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (id, quantity, locale) => {
        set({ isLoading: true, error: null });

        try {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            set({ items: get().items.filter((item) => item.id !== id) });
          } else {
            // Update quantity
            set({
              items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
            });
          }

          // Sync with backend
          await syncCartItem(id, quantity, locale);
          await get().syncWithBackend(locale);
        } catch (error) {
          console.error("Error updating cart item quantity:", error);
          set({ error: "Failed to update item quantity" });
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async (locale) => {
        set({ isLoading: true, error: null });

        try {
          // Clear local cart
          set({ items: [] });

          // Attempt to clear backend cart
          try {
            await clearBackendCart(locale);
            console.log('Backend cart cleared successfully');
          } catch (backendError) {
            console.warn('Failed to clear backend cart, local cart cleared:', backendError);
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
          set({ error: "Failed to clear cart" });
        } finally {
          set({ isLoading: false });
        }
      },

      syncWithBackend: async (locale) => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn('No token found, skipping cart sync');
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": locale,
            },
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
              name_en: item.name_en,
              name_ar: item.name_ar,
              description_en: item.description_en,
              description_ar: item.description_ar,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            }));

            set({ items: mappedItems });
            console.log('Cart synced successfully:', mappedItems);
          }
        } catch (error) {
          console.error("Error syncing with backend:", error);
          set({ error: "Failed to sync cart with server" });
        } finally {
          set({ isLoading: false });
        }
      },

      total: () =>
        get().items.reduce((sum, item) => {
          const price = item.price;
          return sum + price * item.quantity;
        }, 0),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Helper functions for API calls
async function syncCartItem(productId: number, quantity: number, locale: string) {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  if (!token) {
    console.warn('No token found, skipping cart item sync');
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": locale,
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to update cart: ${errorData.message}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API error updating cart:", error);
    throw error;
  }
}

async function clearBackendCart(locale: string) {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, skipping backend cart clear");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": locale,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to clear cart: ${errorData.message}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API error clearing cart:", error);
    throw error;
  }
}

// Initialize cart from backend when the store is first created
if (typeof window !== "undefined") {
  const initializeCart = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Get the current locale from localStorage
        const locale = localStorage.getItem("locale") || "ar";

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": locale,
          },
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
            name_en: item.name_en,
            name_ar: item.name_ar,
            description_en: item.description_en,
            description_ar: item.description_ar,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          }));

          useCartStore.setState({ items: mappedItems });
          console.log('Cart initialized:', mappedItems);
        }
      } catch (error) {
        console.error("Initial cart load error:", error);
      }
    }
  };

  initializeCart();
}