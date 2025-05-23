'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error() {
    const t = useTranslations('search');
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'en';

    return (
        <main className="min-h-screen mx-auto px-4 py-10 max-w-7xl" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-semibold text-[#0f4229] mb-2">
                    {t('errorTitle', { default: 'Something Went Wrong' })}
                </h2>
                <p className="text-gray-600 mb-4">
                    {t('error', { default: 'Unable to perform search. Please try again later.' })}
                </p>
                <Link
                    href={`/${currentLocale}`}
                    className="px-4 py-2 bg-[#337a5b] text-white rounded-md hover:bg-[#2a634a] transition-colors"
                >
                    {t('goBack', { default: 'Go Back' })}
                </Link>
            </div>
        </main>
    );
}