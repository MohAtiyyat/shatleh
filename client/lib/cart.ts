// lib/cart.ts
// lib/cart.ts
export type CartItem = {
    id: number;
    product_id: number;
    customer_id: string;
    name: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    price: string; // Store as string (e.g., "4.50")
    image: string;
    quantity: number;
};