// src/app/[locale]/actions/processOrder.ts
"use server";
import stripe from "../../../lib/stripe";
import { checkout } from "../../../lib/api";
import { BackendCartItem } from "../../../lib";

export async function processOrder(sessionId: string, userId: string, locale: string, token: string | null) {
    try {
        // Retrieve the Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
            throw new Error("Payment not completed");
        }

        const metadata = session.metadata;
        const checkoutData = metadata && metadata.checkoutData ? JSON.parse(metadata.checkoutData) : null;

        if (!checkoutData) {
            throw new Error("Checkout data not found in metadata");
        }
        if (!userId) {
            throw new Error("User is not logged in");
        }
        if (!token) {
            throw new Error("No authentication token provided");
        }
        const response = await checkout(checkoutData, token);

        const lastOrder = {
            orderId: response?.data.order_code.toString(),
            items: checkoutData.items.map((item: BackendCartItem) => ({
                id: item.product_id.toString(),
                name_ar: item.name_ar,
                name_en: item.name_en,
                quantity: item.quantity,
                price: item.price.toString(), // Ensure price is a string to match LastOrder interface
            })),
            total: checkoutData.total.toFixed(3),
            orderDate: new Date().toISOString(),
            couponApplied: metadata && !!metadata.couponDiscount,
            couponDiscount: metadata && metadata.couponDiscount ? Number(metadata.couponDiscount) : 0,
            billing: {
                first_name: checkoutData.is_gift ? checkoutData.gift_first_name : metadata && metadata.customerName.split(" ")[0],
                last_name: checkoutData.is_gift ? checkoutData.gift_last_name : metadata && metadata.customerName.split(" ").slice(1).join(" "),
                phone_number: checkoutData.is_gift ? checkoutData.gift_phone_number : "",
                address_line: checkoutData.address_line,
                city: checkoutData.city,
                country: checkoutData.country_name,
            },
            gift: checkoutData.is_gift
                ? {
                    firstName: checkoutData.gift_first_name,
                    lastName: checkoutData.gift_last_name,
                    phoneNumber: checkoutData.gift_phone_number,
                }
                : null,
        };

        return { success: true, lastOrder };
    } catch (error) {
        console.error("Error processing order:", error);
        return { success: false, error: "Failed to process order" };
    }
}