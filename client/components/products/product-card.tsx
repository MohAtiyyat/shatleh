'use client';

import Image from 'next/image';
import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../lib/store';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';
import { Product } from '../../lib/index';

// Utility function to truncate text
const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

interface ProductCardProps {
    product: Product;   
    index: number;
    pageName: string;
}

function ProductCard({ product, pageName }: ProductCardProps) {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'ar';
    const { userId } = useAuth();
    const cartItem = useCartStore((state) => state.items.find((item) => item.product_id === product.id));
    const addItem = useCartStore((state) => state.addItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const isLoading = useCartStore((state) => state.isLoading);
    const quantity = cartItem?.quantity || 0;

    const label = !product.availability
        ? t('products.outOfStockLabel')
        : product.sold_quantity && product.sold_quantity > 10
            ? t('products.topSellingLabel')
            : null;



    const description = truncateText(
        currentLocale === 'ar' ? product.description_ar : product.description_en,
        100
    );

    const handleAddToCart = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                await addItem(
                    {
                        product_id: product.id,
                        name_en: product.name_en,
                        name_ar: product.name_ar,
                        description_en: product.description_en,
                        description_ar: product.description_ar,
                        price: product.price,
                        image: product.image[0],
                    },
                    userId,
                    currentLocale
                );
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        },
        [addItem, product, userId, currentLocale, product.image]
    );

    const handleUpdateQuantity = useCallback(
        async (e: React.MouseEvent, newQuantity: number) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                await updateQuantity(product.id, newQuantity, userId, currentLocale);
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        },
        [updateQuantity, product.id, userId, currentLocale]
    );

    return (
        <Link href={`/${currentLocale}/products/${product.id}`} passHref>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                }}
                whileHover={{
                    scale: 1.03,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                className={
                    pageName !== 'products'
                        ? 'bg-[#337a5b] rounded-xl p-4 text-white flex flex-col justify-between h-full w-full relative cursor-pointer'
                        : 'bg-[#337a5b] rounded-xl p-4 text-white flex flex-col justify-between h-full relative cursor-pointer w-[280px]'
                }
                aria-label={currentLocale === 'ar' ? product.name_ar : product.name_en}
            >
                <div className="mb-4 flex justify-center items-center rounded-lg h-[270px] w-full relative">
                    {label && (
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white bg-[#025162] rounded-md">
                            {label}
                        </span>
                    )}
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL + product.image[0]}
                        alt={currentLocale === 'ar' ? product.name_ar : product.name_en}
                        width={300}
                        height={270}
                        className="object-cover rounded-lg w-full h-full"
                    />
                </div>
                <div className="flex flex-col flex-grow">
                    <h3 className="font-medium text-center mb-1 text-white">
                        {currentLocale === 'ar' ? product.name_ar : product.name_en}
                    </h3>
                    <p className="text-xs text-center mb-2 flex-grow text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {description}
                    </p>
                    <div className="flex justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-[#e5e5e5]'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        {product.price ? (
                            <span className="font-medium text-white">
                                {formatPrice(parseFloat(product.price), currentLocale)}
                            </span>
                        ) : (
                            <span className="font-medium text-white">{t('products.contactForPrice')}</span>
                        )}
                        {quantity === 0 ? (
                            <button
                                onClick={handleAddToCart}
                                disabled={isLoading || !product.availability}
                                className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isLoading || !product.availability ? 'cursor-not-allowed' : ''}`}
                                aria-label={t('products.addToCart')}
                            >
                                <ShoppingCart className="h-4 w-4" />
                            </button>
                        ) : (
                            <div
                                className="flex items-center rounded-md overflow-hidden border border-white"
                                role="group"
                                aria-label={t('products.quantityControl')}
                            >
                                <button
                                    onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                                    disabled={isLoading}
                                    className={`h-8 w-8 flex items-center justify-center transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isLoading ? 'cursor-wait' : ''}`}
                                    aria-label={t('products.decreaseQuantity')}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span
                                    className="h-8 w-8 flex items-center justify-center bg-[#337a5b] text-white"
                                    aria-live="polite"
                                >
                                    {quantity}
                                </span>
                                <button
                                    onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                                    disabled={isLoading || !product.availability}
                                    className={`h-8 w-8 flex items-center justify-center transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isLoading || !product.availability ? 'cursor-not-allowed' : ''}`}
                                    aria-label={t('products.increaseQuantity')}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export default memo(ProductCard);