'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../lib/store';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '../../lib/utils';
import type { Product } from '../../lib/index';

type ProductCardProps = {
    product: Product;
    index: number;
    pageName: string;
};

export default function ProductCard({ product, index, pageName }: ProductCardProps) {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'ar';
    const { items, addItem, updateQuantity, isLoading } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);
    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const label = product.availability === 0
        ? t('products.outOfStockLabel')
        : product.sold_quantity > 0
            ? t('products.topSellingLabel')
            : null;

    // const imagePath = product.image ? JSON.parse(product.image)[0] : '/placeholder.svg';

    // console.log('Product Image Path:', imagePath);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        try {
            await addItem(
                {
                    id: product.id,
                    name_ar: product.name_ar,
                    name_en: product.name_en,
                    description_ar: product.description_ar,
                    description_en: product.description_en,
                    price: product.price,
                    image: product.image,
                },
                currentLocale
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdateQuantity = async (e: React.MouseEvent, newQuantity: number) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        try {
            await updateQuantity(product.id, newQuantity, currentLocale);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Link href={`/${currentLocale}/products/${product.id}`} passHref>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: 'easeOut',
                }}
                whileHover={{
                    scale: 1.03,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                className={
                    pageName !== 'products'
                        ? 'bg-[#337a5b] rounded-xl p-4 text-white flex flex-col justify-between h-full w-full relative cursor-pointer'
                        : 'bg-[#337a5b] rounded-xl p-4 text-white flex flex-col justify-between h-full relative cursor-pointer w-full sm:w-[280px]'
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
                        src={ `${process.env.NEXT_PUBLIC_API_URL}${product.image}` }
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
                    <p className="text-xs text-center mb-2 flex-grow text-white">
                        {currentLocale === 'ar' ? product.description_ar : product.description_en}
                    </p>
                    <div className="flex justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(Number(product.rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-[#e5e5e5]'}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        {product.price ? (
                            <span className="font-medium text-white">{formatPrice(product.price, currentLocale)}</span>
                        ) : (
                            <span className="font-medium text-white">{t('products.contactForPrice')}</span>
                        )}
                        {quantity === 0 ? (
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || isLoading || product.availability === 0}
                                className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isAdding || isLoading || product.availability === 0 ? 'cursor-not-allowed' : ''}`}
                                aria-label={t('products.addToCart')}
                            >
                                <ShoppingCart className="h-4 w-4" />
                            </button>
                        ) : (
                            <div className="flex items-center rounded-md overflow-hidden border border-white" role="group" aria-label={t('products.quantityControl')}>
                                <button
                                    onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                                    disabled={isAdding || isLoading}
                                    className={`h-8 w-8 flex items-center justify-center transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isAdding || isLoading ? 'cursor-wait' : ''}`}
                                    aria-label={t('products.decreaseQuantity')}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="h-8 w-8 flex items-center justify-center bg-[#337a5b] text-white" aria-live="polite">
                                    {quantity}
                                </span>
                                <button
                                    onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                                    disabled={isAdding || isLoading || product.availability === 0}
                                    className={`h-8 w-8 flex items-center justify-center transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isAdding || isLoading || product.availability === 0 ? 'cursor-not-allowed' : ''}`}
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