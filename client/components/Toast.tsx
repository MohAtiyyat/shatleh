'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto-dismiss after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[13vh] left-1/2 transform -translate-x-1/2 bg-[var(--accent-color)] text-[var(--text-white)] px-6 py-3 rounded-lg shadow-[var(--shadow-md)] max-w-md w-full text-center z-50"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
            role="alert"
            aria-live="polite"
        >
            {message}
        </motion.div>
    );
}