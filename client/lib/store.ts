import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { fetchCart, updateCartItem, clearCart } from './api';

interface CartItem {
    id: number;
    product_id: number;
    
    customer_id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    price: string;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    addItem: (item: Omit<CartItem, 'quantity' | 'customer_id' | 'id'>, userId: string | null, locale: string) => Promise<void>;
    removeItem: (productId: number, userId: string | null, locale: string) => Promise<void>;
    updateQuantity: (productId: number, quantity: number, userId: string | null, locale: string) => Promise<void>;
    clearCart: (userId: string | null, locale: string) => Promise<void>;
    syncWithBackend: (userId: string | null, locale: string) => Promise<void>;
    logout: () => void;
    total: () => number;
    totalItems: () => number;
}

// Centralized error handling function
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        if (error.message.includes('customer_id') || error.message.includes('The selected')) {
            return 'Invalid user ID. Please log in again or contact support.';
        }
        if (error.message.includes('POST method is not supported')) {
            return 'Cart sync failed due to server configuration. Please try again later.';
        }
        return error.message || 'Operation failed. Please try again.';
    }
    return 'Operation failed.';
};

export const useCartStore = create<CartState>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                items: [],
                isLoading: false,
                error: null,

                addItem: async (item, userId, locale) => {
                    set({ isLoading: true, error: null });
                    const previousItems = get().items;
                    try {
                        const existingItem = previousItems.find((i) => i.product_id === item.product_id);
                        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

                        const newItem: CartItem = {
                            ...item,
                            id: existingItem?.id || Date.now(),
                            customer_id: userId || 'guest',
                            quantity: newQuantity,
                        };

                        if (existingItem) {
                            set({
                                items: previousItems.map((i) =>
                                    i.product_id === item.product_id ? newItem : i
                                ),
                            });
                        } else {
                            set({
                                items: [...previousItems, newItem],
                            });
                        }

                        if (userId) {
                            await updateCartItem(
                                { customer_id: userId, product_id: item.product_id, quantity: newQuantity },
                                locale
                            );
                            await get().syncWithBackend(userId, locale);
                        }
                    } catch (error) {
                        console.error('Error adding item to cart:', error);
                        set({ items: previousItems, error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    }
                },

                removeItem: async (productId, userId, locale) => {
                    set({ isLoading: true, error: null });
                    const previousItems = get().items;
                    try {
                        const item = previousItems.find((i) => i.product_id === productId);
                        if (!item) return;

                        set({ items: previousItems.filter((i) => i.product_id !== productId) });

                        if (userId) {
                            await updateCartItem(
                                { customer_id: userId, product_id: item.product_id, quantity: 0 },
                                locale
                            );
                            await get().syncWithBackend(userId, locale);
                        }
                    } catch (error) {
                        console.error('Error removing item from cart:', error);
                        set({ items: previousItems, error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    }
                },

                updateQuantity: async (productId, quantity, userId, locale) => {
                    set({ isLoading: true, error: null });
                    const previousItems = get().items;
                    try {
                        const item = previousItems.find((i) => i.product_id === productId);
                        if (!item) return;

                        if (quantity <= 0) {
                            set({ items: previousItems.filter((i) => i.product_id !== productId) });
                        } else {
                            set({
                                items: previousItems.map((i) =>
                                    i.product_id === productId ? { ...i, quantity } : i
                                ),
                            });
                        }

                        if (userId) {
                            await updateCartItem(
                                { customer_id: userId, product_id: item.product_id, quantity },
                                locale
                            );
                            await get().syncWithBackend(userId, locale);
                        }
                    } catch (error) {
                        console.error('Error updating cart item quantity:', error);
                        set({ items: previousItems, error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    }
                },

                clearCart: async (userId, locale) => {
                    set({ isLoading: true, error: null });
                    const previousItems = get().items;
                    try {
                        set({ items: [] });
                        if (userId) {
                            await clearCart(userId, locale);
                        }
                        await get().syncWithBackend(userId, locale);
                    } catch (error) {
                        console.error('Error clearing cart:', error);
                        set({ items: previousItems, error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    }
                },

                syncWithBackend: async (userId, locale) => {
                    if (typeof window === 'undefined' || !userId) {
                        console.warn('No user authenticated or server-side, skipping cart sync');
                        return;
                    }

                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.warn('No token found, skipping cart sync');
                        return;
                    }

                    set({ isLoading: true, error: null });
                    try {
                        const data = await fetchCart(userId, locale);
                        const mappedItems: CartItem[] = data.map((item) => ({
                            id: item.id,
                            product_id: item.product_id,
                            customer_id: item.customer_id as string,
                            name_en: item.name_en,
                            name_ar: item.name_ar,
                            description_en: item.description_en,
                            description_ar: item.description_ar,    
                            price: item.price as string,
                            image: item.image,
                            quantity: item.quantity,
                        }));

                        // Get local items (guest or user-specific)
                        const localItems = get().items.filter((item) => item.customer_id === 'guest' || item.customer_id === userId);
                        const mergedItems: CartItem[] = [];

                        // Prioritize backend items
                        for (const backendItem of mappedItems) {
                            mergedItems.push(backendItem);
                        }

                        // Add local items that don't exist in backend
                        for (const localItem of localItems) {
                            if (!mergedItems.some((i) => i.product_id === localItem.product_id)) {
                                mergedItems.push({ ...localItem, customer_id: userId });
                            }
                        }

                        set({ items: mergedItems, error: null });

                        // Update backend with merged items
                        for (const item of mergedItems) {
                            await updateCartItem(
                                { customer_id: userId, product_id: item.product_id, quantity: item.quantity },
                                locale
                            );
                        }
                    } catch (error) {
                        console.error('Error syncing with backend:', error);
                        set({ error: getErrorMessage(error) });
                    } finally {
                        set({ isLoading: false });
                    }
                },

                logout: () => {
                    set({ items: [], error: null });
                    console.log('Cart cleared on logout');
                },

                total: () =>
                    get().items.reduce((sum, item) => {
                        const price = parseFloat(item.price) || 0;
                        return sum + price * item.quantity;
                    }, 0),

                totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            }),
            {
                name: 'cart-storage',
                partialize: (state) => ({ items: state.items }),
            }
        )
    )
);

if (typeof window !== 'undefined') {
    const initializeCart = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            try {
                const locale = localStorage.getItem('locale') || 'ar';
                await useCartStore.getState().syncWithBackend(userId, locale);
            } catch (error) {
                console.error('Initial cart load error:', error);
            }
        }
    };
    initializeCart();
}