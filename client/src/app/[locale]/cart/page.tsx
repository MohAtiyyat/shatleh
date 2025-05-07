'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import CartSummary from '../../../../components/cart/CartSummary';
import { useCartStore } from '../../../../lib/store';
import CartItemList from '../../../../components/cart/CartItemList';
import Link from 'next/link';
import Breadcrumb from '../../../../components/breadcrumb';

export default function CartPage() {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const { items, syncWithBackend, isLoading, error } = useCartStore();

    useEffect(() => {
        syncWithBackend(currentLocale);
    }, [currentLocale, syncWithBackend]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }}>
            <main className="container mx-auto max-w-full sm:max-w-7xl px-0 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Breadcrumb pageName="cart" />
                    <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>
                        {t('cart.title')}
                    </h1>
                </div>
                {isLoading && (
                    <div className="text-center py-10" role="alert" aria-live="polite">
                        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{t('cart.loading')}</p>
                    </div>
                )}
                {error && (
                    <div className="text-center py-10 text-red-500" role="alert" aria-live="polite">
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && items.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{t('cart.empty')}</p>
                        <Link
                            href="/products"
                            className="mt-4 inline-block px-4 py-2 text-white rounded-md"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                            {t('cart.continueShopping')}
                        </Link>
                    </div>
                )}
                {!isLoading && !error && items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-3">
                            <CartItemList items={items} />
                        </div>
                        <div className="lg:col-span-2 sm:py-6 lg:py-0">
                            <CartSummary items={items} currentLocale={currentLocale} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}