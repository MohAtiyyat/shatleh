'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Breadcrumb from '../../../../components/breadcrumb';
import { RefreshCw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    const t = useTranslations('');

    // Log error for debugging
    useEffect(() => {
        console.error('Error in ProductsPage:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#e8f5e9] flex flex-col items-center justify-center px-4">
            <div className="mb-8 w-full max-w-4xl">
                <Breadcrumb pageName="products" />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white rounded-xl shadow-lg p-8 text-center max-w-lg w-full"
            >
                <h1 className="text-3xl font-bold text-[#0f4229] mb-4">
                    {t('error.title')}
                </h1>
                <p className="text-lg text-[#414141] mb-6">
                    {t('error.message')}
                </p>
                <button
                    onClick={() => reset()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#43bb67] text-white rounded-md hover:bg-[#3aa55b] transition-colors"
                >
                    <RefreshCw className="h-5 w-5" />
                    <span>{t('error.retry')}</span>
                </button>
            </motion.div>
        </div>
    );
}