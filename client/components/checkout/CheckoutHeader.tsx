'use client';

import { useTranslations } from 'next-intl';
import Breadcrumb from '../breadcrumb';

interface CheckoutHeaderProps {
    currentLocale: 'en' | 'ar';
}

export default function CheckoutHeader({ currentLocale }: CheckoutHeaderProps) {
    const t = useTranslations('');

    return (
        <div className="mb-8" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
            <Breadcrumb pageName="checkout" />
            <h1
                className="text-2xl sm:text-3xl font-bold mt-4"
                style={{ color: 'var(--text-primary)' }}
            >
                {t('checkout.title')}
            </h1>
        </div>
    );
}