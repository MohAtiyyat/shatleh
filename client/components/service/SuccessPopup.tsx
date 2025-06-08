'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SuccessPopupProps {
    onClose: () => void;
    currentLocale: 'en' | 'ar';
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose, currentLocale }) => {
    const t = useTranslations('serviceRequest');
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
                style={{ backdropFilter: 'blur(0.8px)' }}
            >
                <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--primary-bg)] rounded-2xl p-8 max-w-md w-full mx-4 shadow-[var(--shadow-md)]"
                    dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
                >
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                        {t('successMessage')}
                    </h2>
                    <p className="text-[var(--text-gray)] mb-6">
                        {currentLocale === 'ar'
                            ? 'تم إرسال طلب الخدمة بنجاح. يمكنك عرض تفاصيل الطلب في صفحة الطلبات.'
                            : 'Your service request has been submitted successfully. You can view the request details in the orders page.'}
                    </p>
                    <div className="flex justify-between gap-4">
                        <Link href={`/${currentLocale}/service-requests`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-[var(--accent-color)] text-[var(--text-white)] rounded-lg hover:bg-[var(--footer-accent)] transition-colors"
                            >
                                {currentLocale === 'ar' ? 'عرض الطلبات' : 'View Orders'}
                            </motion.button>
                        </Link>
                        <Link href={`/${currentLocale}/`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-[var(--accent-color)] text-[var(--text-white)] rounded-lg hover:bg-[var(--footer-accent)] transition-colors"
                            >
                                {currentLocale === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="px-6 py-2 border border-[var(--secondary-bg)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--secondary-bg)] transition-colors"
                        >
                            {currentLocale === 'ar' ? 'إلغاء' : 'Cancel'}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SuccessPopup;