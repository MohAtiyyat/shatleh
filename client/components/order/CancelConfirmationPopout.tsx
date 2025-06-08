'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface CancelConfirmationPopoutProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderCode: string;
  locale: 'en' | 'ar';
}

export default function CancelConfirmationPopout({
  isOpen,
  onClose,
  onConfirm,
  orderCode,
  locale,
}: CancelConfirmationPopoutProps) {
  const t = useTranslations('orders');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Popout Content */}
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-sm relative shadow-lg"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('confirmCancelTitle')}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t('confirmCancelMessage', { orderCode })}
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={onClose}
              >
                {t('cancelButton')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={onConfirm}
              >
                {t('confirmButton')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}