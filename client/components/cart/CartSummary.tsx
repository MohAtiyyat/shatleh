'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useStickyFooter } from '../../lib/useStickyFooter';
import { useCartStore } from '../../lib/store';

export function formatPrice(price: number | string, locale: string): string {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) {
        return locale === 'ar' ? 'غير متوفر' : 'Not available';
    }

    const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `${formatter.format(numericPrice)} ${locale === 'ar' ? 'د.أ' : 'JD'}`;
}

const CartSummary = memo(function CartSummary() {
    const t = useTranslations('Cart');
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const { items } = useCartStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const isFooterVisible = useStickyFooter('.footer');

    const { subtotal, shipping, tax, total } = useMemo(() => {
        const subtotal = items.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            return sum + price * item.quantity;
        }, 0);
        const shipping = 2; // Set shipping to 2 JD
        const tax = 0; // Set tax to 0
        const total = subtotal + shipping + tax;
        return { subtotal, shipping, tax, total };
    }, [items]);

    const handleCheckout = useCallback(() => {
        if (items.length === 0) {
            alert(t('empty'));
            return;
        }
        setIsCheckingOut(true);
        router.push(`/${currentLocale}/checkout`);
        setIsCheckingOut(false);
    }, [items.length, currentLocale, router, t]);

    return (
        <div
            className={`sticky-container p-6 w-full max-w-md sm:max-w-lg lg:max-w-lg min-h-[450px] sm:mx-auto lg:mx-0 flex flex-col z-10 ${
                isFooterVisible ? 'lg:sticky lg:top-24' : 'lg:sticky lg:top-24'
            }`}
            role="region"
            aria-label={t('summary')}
        >
            <h2 className="text-xl sm:text-2xl font-semibold mb-10" style={{ color: 'var(--text-primary)' }}>
                {t('summary')}
            </h2>
            <div className="space-y-6 mb-10 flex-grow">
                <div className="flex justify-between text-sm sm:text-base">
                    <span style={{ color: 'var(--text-gray)' }}>{t('subtotal')}</span>
                    <span className="font-medium">{formatPrice(subtotal, currentLocale)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                    <span style={{ color: 'var(--text-gray)' }} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
                        {t('shipping')}
                    </span>
                    <span className="font-medium">{formatPrice(shipping, currentLocale)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                    <span style={{ color: 'var(--text-gray)' }}>{t('tax')}</span>
                    <span className="font-medium">{formatPrice(tax, currentLocale)}</span>
                </div>
            </div>
            <div className="border-t pt-8 mb-10" style={{ borderColor: 'var(--accent-color)' }}>
                <div className="flex justify-between items-center text-base sm:text-xl">
                    <span className="font-semibold">{t('total')}</span>
                    <span className="font-bold">{formatPrice(total, currentLocale)}</span>
                </div>
            </div>
            <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full py-4 text-white text-sm sm:text-base font-medium rounded-md transition-colors disabled:opacity-70 mt-auto hover:bg-[var(--text-hover)] hover:cursor-pointer"
                style={{
                    backgroundColor:
                        isCheckingOut || items.length === 0
                            ? 'var(--text-gray)'
                            : 'var(--accent-color)',
                }}
                aria-label={isCheckingOut ? t('processing') : t('checkout')}
            >
                {isCheckingOut ? t('processing') : t('checkout')}
            </button>
        </div>
    );
});

export default CartSummary; // Fixed typo in export