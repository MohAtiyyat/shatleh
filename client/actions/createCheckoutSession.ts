"use server"
import stripe from "../lib/stripe";
import { BackendCartItem } from "../lib";
export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    userId: string;
    couponDiscount?: number;
    finalTotal?: number;
    checkoutData?: string; // Store serialized checkoutData
};
// server-side: createCheckoutSession
export async function createCheckoutSession(items: BackendCartItem[], metadata: Metadata, currentLocale: string) {
    try {
        // Check if all items have a price
        const itemsWithoutPrice = items.filter(item => !item.price);
        if (itemsWithoutPrice.length > 0) {
            throw new Error("Some of the items don't have a price");
        }

        // Search for existing customer by email
        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1,
        });

        let customerId: string | undefined;
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        }

        // Calculate original total (before discount)
        const originalTotal = items.reduce((sum, item) => sum + (+item.price * item.quantity), 0);

        // Calculate discount factor if coupon is applied
        const discountFactor = metadata.couponDiscount && metadata.finalTotal && originalTotal > 0
            ? metadata.finalTotal / originalTotal
            : 1;
            console.log("Discount factor:", discountFactor);

        // Create checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : 'always',
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            
            mode: "payment",
            payment_method_types: ["card"], // Specify payment method types
            allow_promotion_codes: true,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/checkout`,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${currentLocale}/success?session_id={CHECKOUT_SESSION_ID}`,
            line_items: items.map(item => {
                // Calculate discounted price in JOD, rounded to 2 decimal places
                const discountedPriceJOD = Math.round((+item.price * discountFactor) * 100) / 100; // Round to 2 decimals
                // Convert to fils (multiply by 1000) and ensure divisibility by 10
                const unitAmountFils = Math.round(discountedPriceJOD * 1000 / 10) * 10; // Round to nearest 10 fils
                return {
                    price_data: {
                        currency: "jod",
                        unit_amount: unitAmountFils,
                        product_data: {
                            name: currentLocale === "ar" ? item.name_ar : item.name_en || "Unnamed Product",
                            description: currentLocale === "ar" ? item.description_ar : item.description_en || "No description",
                            metadata: {
                                id: item.id,
                            },
                            images: item.image && item.image[0]
                                ? [`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.image[0]}`]
                                : undefined,
                        },
                    },
                    quantity: item.quantity,
                };
            }),
            
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 2 * 1000, currency: 'jod' }, // Shipping in fils
                        display_name: 'Standard Shipping',
                    },
                },
            ],
        });

        return checkoutSession.url;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
}


