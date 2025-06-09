// src/components/ConfirmButton.tsx (or wherever ConfirmButton is located)
"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
// import { useCartStore } from "../../lib/store";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { checkout, clearCart } from "../../lib/api";
import { FormErrors, BackendCartItem, UserData, Address, FormData, Locale } from "../../lib";
import { createCheckoutSession, Metadata } from "../../actions/createCheckoutSession";

interface ConfirmButtonProps {
    formData: FormData;
    setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
    isProcessing: boolean;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    currentLocale: Locale;
    items: BackendCartItem[];
    userData: UserData;
    addresses: Address[];
    defaultAddressId: number | null;
    total: number;
    couponApplied: boolean;
    couponDiscount: number;
}

export default function ConfirmButton({
    formData,
    setFormErrors,
    isProcessing,
    setIsProcessing,
    currentLocale,
    items,
    userData,
    addresses,
    defaultAddressId,
    total,
    couponApplied,
    couponDiscount,
}: ConfirmButtonProps) {
    const t = useTranslations("checkout");
    const router = useRouter();

    // Find the default address
    const defaultAddress = addresses.find((addr) => addr.id === defaultAddressId) || null;

    // Validate form fields
    const validateForm = (): FormErrors => {
        const errors: FormErrors = {};

        // Validate gift fields if isGift is true
        if (formData.isGift) {
            if (!formData.giftFirstName.trim()) {
                errors.giftFirstName = t("errors.giftFirstNameRequired");
            }
            if (!formData.giftLastName.trim()) {
                errors.giftLastName = t("errors.giftLastNameRequired");
            }
            const giftPhoneNumber = parsePhoneNumberFromString(`+${formData.giftPhoneNumber}`);
            if (!giftPhoneNumber || !giftPhoneNumber.isValid()) {
                errors.giftPhoneNumber = t("errors.invalidGiftPhone");
            }
        }

        // Add credit card validation if re-enabled in the future
        // if (formData.paymentMethod === "credit-card") { ... }

        return errors;
    };

    // Handle form submission
    const handleConfirm = async () => {
        // Check if address is complete
        if (!defaultAddress || !defaultAddress.address_line?.trim()) {
            setFormErrors({ address: t("errors.addressIncomplete") });
            return;
        }

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            if (errors.giftFirstName) document.getElementsByName("giftFirstName")[0]?.focus();
            else if (errors.giftLastName) document.getElementsByName("giftLastName")[0]?.focus();
            else if (errors.giftPhoneNumber) document.getElementsByName("giftPhoneNumber")[0]?.focus();
            return;
        }

        setIsProcessing(true);
        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token"); // Retrieve token on client
            if (!userId) {
                throw new Error("User ID not found");
            }
            if (!token) {
                throw new Error("Authentication token not found");
            }

            // Get coupon ID from localStorage
            const couponData = localStorage.getItem("appliedCoupon");
            const coupon = couponData ? JSON.parse(couponData) : null;

            // Calculate total after discount
            const finalTotal = (couponApplied && couponDiscount > 0 ? total - couponDiscount : total) ;

            const checkoutData = {
                customer_id: userId,
                address_id: defaultAddressId!,
                items: items.map((item: BackendCartItem) => ({
                    product_id: item.product_id,
                    price: item.price.toString(),
                    quantity: item.quantity,
                    name_ar: item.name_ar,
                    name_en: item.name_en,
                })),
                is_gift: formData.isGift,
                gift_first_name: formData.isGift ? formData.giftFirstName : undefined,
                gift_last_name: formData.isGift ? formData.giftLastName : undefined,
                gift_phone_number: formData.isGift ? formData.giftPhoneNumber : undefined,
                coupon_id: couponApplied && coupon ? coupon.id : null,
                total: finalTotal,
                delivery_cost: 2,
                orderCode: "ORD" + new Date().getTime().toString(),
                payment_method: formData.paymentMethod,
                address_line: defaultAddress.address_line,
                city: defaultAddress.city,
                country_name: defaultAddress.country_name,
            };

            if (formData.paymentMethod === "cash") {
                const response = await checkout(checkoutData, token); // Pass token


                const lastOrder = {
                    orderId: response && response.data.order_code.toString(),
                    items: items.map((item) => ({
                        id: item.product_id.toString(),
                        name_ar: item.name_ar,
                        name_en: item.name_en,
                        quantity: item.quantity,
                        price: (item.price).toString(),
                    })),
                    total: finalTotal.toFixed(3),
                    orderDate: new Date().toISOString(),
                    couponApplied,
                    couponDiscount,
                    billing: {
                        first_name: formData.isGift ? formData.giftFirstName : userData.first_name,
                        last_name: formData.isGift ? formData.giftLastName : userData.last_name,
                        phone_number: formData.isGift ? formData.giftPhoneNumber : userData.phone_number,
                        address_line: defaultAddress.address_line,
                        city: defaultAddress.city,
                        country: defaultAddress.country_name,
                    },
                    gift: formData.isGift
                        ? {
                            firstName: formData.giftFirstName,
                            lastName: formData.giftLastName,
                            phoneNumber: formData.giftPhoneNumber,
                        }
                        : null,
                };
                localStorage.setItem("lastOrder", JSON.stringify(lastOrder));

                // Clear cart
                await clearCart(userId, currentLocale, token);

                // Clear coupon data
                if (couponApplied) {
                    localStorage.removeItem("appliedCoupon");
                }

                // Redirect to success page
                router.push(`/${currentLocale}/success`);
            } else if (formData.paymentMethod === "credit-card") {
                const metadata: Metadata = {
                    orderNumber: checkoutData.orderCode || "",
                    customerName: `${userData.first_name} ${userData.last_name}`,
                    customerEmail: userData.email || "UNKNOWN",
                    userId: userId,
                    couponDiscount: couponApplied ? couponDiscount : undefined,
                    finalTotal: finalTotal,
                    checkoutData: JSON.stringify(checkoutData),
                };
                const checkoutUrl = await createCheckoutSession(items, metadata, currentLocale);
                if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                }
            }
        } catch (err) {
            console.error("Checkout error:", err);
            setFormErrors({ general: t("errors.checkoutFailed") });
        } finally {
            setIsProcessing(false);
        }
    };

    // Check if confirm button should be disabled
    const isConfirmDisabled = () => {
        if (isProcessing || items.length === 0) {
            return true;
        }
        if (!defaultAddress) {
            return true;
        }
        if (formData.isGift) {
            if (!formData.giftFirstName?.trim() || !formData.giftLastName?.trim() || !formData.giftPhoneNumber?.trim()) {
                return true;
            }
        }
        if (formData.paymentMethod === "cash" && (formData.giftFirstName?.trim() || formData.giftLastName?.trim() || formData.giftPhoneNumber?.trim())) {
            return true;
        }
        if (formData.paymentMethod === "cash") {
            return false;
        }
        // Add credit card validation if re-enabled
        // if (formData.paymentMethod === "credit-card") { ... }
        return false;
    };

    return (
        <motion.button
            onClick={handleConfirm}
            disabled={isConfirmDisabled()}
            className={`w-full py-4 mt-6 text-white font-medium rounded-md transition-colors flex items-center justify-center ${isConfirmDisabled() ? "bg-gray-400 cursor-not-allowed" : "bg-[var(--secondary-bg)] hover:bg-[var(--accent-color)]"
                }`}
            aria-label={isProcessing ? t("processing") : t("confirm")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isConfirmDisabled() ? {} : { scale: 1.05, boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)" }}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    {t("processing")}
                </>
            ) : (
                t("confirm")
            )}
        </motion.button>
    );
}