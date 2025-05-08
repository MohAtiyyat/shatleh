'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import CartSummary from '../../../../components/cart/CartSummary';
import { useCartStore } from '../../../../lib/store';
import CartItemList from '../../../../components/cart/CartItemList';
import Breadcrumb from '../../../../components/breadcrumb';
import { useAuth } from '../../../../lib/AuthContext';

export default function CartPage() {
    const t = useTranslations('Cart');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const { userId } = useAuth();
    const syncWithBackend = useCartStore((state) => state.syncWithBackend);

    // Memoize syncWithBackend call to prevent unnecessary re-renders
    const handleSync = useCallback(() => {
        if (userId) {
            syncWithBackend(userId, currentLocale);
        }
    }, [userId, currentLocale, syncWithBackend]);

    useEffect(() => {
        handleSync();
    }, [handleSync]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }}>
            <main className="container mx-auto max-w-5/6 px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6">
                    <Breadcrumb pageName="cart" />
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>
                        {t('title')}
                    </h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div className="lg:col-span-3">
                        <CartItemList />
                    </div>
                    <div className="lg:col-span-2 py-6 lg:py-0">
                        <CartSummary />
                    </div>
                </div>
            </main>
        </div>
    );
}