'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Toast from '../../../../components/Toast';

type OrderStatus = 'all' | 'inProgress' | 'delivered' | 'cancelled';

interface OrderItem {
    name: { en: string; ar: string };
    price: number;
    image: string;
}

interface Order {
    id: string;
    status: 'inProgress' | 'delivered' | 'cancelled';
    date: { en: string; ar: string };
    total: number;
    paymentMethod: { en: string; ar: string };
    items: OrderItem[];
    itemCount: number;
}

const orders: Order[] = [
    {
        id: 'order1',
        status: 'delivered',
        date: { en: 'Apr 5, 2022, 10:07 AM', ar: '5 أبريل 2022، 10:07 ص' },
        total: 54,
        paymentMethod: { en: 'Cash', ar: 'نقدًا' },
        items: Array(6).fill({
            name: { en: 'Garden Plant', ar: 'نبات حديقة' },
            price: 9,
            image: '/placeholder.svg?height=50&width=50',
        }),
        itemCount: 6,
    },
    {
        id: 'order2',
        status: 'cancelled',
        date: { en: 'Apr 5, 2022, 10:07 AM', ar: '5 أبريل 2022، 10:07 ص' },
        total: 54,
        paymentMethod: { en: 'Cash', ar: 'نقدًا' },
        items: Array(6).fill({
            name: { en: 'Garden Plant', ar: 'نبات حديقة' },
            price: 9,
            image: '/placeholder.svg?height=50&width=50',
        }),
        itemCount: 6,
    },
    {
        id: 'order3',
        status: 'inProgress',
        date: { en: 'Apr 5, 2022, 10:07 AM', ar: '5 أبريل 2022، 10:07 ص' },
        total: 51.96,
        paymentMethod: { en: 'Credit Card', ar: 'بطاقة ائتمان' },
        items: [
            {
                name: { en: 'Sweet Green Seedless Grapes 1.5-2 lb', ar: 'عنب أخضر بدون بذور 1.5-2 رطل' },
                price: 25.98,
                image: '/placeholder.svg?height=50&width=50',
            },
            {
                name: { en: 'Sweet Green Seedless Grapes 1.5-2 lb', ar: 'عنب أخضر بدون بذور 1.5-2 رطل' },
                price: 25.98,
                image: '/placeholder.svg?height=50&width=50',
            },
        ],
        itemCount: 2,
    },
];

export default function OrdersPage() {
    const t = useTranslations('orders');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [activeTab, setActiveTab] = useState<OrderStatus>('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>('order3');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const filteredOrders = orders.filter((order) => activeTab === 'all' || order.status === activeTab);

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleCancelOrder = (orderId: string) => {
        const order = orders.find((o) => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            setToastMessage(t('successMessage'));
            setShowToast(true);
        } else {
            setToastMessage(t('errors.cancelFailed'));
            setShowToast(true);
        }
    };

    return (
        <div
            className="min-h-screen bg-[var(--primary-bg)] flex flex-col"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-[7vh]">
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
                        {['all', 'inProgress', 'delivered', 'cancelled'].map((tab, index) => (
                            <motion.button
                                key={tab}
                                whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                                whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab
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
                                className="bg-green-100 rounded-lg p-4 shadow-sm  overflow-hidden"
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: orderIndex * 0.05 }}
                                layout
                            >
                                <div className="flex flex-col md:flex-row justify-between mb-2">
                                    <div>
                                        <h2 className="text-lg font-medium">
                                            {t('order')} {t(order.status)}
                                        </h2>
                                        <p className="text-sm text-gray-600">{order.date[currentLocale]}</p>
                                    </div>
                                    <div className="flex items-center mt-2 md:mt-0">
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${order.status === 'delivered'
                                                    ? 'bg-green-500'
                                                    : order.status === 'cancelled'
                                                        ? 'bg-red-500'
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
                                            <p className="font-medium">${order.total.toFixed(2)}</p>
                                            <p className="text-sm text-gray-600">
                                                {t('paidWith')} {order.paymentMethod[currentLocale]}
                                            </p>
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
                                            <p className="text-sm text-gray-600">{order.itemCount}x</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                                            whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                                            className="text-green-700 hover:text-green-800 hover:bg-green-200 px-4 py-1 rounded-md flex flex-row items-center whitespace-nowrap"
                                            onClick={() => toggleOrderDetails(order.id)}
                                            aria-expanded={expandedOrder === order.id}
                                            aria-controls={`order-details-${order.id}`}
                                        >
                                            <span className="inline-flex">
                                                {expandedOrder === order.id ? t('hideDetails') : t('viewDetails')}
                                            </span>
                                            <svg
                                                className={`ml-1 h-4 w-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
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
                                                onClick={() => handleCancelOrder(order.id)}
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
                                    {expandedOrder === order.id && (
                                        <motion.div
                                            className="mt-4 bg-white rounded-lg p-4"
                                            initial={{ opacity: 0, height: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.98 }}
                                            transition={{ duration: 0.6, ease: [0.33, 0, 0.67, 1], transformOrigin: 'top' }}
                                            id={`order-details-${order.id}`}
                                            layout
                                        >
                                            {order.items.map((item, index) => (
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
                                                                src={item.image || '/placeholder.svg'}
                                                                alt={item.name[currentLocale]}
                                                                width={40}
                                                                height={40}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-sm">{item.name[currentLocale]}</p>
                                                    </div>
                                                    <p className="font-medium">${item.price.toFixed(2).replace(/\.00$/, '')}</p>
                                                </motion.div>
                                            ))}
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