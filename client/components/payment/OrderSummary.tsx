'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../../lib/store';
import Image from 'next/image';
import { useStickyFooter } from '../../lib/useStickyFooter';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';

interface OrderSummaryProps {
    couponApplied: boolean;
    couponDiscount: number;
}

export default function OrderSummary({ couponApplied, couponDiscount }: OrderSummaryProps) {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const { items, isLoading, error } = useCartStore();
    const isFooterVisible = useStickyFooter('.footer');

    const subtotal = items.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price * item.quantity;
    }, 0);
    const shipping = 2; // Set shipping to 2 JD
    const tax = 0; // Set tax to 0
    const originalTotal = subtotal + shipping + tax;
    const discountedTotal = couponApplied ? originalTotal * (1 - couponDiscount) : originalTotal;

    if (isLoading) {
        return (
            <div className="text-center py-10" role="alert" aria-live="polite">
                <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{t('Cart.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500" role="alert" aria-live="polite">
                <p>{error}</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{t('Cart.empty')}</p>
                <Link
                    href={`/${currentLocale}/products`}
                    className="mt-4 inline-block px-4 py-2 text-white rounded-md"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                >
                    {t('Cart.continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div
            className={`sticky-container p-6 sm:p-8 w-[95%] md:w-full max-w-md sm:max-w-lg lg:max-w-2xl lg:mx-7 min-h-[450px] mx-auto flex flex-col z-10 ${isFooterVisible ? 'lg:sticky lg:top-25' : 'lg:sticky lg:top-25'}`}
            role="region"
            aria-label={t('checkout.orderSummary')}
            style={{ backgroundColor: 'var(--primary-bg)' }}
        >
            <h2
                className="text-2xl font-semibold mb-10"
                style={{ color: 'var(--text-primary)' }}
            >
                {t('checkout.orderSummary')}
            </h2>

            <div className="space-y-4 mb-10 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(50vh - 100px)' }}>
                {items.map((item) => (
                    <div
                        className="flex items-center gap-4 border-b pb-4"
                        style={{ borderColor: 'var(--secondary-bg)' }}
                        key={item.id}
                    >
                        <Link href={`/${currentLocale}/products/${item.product_id}`} className="gap-4" passHref>
                            <div className="w-20 h-20 relative">
                                <Image
                                    src={process.env.NEXT_PUBLIC_API_URL + item.image[0] || '/placeholder.svg'}
                                    alt={(currentLocale === 'ar' ? item.name_ar : item.name_en) || 'Product Image'}
                                    fill
                                    className="object-cover rounded"
                                    loading="lazy"
                                />
                            </div>
                        </Link>
                        <div className="flex-1">
                            <h3 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {currentLocale === 'ar' ? item.name_ar : item.name_en || item.name_ar}
                            </h3>
                            <p className="text-xs" style={{ color: 'var(--text-gray)' }}>
                                {t('checkout.price')}: {formatPrice(item.price, currentLocale)}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-gray)' }}>
                                {t('checkout.quantity')}: {item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="border-t pt-8 mb-10"
                style={{ borderColor: 'var(--accent-color)' }}
            >
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--text-gray)' }}>{t('Cart.subtotal')}</span>
                        <span className="font-medium">{formatPrice(subtotal.toFixed(2), currentLocale)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--text-gray)' }} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
                            {t('Cart.shipping')}
                        </span>
                        <span className="font-medium">{formatPrice(shipping.toFixed(2), currentLocale)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--text-gray)' }}>{t('Cart.tax')}</span>
                        <span className="font-medium">{formatPrice(tax.toFixed(2), currentLocale)}</span>
                    </div>
                    {couponApplied ? (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--text-gray)' }}>{t('Cart.originalTotal')}</span>
                                <span className="line-through">{formatPrice(originalTotal.toFixed(2), currentLocale)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-semibold">{t('Cart.discountedTotal')}</span>
                                <span className="text-xl font-bold">{formatPrice(discountedTotal.toFixed(2), currentLocale)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">{t('Cart.total')}</span>
                            <span className="text-xl font-bold">{formatPrice(originalTotal.toFixed(2), currentLocale)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}