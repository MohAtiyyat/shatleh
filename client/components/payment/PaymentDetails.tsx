'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../../lib/store';
import { useStickyFooter } from '../../lib/useStickyFooter';
import BillingDetails from './BillingForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardDetailsForm from './CardDetailsForm';
import ConfirmButton from './ConfirmButton';
import { formatPrice } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { applyCoupon, fetchCoupons } from '../../lib/api';
import { FormErrors, UserData, Address, FormData, BackendCartItem } from '../../lib';

interface Coupon {
    id: number;
    title: string;
    code: string;
    amount: number;
    expire_date: string;
    country_id: number | null;
    country_name?: string | null;
}

interface PaymentDetailsProps {
    userData: UserData;
    addresses: Address[];
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>; // Added prop
    defaultAddressId: number | null;
    setDefaultAddressId: (id: number | null) => void;
    couponCode: string;
    setCouponCode: (code: string) => void;
    couponApplied: boolean;
    setCouponApplied: (applied: boolean) => void;
    couponDiscount: number;
    setCouponDiscount: (discount: number) => void;
    couponError: string | null;
    setCouponError: (error: string | null) => void;
    currentLocale: 'en' | 'ar';
}

export default function PaymentDetails({
    userData,
    addresses,
    setAddresses, // Added to props
    defaultAddressId,
    setDefaultAddressId,
    couponCode,
    setCouponCode,
    couponApplied,
    setCouponApplied,
    couponDiscount,
    setCouponDiscount,
    couponError,
    setCouponError,
}: PaymentDetailsProps) {
    const t = useTranslations('checkout');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const { items } = useCartStore();
    const isFooterVisible = useStickyFooter('.footer');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        paymentMethod: 'credit-card',
        isGift: false,
        giftFirstName: '',
        giftLastName: '',
        giftPhoneNumber: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    // Fetch coupons on mount
    useEffect(() => {
        const loadCoupons = async () => {
            try {
                const fetchedCoupons = await fetchCoupons();
                setCoupons(fetchedCoupons);
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
                setCouponError(t('errors.failedToLoadCoupons'));
            }
        };
        loadCoupons();
    }, [t, setCouponError]);

    // Calculate totals
    const subtotal = items.reduce((sum, item: BackendCartItem) => {
        const price = parseFloat(item.price as string) || 0;
        return sum + price * item.quantity;
    }, 0);
    const shipping = 2;
    const tax = 0;
    const originalTotal = subtotal + shipping + tax;
    const discountedTotal = couponApplied ? originalTotal * (1 - couponDiscount) : originalTotal;

    // Get selected address country_id
    const selectedAddress = addresses.find((addr) => addr.id === defaultAddressId);
    const countryId = selectedAddress?.country_id || null;

    // Format card number (add spaces every 4 digits)
    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };

    // Format expiry date (MM/YY)
    const formatExpiryDate = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length <= 2) return digits;
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Handle gift fields change
    const handleGiftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Handle gift phone number change
    const handleGiftPhoneChange = (value: string) => {
        setFormData((prev) => ({ ...prev, giftPhoneNumber: value }));
        setFormErrors((prev) => ({ ...prev, giftPhoneNumber: undefined }));
    };

    // Handle payment method change
    const handlePaymentMethodChange = (method: 'credit-card' | 'cash') => {
        setFormData((prev) => ({ ...prev, paymentMethod: method }));
        setFormErrors({});
    };

    // Handle gift checkbox toggle
    const handleGiftToggle = () => {
        setFormData((prev) => ({
            ...prev,
            isGift: !prev.isGift,
            giftFirstName: '',
            giftLastName: '',
            giftPhoneNumber: '',
        }));
        setFormErrors((prev) => ({
            ...prev,
            giftFirstName: undefined,
            giftLastName: undefined,
            giftPhoneNumber: undefined,
        }));
    };

    // Handle coupon code change
    const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponCode(e.target.value);
        setCouponError(null);
    };

    // Apply coupon via API
    const applyCouponAction = async () => {
        try {
            const response = await applyCoupon(couponCode, countryId);
            setCouponApplied(true);
            setCouponDiscount(response.data.amount / 100); // Assuming amount is percentage
            setCouponError(null);
            // Store coupon data in localStorage
            localStorage.setItem('appliedCoupon', JSON.stringify(response.data));
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(t('errors.invalidCoupon'));
            setCouponApplied(false);
            setCouponDiscount(0);
            setCouponError(err.message);
            localStorage.removeItem('appliedCoupon');
        }
    };

    return (
        <div
            className={`sticky-container p-6 sm:p-8 w-[95%] md:w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto lg:mx-7 min-h-[450px] sm:mx-auto md:mx-auto flex flex-col z-10 rounded-lg shadow-md ${
                isFooterVisible ? 'lg:sticky lg:top-25' : 'lg:sticky lg:top-25'
            }`}
            style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'var(--secondary-bg)' }}
            role="region"
            aria-label={t('paymentDetails')}
        >
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                {t('paymentDetails')}
            </h2>

            <BillingDetails
                userData={userData}
                addresses={addresses}
                setAddresses={setAddresses} // Pass setAddresses
                defaultAddressId={defaultAddressId}
                setDefaultAddressId={setDefaultAddressId}
                formData={formData}
                formErrors={formErrors}
                handleGiftInputChange={handleGiftInputChange}
                handleGiftPhoneChange={handleGiftPhoneChange}
                handleGiftToggle={handleGiftToggle}
                currentLocale={currentLocale}
            />
            {coupons.length > 0 && (
                <div className="my-6">
                    <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        {t('coupon')}
                    </h3>
                    <div className="mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-gray)' }}>
                            {t('couponCode')}:
                        </span>
                        {coupons.map((coupon) => (
                            <span key={coupon.id} className="text-cyan-700 ml-2">
                                {coupon.code}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={handleCouponChange}
                            placeholder={t('enterCoupon')}
                            className="w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors border-[var(--secondary-bg)]"
                        />
                        <button
                            onClick={applyCouponAction}
                            className="px-4 py-2 text-white rounded-md"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                            {t('applyCoupon')}
                        </button>
                    </div>
                    {couponError && (
                        <p className="text-red-500 text-sm mt-1">{couponError}</p>
                    )}
                    {couponApplied && (
                        <div className="text-sm mt-2" style={{ color: 'var(--text-gray)' }}>
                            <p>
                                {t('originalTotal')}:{' '}
                                <span className="line-through">{formatPrice(originalTotal.toFixed(2), currentLocale)}</span>
                            </p>
                            <p>
                                {t('discountedTotal')}:{' '}
                                <span className="font-bold">{formatPrice(discountedTotal.toFixed(2), currentLocale)}</span>
                            </p>
                        </div>
                    )}
                </div>
            )}

            <PaymentMethodSelector
                paymentMethod={formData.paymentMethod}
                handlePaymentMethodChange={handlePaymentMethodChange}
            />

            <CardDetailsForm
                formData={formData}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                isVisible={formData.paymentMethod === 'credit-card'}
            />

            <ConfirmButton
                formData={formData}
                setFormErrors={setFormErrors}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                currentLocale={currentLocale}
                items={items}
                userData={userData}
                addresses={addresses}
                defaultAddressId={defaultAddressId}
                total={discountedTotal}
                couponApplied={couponApplied}
                couponDiscount={couponDiscount}
            />
        </div>
    );
}