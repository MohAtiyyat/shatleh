'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface EmptyCartStateProps {
    currentLocale: 'en' | 'ar';
}

export default function EmptyCartState({ currentLocale }: EmptyCartStateProps) {
    const t = useTranslations('');

    return (
        <div
            className="text-center py-10"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                {t('Cart.empty')}
            </p>
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