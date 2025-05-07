'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../../lib/store';
import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useStickyFooter } from '../../lib/useStickyFooter';
import { motion } from 'framer-motion';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';

function OrderSummary() {
  const t = useTranslations('');
  const pathname = usePathname();
  const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
  const { items, updateQuantity, removeItem, isLoading, error } = useCartStore();
  const isFooterVisible = useStickyFooter('.footer');

  const subtotal = items.reduce((sum, item) => {
    const price =item.price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(id, newQuantity, currentLocale);
    }
  };

  const handleRemove = (id: number) => {
    removeItem(id, currentLocale);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10" role="alert" aria-live="polite">
        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{t('cart.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500" role="alert" aria-live="polite">
        <p>{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{t('cart.empty')}</p>
        <Link
          href="/products"
          className="mt-4 inline-block px-4 py-2 text-white rounded-md"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`sticky-container p-6 sm:p-8 w-[95%] md:w-full max-w-md sm:max-w-lg lg:max-w-2xl lg:mx-7 min-h-[450px] mx-auto flex flex-col z-10 ${isFooterVisible ? 'lg:sticky lg:top-25' : 'lg:sticky lg:top-25'}`}
      role="region"
      aria-label={t('checkout.orderSummary')}
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <h2
        className="text-2xl font-semibold mb-10"
        style={{ color: 'var(--text-primary)' }}
      >
        {t('checkout.orderSummary')}
      </h2>

      <div className="space-y-4 mb-10 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(50vh - 100px)' }}>
        {items.map((item) => (
          <div
            className="flex items-center gap-4 border-b pb-4"
            style={{ borderColor: 'var(--secondary-bg)' }}
            key={item.id}
          >
            <Link href={`/${currentLocale}/products/${item.id}`} className="gap-4" passHref>
              <div className="w-20 h-20 relative">
                <Image
                  src={item.image[0] || '/placeholder.svg'}
                  alt={(currentLocale === 'ar' ? item.name_ar : item.name_en) || "Product Image"}
                  fill
                  className="object-cover rounded"
                  loading="lazy"
                />
              </div>
            </Link>
            <div className="flex-1">
              <h3 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {currentLocale === 'ar' ? item.name_ar : item.name_en || item.name_ar}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-gray)' }}>
                {t('checkout.price')}: {formatPrice(item.price.toFixed(2), currentLocale)}
              </p>
            </div>
            <div className="flex items-center gap-2 mx-3 my-2">
              <motion.button
                onClick={() => handleRemove(item.id)}
                className="self-end"
                style={{ color: '#ef4444' }}
                aria-label={t('cart.remove')}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
              <div
                className="flex flex-col items-center rounded-md border"
                style={{ backgroundColor: '', borderColor: 'var(--secondary-bg)' }}
              >
                <motion.button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center border-b hover:cursor-pointer "
                  style={{ color: 'var(--secondary-bg)' }}
                  aria-label={t('cart.increment')}

                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
                <span
                  className="w-7 text-center text-sm py-1"
                  style={{ color: 'var(--secondary-bg)' }}
                >
                  {item.quantity}
                </span>
                <motion.button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center border-t hover:cursor-pointer"
                  style={{ color: 'var(--secondary-bg)' }}
                  aria-label={t('cart.decrement')}
                  disabled={item.quantity <= 1}

                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="border-t pt-8 mb-10"
        style={{ borderColor: 'var(--accent-color)' }}
      >
        <div className="space-y-4">
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-gray)' }}>{t('cart.subtotal')}</span>
            <span className="font-medium">{formatPrice(subtotal.toFixed(2), currentLocale)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-gray)' }} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
              {t('cart.shipping')}
            </span>
            <span className="font-medium">{formatPrice(shipping.toFixed(2), currentLocale)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-gray)' }}>{t('cart.tax')}</span>
            <span className="font-medium">{formatPrice(tax.toFixed(2), currentLocale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">{t('cart.total')}</span>
            <span className="text-xl font-bold">{formatPrice(total.toFixed(2), currentLocale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;