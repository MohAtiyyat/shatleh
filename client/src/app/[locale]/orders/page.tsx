'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Toast from '../../../../components/Toast';
import { fetchOrders } from '../../../../lib/api'; 
import { Order, OrderProduct, Name } from '../../../../lib/index';

type OrderStatus = 'all' | 'pending' | 'inProgress' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const t = useTranslations('orders');
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders(currentLocale);
        setOrders(fetchedOrders);
        // Optionally expand the first order or a specific one
        if (fetchedOrders.length > 0) {
          setExpandedOrder(fetchedOrders[0].id.toString());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentLocale, t]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(
    (order) => activeTab === 'all' || order.status === activeTab
  );

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = (orderId: string) => {
    // Placeholder for cancel order API call
    setToastMessage(t('successMessage'));
    setShowToast(true);
    // Update local state (optimistic update)
    setOrders((prev) =>
      prev.map((order) =>
        order.id.toString() === orderId ? { ...order, status: 'cancelled' } : order
      )
    );
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[var(--primary-bg)] flex flex-col"
        dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-[7vh]">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-green-100 rounded-lg p-4 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen bg-[var(--primary-bg)] flex flex-col"
        dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-[7vh]">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => router.push(`/${currentLocale}/login`)}
            >
              {t('goToLogin')}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredOrders.length === 0) {
    return (
      <div
        className="min-h-screen bg-[var(--primary-bg)] flex flex-col"
        dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-[7vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p>{t('noOrders')}</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => router.push(`/${currentLocale}/products`)}
            >
              {t('shopNow')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[var(--primary-bg)] flex flex-col"
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-[酶vh]">
        {/* Title and Tabs Container */}
        <div className="w-full rounded-lg">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-2xl font-semibold text-green-700 mb-4"
          >
            {t('title')}
          </motion.h1>

          <motion.div
            className="flex gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          >
            {['all', 'pending', 'inProgress', 'delivered', 'cancelled'].map((tab, index) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-black border border-green-200 shadow-sm'
                    : 'bg-transparent text-gray-600 hover:text-black border border-transparent'
                }`}
                onClick={() => setActiveTab(tab as OrderStatus)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 + index * 0.03 }}
              >
                {t(tab)}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        >
          <AnimatePresence>
            {filteredOrders.map((order, orderIndex) => (
              <motion.div
                key={order.id}
                className="bg-green-100 rounded-lg p-4 shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: orderIndex * 0.05 }}
                layout
              >
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-medium">
                      {t('order')} #{order.order_code}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {new Date(order.delivery_date).toLocaleDateString(currentLocale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
                        order.status === 'delivered'
                          ? 'bg-green-500'
                          : order.status === 'cancelled'
                          ? 'bg-red-500'
                          : order.status === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {t(order.status === 'delivered' ? 'completed' : order.status)}
                    </motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <svg
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">${order.total_price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <svg
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{t('items')}</p>
                      <p className="text-sm text-gray-600">{order.products.length}x</p>
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                      whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                      className="text-green-700 hover:text-green-800 hover:bg-green-200 px-4 py-1 rounded-md flex flex-row items-center whitespace-nowrap"
                      onClick={() => toggleOrderDetails(order.id.toString())}
                      aria-expanded={expandedOrder === order.id.toString()}
                      aria-controls={`order-details-${order.id}`}
                    >
                      <span className="inline-flex">
                        {expandedOrder === order.id.toString() ? t('hideDetails') : t('viewDetails')}
                      </span>
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform ${
                          expandedOrder === order.id.toString() ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </motion.button>
                    {order.status === 'inProgress' && (
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                        whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-100 px-3 py-1 rounded-md flex flex-row items-center whitespace-nowrap"
                        onClick={() => handleCancelOrder(order.id.toString())}
                      >
                        <span className="inline-flex">{t('cancelOrder')}</span>
                      </motion.button>
                    )}
                    <svg
                      className="h-5 w-5 text-gray-400 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order.id.toString() && (
                    <motion.div
                      className="mt-4 bg-white rounded-lg p-4"
                      initial={{ opacity: 0, height: 0, scale: 0.98 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.33, 0, 0.67, 1], transformOrigin: 'top' }}
                      id={`order-details-${order.id}`}
                      layout
                    >
                      {order.products.map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex justify-between items-center py-3 border-b last:border-0"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: [0.33, 0, 0.67, 1], delay: index * 0.03 }}
                        >
                          <div className="flex items-center">
                            <div className="bg-green-50 p-2 rounded-md mr-3">
                              <Image
                                src={
                                    process.env.NEXT_PUBLIC_API_URL + item.image
                                }
                                alt={item.name[currentLocale]}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm">{item.name[currentLocale]}</p>
                              <p className="text-xs text-gray-600">
                                {t('quantity')}: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">${parseFloat(item.price).toFixed(2).replace(/\.00$/, '')}</p>
                        </motion.div>
                      ))}
                      {order.address && (
                        <div className="mt-4">
                          <p className="font-medium">{t('shippingAddress')}</p>
                          <p className="text-sm text-gray-600">
                            {order.address.title}, {order.address.city}, {order.address.address_line}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}