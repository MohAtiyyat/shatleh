'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '../../lib/store';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';

interface CartItem {
    id: number;
    product_id: number;
    customer_id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    price: string;
    image: string;
    quantity: number;
}

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const t = useTranslations('');
    const currentLocale = usePathname().split('/')[1] || 'ar';
    const { items, updateQuantity, removeItem, total, isLoading } = useCartStore();
    const { userId } = useAuth();

    // Close cart when pressing escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
        if (newQuantity <= 0) {
            await removeItem(item.product_id, userId, currentLocale);
        } else {
            await updateQuantity(item.product_id, newQuantity, userId, currentLocale);
        }
    };

    const formatPrice = (price: string) => {
        if (price.match(/[^0-9.,]/)) return price;
        return currentLocale === 'en' ? `${price} JD` : `${price} د.أ`;
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Cart Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: currentLocale === 'ar' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: currentLocale === 'ar' ? '-100%' : '100%' }}
                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                        className={`fixed top-17x  ${currentLocale === 'ar' ? 'left-0 rounded-r-lg' : 'right-0 rounded-l-lg'} h-[90vh] w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col `}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-medium flex items-center">
                                {t('Cart.title')}
                                <ShoppingCart className="mx-2 h-5 w-5" />
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                    <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">{t('Cart.empty')}</p>
                                    <p className="mt-1">{t('Cart.addProducts', { defaultMessage: 'Add some products to your cart' })}</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-6 bg-[#337a5b] text-white px-4 py-2 rounded-md hover:bg-[#025162] transition-colors"
                                    >
                                        {t('Cart.continueShopping')}
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex border-b pb-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mx-2">
                                            <Image
                                                src={process.env.NEXT_PUBLIC_API_URL + item.image[0] || '/placeholder.svg'}
                                                alt={currentLocale === 'en' ? item.name_en : item.name_ar || 'product'}
                                                width={80}
                                                height={80}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="mx-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{currentLocale === 'en' ? item.name_en : item.name_ar}</h3>
                                                    <p>{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        disabled={isLoading}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="px-2 py-1 min-w-[30px] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                        disabled={isLoading}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.product_id, userId, currentLocale)}
                                                    disabled={isLoading}
                                                    className="font-medium text-[#337a5b] hover:text-[#025162]"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-200 p-4 space-y-4">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>{t('Cart.total')}</p>
                                    <p>{formatPrice(total().toFixed(2))}</p>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {t('Cart.shippingTaxes', { defaultMessage: 'Shipping and taxes calculated at checkout.' })}
                                </p>
                                <div className="mt-6">
                                    <Link href={`/${currentLocale}/checkout`}>
                                        <button className="w-full bg-[#20c015] hover:bg-[#27eb00] text-white px-6 py-3 rounded-md transition-colors">
                                            {t('Cart.checkout')}
                                        </button>
                                    </Link>
                                </div>
                                <div className="mt-2">
                                    <button
                                        onClick={onClose}
                                        className="w-full text-center text-[#337a5b] hover:text-[#025162] text-sm"
                                    >
                                        {t('Cart.continueShopping')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}