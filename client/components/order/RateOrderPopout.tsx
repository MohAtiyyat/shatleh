'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Order } from '../../lib';
import { submitOrderRatings, skipOrderRating } from '../../lib/api';

// Type for ratings state
interface Ratings {
  [productId: number]: number;
}

interface RateOrderPopoutProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  locale: string;
}

// Reusable StarRating component
function StarRating({
  productId,
  rating,
  onRate,
  productName,
}: {
  productId: number;
  rating: number | undefined;
  onRate: (productId: number, rating: number) => void;
  productName: string;
  locale: string;
}) {
  const t = useTranslations('rateOrder');
  return (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          onClick={() => onRate(productId, star)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onRate(productId, star);
            }
          }}
          className={`text-xl ${
            rating && rating >= star ? 'text-yellow-400' : 'text-gray-300'
          } hover:scale-110 focus:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={t('starRating', { star, productName })}
          tabIndex={0}
        >
          {rating && rating >= star ? '🟊' : '☆'}
        </motion.button>
      ))}
    </div>
  );
}

export default function RateOrderPopout({ order, isOpen, onClose, onSkip, locale }: RateOrderPopoutProps) {
  const t = useTranslations('rateOrder');
  const [ratings, setRatings] = useState<Ratings>({});
  const [submitting, setSubmitting] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popoutRef = useRef<HTMLDivElement>(null);

  // Reset state when popout opens or order changes
  useEffect(() => {
    if (isOpen && order) {
      setRatings({});
      setError(null);
    }
  }, [isOpen, order]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen || !popoutRef.current) return;

    const focusableElements = popoutRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRating = useCallback((productId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [productId]: rating }));
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!order || submitting) return;

    const allProductsRated = order.products.every((p) => ratings[p.id]);
    if (!allProductsRated) {
      setError(t('rateAllProducts'));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await submitOrderRatings(
        order.id,
        order.products.map((p) => ({
          product_id: p.id,
          rating: ratings[p.id],
        })),
        locale
      );
      onClose();
    } catch (err) {
      console.error('Error submitting order ratings:', err);
      setError(err instanceof Error ? err.message : t('submitFailed'));
    } finally {
      setSubmitting(false);
    }
  }, [order, submitting, ratings, locale, onClose, t]);

  const handleSkip = useCallback(async () => {
    if (!order || skipping) return;

    setSkipping(true);
    setError(null);
    try {
      await skipOrderRating(order.id, locale);
      onSkip();
    } catch (err) {
      console.error('Error skipping order rating:', err);
      setError(err instanceof Error ? err.message : t('skipFailed'));
    } finally {
      setSkipping(false);
    }
  }, [order, skipping, locale, onSkip, t]);

  if (!order) return null;

  // Calculate rated products for progress indicator
  const ratedCount = order.products.filter((p) => ratings[p.id]).length;
  const totalCount = order.products.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Popout Content */}
          <motion.div
            ref={popoutRef}
            className="bg-white rounded-2xl shadow-lg max-w-md w-full relative overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            role="dialog"
            aria-labelledby="rate-order-title"
            aria-describedby="rate-order-description"
          >
            <div className="bg-gradient-to-r from-[var(--accent-color)] to-green-600 p-4 flex justify-between items-center">
              <h2 id="rate-order-title" className="text-lg font-semibold text-white tracking-tight">
                {t('rateOrder')} #{order.order_code}
              </h2>
              <button
                className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
                onClick={onClose}
                aria-label={t('close')}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3" id="rate-order-description">
              {order.products.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">{t('noProductsToRate')}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 text-center">
                    {t('progress', { ratedCount, totalCount })}
                  </p>
                  {order.products.map((product) => (
                    <motion.div
                      key={product.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={product.image ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}` : '/placeholder.svg'}
                        alt={locale === 'en' ? product.name.en : product.name.ar}
                        width={48}
                        height={48}
                        className="object-cover rounded-md flex-shrink-0"
                        priority
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {locale === 'en' ? product.name.en : product.name.ar}
                        </p>
                        <StarRating
                          productId={product.id}
                          rating={ratings[product.id]}
                          onRate={handleRating}
                          productName={locale === 'en' ? product.name.en : product.name.ar}
                          locale={locale}
                        />
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
              {error && (
                <motion.p
                  className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </motion.p>
              )}
            </div>
            <div className="p-4 bg-gray-50 flex justify-between gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-2 px-4 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 ${
                  skipping ? 'opacity-50 cursor-not-allowed' : ''
                } focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center`}
                onClick={handleSkip}
                disabled={skipping}
                aria-busy={skipping}
              >
                {skipping ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('skipping')}
                  </span>
                ) : (
                  t('skip')
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-2 px-4 rounded-full bg-[var(--accent-color)] text-white hover:bg-[var(--footer-accent)] transition-colors duration-200 ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                } focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] flex items-center justify-center`}
                onClick={handleSubmit}
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('submitting')}
                  </span>
                ) : (
                  t('submitRatings')
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}