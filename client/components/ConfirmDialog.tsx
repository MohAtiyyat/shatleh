'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText,
    cancelText,
}: ConfirmDialogProps) {
    const t = useTranslations('addresses');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
                    style={{ backdropFilter: 'blur(0.8px)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bg-[var(--primary-bg)] rounded-lg p-6 max-w-md w-full mx-4 shadow-[var(--shadow-md)]"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                            {title || t('confirmDeleteTitle')}
                        </h2>
                        <p className="text-[var(--text-gray)] mb-6">
                            {message || t('confirmDeleteMessage')}
                        </p>
                        <div className="flex justify-end gap-2">
                            <motion.button
                                onClick={onCancel}
                                className="px-4 py-2 border border-[var(--secondary-bg)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--secondary-bg)] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cancelText || t('confirmDeleteCancel')}
                            </motion.button>
                            <motion.button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-[var(--accent-color)] text-[var(--text-white)] rounded-lg hover:bg-[var(--footer-accent)] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {confirmText || t('confirmDeleteConfirm')}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}