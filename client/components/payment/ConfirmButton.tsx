'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '../../lib/store';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useAuth } from '../../lib/AuthContext';

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

interface FormData {
    firstName: string;
    lastName: string;
    addressLine: string;
    city: string;
    country: string;
    phoneNumber: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    paymentMethod: 'credit-card' | 'cash';
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    addressLine?: string;
    city?: string;
    country?: string;
    phoneNumber?: string;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
}

interface ConfirmButtonProps {
    formData: FormData;
    setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
    isProcessing: boolean;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    currentLocale: 'en' | 'ar';
    items: CartItem[];
}

export default function ConfirmButton({
    formData,
    setFormErrors,
    isProcessing,
    setIsProcessing,
    currentLocale,
    items,
}: ConfirmButtonProps) {
    const t = useTranslations('checkout');
    const router = useRouter();
    const { clearCart } = useCartStore();
    const { userId } = useAuth();

    // Validate form fields
    const validateForm = (): FormErrors => {
        const errors: FormErrors = {};

        // Validate billing fields for both payment methods
        if (!formData.firstName.trim()) {
            errors.firstName = t('errors.firstNameRequired');
        }
        if (!formData.lastName.trim()) {
            errors.lastName = t('errors.lastNameRequired');
        }
        if (!formData.addressLine.trim()) {
            errors.addressLine = t('errors.addressLineRequired');
        }
        if (!formData.city.trim()) {
            errors.city = t('errors.cityRequired');
        }
        if (!formData.country) {
            errors.country = t('errors.countryRequired');
        }
        const phoneNumber = parsePhoneNumberFromString(`+${formData.phoneNumber}`);
        if (!phoneNumber || !phoneNumber.isValid()) {
            errors.phoneNumber = t('errors.invalidPhone');
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
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            // Focus the first invalid field
            if (errors.firstName) document.getElementsByName('firstName')[0]?.focus();
            else if (errors.lastName) document.getElementsByName('lastName')[0]?.focus();
            else if (errors.addressLine) document.getElementsByName('addressLine')[0]?.focus();
            else if (errors.city) document.getElementsByName('city')[0]?.focus();
            else if (errors.country) document.getElementsByName('country')[0]?.focus();
            else if (errors.phoneNumber) document.getElementsByName('phoneNumber')[0]?.focus();
            else if (errors.cardNumber) document.getElementsByName('cardNumber')[0]?.focus();
            else if (errors.cardHolder) document.getElementsByName('cardHolder')[0]?.focus();
            else if (errors.expiryDate) document.getElementsByName('expiryDate')[0]?.focus();
            else if (errors.cvv) document.getElementsByName('cvv')[0]?.focus();
            return;
        }
        setIsProcessing(true);
        try {
            // Simulate API call to process payment
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Calculate total
            const subtotal = items.reduce((sum, item) => {
                const price = parseFloat(item.price) || 0;
                return sum + price * item.quantity;
            }, 0);
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            // Generate deterministic order ID
            const orderId = `ORD${Date.now().toString().slice(-6)}`;

            // Store order data in localStorage (exclude billing)
            const lastOrder = {
                orderId,
                items,
                total: total.toFixed(2),
            };
            localStorage.setItem('lastOrder', JSON.stringify(lastOrder));

            // Log for debugging
            console.log('Checkout items:', items);
            console.log('Checkout total:', total.toFixed(2));
            console.log('Checkout orderId:', orderId);
            console.log('Stored lastOrder:', lastOrder);

            // Clear cart
            await clearCart(userId, currentLocale);
            console.log('Cart cleared, current items:', useCartStore.getState().items);

            // Redirect to success page
            router.push(`/${currentLocale}/success`);
        } catch (err) {
            console.error('Checkout error:', err);
            alert(t('errors.checkoutFailed'));
        } finally {
            setIsProcessing(false);
        }
    };

    // Check if confirm button should be enabled
    const isConfirmDisabled = () => {
        if (isProcessing || items.length === 0) return true;
        const billingFieldsFilled =
            formData.firstName &&
            formData.lastName &&
            formData.addressLine &&
            formData.city &&
            formData.country &&
            formData.phoneNumber;
        if (formData.paymentMethod === 'cash') {
            return !billingFieldsFilled;
        }
        return (
            !billingFieldsFilled ||
            !formData.cardNumber ||
            !formData.cardHolder ||
            !formData.expiryDate ||
            !formData.cvv
        );
    };

    return (
        <motion.button
            onClick={handleConfirm}
            disabled={isConfirmDisabled() || isProcessing}
            className={`w-full py-4 mt-6 text-white font-medium rounded-md transition-colors flex items-center justify-center ${isConfirmDisabled() || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--secondary-bg)] hover:bg-[var(--accent-color)]'}`}
            aria-label={isProcessing ? t('processing') : t('confirm')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isConfirmDisabled() || isProcessing ? {} : { scale: 1.05, boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)' }}
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
    );
}