'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '../../lib/store';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { checkout } from '../../lib/api';
import { FormErrors, BackendCartItem, UserData, Address, FormData, Locale } from '../../lib';

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
    const t = useTranslations('checkout');
    const router = useRouter();
    const { clearCart } = useCartStore();

    // Find the default address
    const defaultAddress = addresses.find((addr) => addr.id === defaultAddressId) || null;

    // Validate form fields
    const validateForm = (): FormErrors => {
        const errors: FormErrors = {};

        // Validate gift fields if isGift is true
        if (formData.isGift) {
            if (!formData.giftFirstName.trim()) {
                errors.giftFirstName = t('errors.giftFirstNameRequired');
            }
            if (!formData.giftLastName.trim()) {
                errors.giftLastName = t('errors.giftLastNameRequired');
            }
            const giftPhoneNumber = parsePhoneNumberFromString(`+${formData.giftPhoneNumber}`);
            if (!giftPhoneNumber || !giftPhoneNumber.isValid()) {
                errors.giftPhoneNumber = t('errors.invalidGiftPhone');
            }
        }

        // Validate credit card fields if selected
        if (formData.paymentMethod === 'credit-card') {
            if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNumber)) {
                errors.cardNumber = t('errors.invalidCardNumber');
            }
            if (!formData.cardHolder.trim()) {
                errors.cardHolder = t('errors.cardHolderRequired');
            }
            const expiryRegex = /^(0[1-9]|1[0-2])\/([2-9][0-9])$/;
            if (!expiryRegex.test(formData.expiryDate)) {
                errors.expiryDate = t('errors.invalidExpiryDate');
            } else {
                const [month, year] = formData.expiryDate.split('/').map(Number);
                const fullYear = 2000 + year;
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1;
                if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
                    errors.expiryDate = t('errors.expiredCard');
                }
            }
            if (!/^\d{3,4}$/.test(formData.cvv.replace(/\D/g, ''))) {
                errors.cvv = t('errors.invalidCvv');
            }
        }

        return errors;
    };

    // Handle form submission
    const handleConfirm = async () => {
        // Check if address is complete
        if (!defaultAddress || !defaultAddress.address_line?.trim()) {
            setFormErrors({ address: t('errors.addressIncomplete') });
            return;
        }

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            // Focus the first invalid field
            if (errors.giftFirstName) document.getElementsByName('giftFirstName')[0]?.focus();
            else if (errors.giftLastName) document.getElementsByName('giftLastName')[0]?.focus();
            else if (errors.giftPhoneNumber) document.getElementsByName('giftPhoneNumber')[0]?.focus();
            else if (errors.cardNumber) document.getElementsByName('cardNumber')[0]?.focus();
            else if (errors.cardHolder) document.getElementsByName('cardHolder')[0]?.focus();
            else if (errors.expiryDate) document.getElementsByName('expiryDate')[0]?.focus();
            else if (errors.cvv) document.getElementsByName('cvv')[0]?.focus();
            return;
        }

        setIsProcessing(true);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            // Get coupon ID from localStorage
            const couponData = localStorage.getItem('appliedCoupon');
            const coupon = couponData ? JSON.parse(couponData) : null;

            // Prepare checkout data
            const checkoutData = {
                customer_id: userId,
                address_id: defaultAddressId!,
                items: items.map((item: BackendCartItem) => ({
                    product_id: item.product_id,
                    price: item.price.toString(),
                    quantity: item.quantity,
                })),
                is_gift: formData.isGift,
                gift_first_name: formData.isGift ? formData.giftFirstName : undefined,
                gift_last_name: formData.isGift ? formData.giftLastName : undefined,
                gift_phone_number: formData.isGift ? formData.giftPhoneNumber : undefined,
                coupon_id: couponApplied && coupon ? coupon.id : null,
                total,
                delivery_cost: 2, // Hardcoded from PaymentDetails
            };

            // Send checkout request
            const response = await checkout(checkoutData);

            // Format order date
            const orderDate = new Date().toISOString();

            // Store order data in localStorage for success page
            const lastOrder = {
                orderId: response.data.order_code.toString(),
                items: items.map(item => ({
                    id: item.product_id.toString(), // Use product_id as id
                    name_ar: item.name_ar,
                    name_en: item.name_en,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: response.data.total.toFixed(2),
                orderDate,
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
            localStorage.setItem('lastOrder', JSON.stringify(lastOrder));

            // Clear cart
            await clearCart(userId, currentLocale);

            // Clear coupon data
            if (couponApplied) {
                localStorage.removeItem('appliedCoupon');
            }

            // Redirect to success page
            router.push(`/${currentLocale}/success`);
        } catch (err) {
            console.error('Checkout error:', err);
            setFormErrors({ general: t('errors.checkoutFailed') });
        } finally {
            setIsProcessing(false);
        }
    };


    // Check if confirm button should be enabled
    const isConfirmDisabled = () => {

        // Disable if processing or cart is empty
        if (isProcessing || items.length === 0) {

            return true;
        }

        // Disable if no valid default address
        if (!defaultAddress) {

            return true;
        }

        // If gift option is enabled, require gift fields
        if (formData.isGift) {
            if (!formData.giftFirstName?.trim() || !formData.giftLastName?.trim() || !formData.giftPhoneNumber?.trim()) {
                return true;
            }
        }
        // If payment method is cash and gift fields are filled, disable cash payment
        if (formData.paymentMethod === 'cash' && (formData.giftFirstName?.trim() || formData.giftLastName?.trim() || formData.giftPhoneNumber?.trim())) {
            return true;
        }


        // If payment method is cash, no further checks needed
        if (formData.paymentMethod === 'cash') {
            return false;
        }

        // For credit-card, require non-empty card fields
        if (formData.paymentMethod === 'credit-card') {

        }
        if (!formData.cardNumber?.trim() || !formData.cardHolder?.trim() || !formData.expiryDate?.trim() || !formData.cvv?.trim()) {
            return true;
        }
        return false;
    };

    return (
        <>
            <motion.button
                onClick={handleConfirm}
                disabled={isConfirmDisabled()}
                className={`w-full py-4 mt-6 text-white font-medium rounded-md transition-colors flex items-center justify-center ${isConfirmDisabled() ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--secondary-bg)] hover:bg-[var(--accent-color)]'
                    }`}
                aria-label={isProcessing ? t('processing') : t('confirm')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={isConfirmDisabled() ? {} : { scale: 1.05, boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)' }}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        {t('processing')}
                    </>
                ) : (
                    t('confirm')
                )}
            </motion.button>
        </>
    );
}