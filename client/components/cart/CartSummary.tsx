'use client';

import { useState, memo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { CartItem } from '../../lib/cart';
import { useStickyFooter } from '../../lib/useStickyFooter';

interface CartSummaryProps {
    items: CartItem[];
    currentLocale: string;
}

function CartSummary({ items, currentLocale }: CartSummaryProps) {
    const t = useTranslations('');
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const isFooterVisible = useStickyFooter('.footer');

    const formatPrice = (price: string) => {
        if (price.match(/[^0-9.,]/)) return price;
        return currentLocale === 'en' ? `${price} JD` : `${price} د.أ`;
    };

    const subtotal = items.reduce((sum, item) => {
        const price = Number.parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + price * item.quantity;
    }, 0);
    const shipping = 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleCheckout = () => {
        if (items.length === 0) {
            alert(t('cart.empty'));
            return;
        }
        setIsCheckingOut(true);
        setTimeout(() => {
            router.push(`/${currentLocale}/checkout`);
            setIsCheckingOut(false);
        }, 500);
    };

    return (
        <div
            className={`sticky-container p-6 sm:p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg min-h-[450px] sm:mx-auto md:mx-0 flex flex-col z-10 ${isFooterVisible ? 'lg:sticky lg:top-25' : 'lg:sticky lg:top-25'
                }`}
            role="region"
            aria-label={t('cart.summary')}
        >
            <h2 className="text-2xl font-semibold mb-10" style={{ color: 'var(--text-primary)' }}>
                {t('cart.summary')}
            </h2>

            <div className="space-y-6 mb-10 flex-grow">
                <div className="flex justify-between">
                    <span style={{ color: 'var(--text-gray)' }}>{t('cart.subtotal')}</span>
                    <span className="font-medium">{formatPrice(subtotal.toFixed(2))}</span>
                </div>

                <div className="flex justify-between">
                    <span style={{ color: 'var(--text-gray)' }} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
                        {t('cart.shipping')}
                    </span>
                    <span className="font-medium">{formatPrice(shipping.toFixed(2))}</span>
                </div>

                <div className="flex justify-between">
                    <span style={{ color: 'var(--text-gray)' }}>{t('cart.tax')}</span>
                    <span className="font-medium">{formatPrice(tax.toFixed(2))}</span>
                </div>
            </div>

            <div className="border-t pt-8 mb-10" style={{ borderColor: 'var(--accent-color)' }}>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">{t('cart.total')}</span>
                    <span className="text-xl font-bold">{formatPrice(total.toFixed(2))}</span>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full py-4 text-white font-medium rounded-md transition-colors disabled:opacity-70 mt-auto hover:bg-[var(--text-hover)]"
                style={{
                    backgroundColor: isCheckingOut || items.length === 0 ? 'var(--text-gray)' : 'var(--accent-color)',
                }}
                aria-label={isCheckingOut ? t('cart.processing') : t('cart.checkout')}
            >
                {isCheckingOut ? t('cart.processing') : t('cart.checkout')}
            </button>
        </div>
    );
}

export default memo(CartSummary);