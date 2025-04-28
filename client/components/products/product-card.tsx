'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../lib/store';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type ProductCardProps = {
    product: {
        id: number;
        name: {
            en: string;
            ar: string;
        };
        description: {
            en: string;
            ar: string;
        };
        price?: string;
        rating: number;
        image: string;
        category?: string;
        categoryAr?: string;
        inStock?: boolean;
        isTopSelling?: boolean;
    };
    index: number;
    pageName: string
};

export default function ProductCard({ product, index , pageName }: ProductCardProps ) {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'ar';
    const { items, addItem, updateQuantity, isLoading } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);
    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const label = product.inStock === false 
        ? t('products.outOfStockLabel')
        : product.isTopSelling
        ? t('products.topSellingLabel')
        : null;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        try {
            await addItem(
                {
                    id: product.id,
                    name: product.name,
                    price: product.price || "0",
                    image: product.image,
                }
                
                , currentLocale);
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
                ease: "easeOut",
            }}
            whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            className={pageName !== "products" ? "bg-[#337a5b] rounded-xl p-4 text-white flex flex-col justify-between h-full w-full relative cursor-pointer" : "bg-[#337a5b] rounded-xl p-4 text-white flex flex-col justify-between h-full relative cursor-pointer min-w-[280px] max-w-[280px] mx-2"}
            
                        
        >
            <div className="mb-4 flex justify-center items-center rounded-lg h-[270px] w-full relative ">
                {label && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white bg-[#025162] rounded-md">
                        {label}
                    </span>
                )}
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name[currentLocale as "en" | "ar"]}
                    width={300}
                    height={270}
                    className="object-cover rounded-lg w-full h-full"
                />
            </div>
            <div className="flex flex-col flex-grow">
                <h3 className="font-medium text-center mb-1 text-white">
                    {product.name[currentLocale as "en" | "ar"]}
                </h3>
                <p className="text-xs text-center mb-2 flex-grow text-white">
                    {product.description[currentLocale as "en" | "ar"].split(" ").slice(0, 10).join(" ")}
                </p>
                <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-[#e5e5e5]"}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    {product.price ? (
                        <span className="font-medium text-white">{product.price}</span>
                    ) : (
                        <span className="font-medium text-white">{t("products.contactForPrice")}</span>
                    )}
                    {quantity === 0 ? (
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || isLoading || product.inStock === false}
                            className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isAdding || isLoading || product.inStock === false ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </button>
                    ) : (
                        <div className="flex items-center rounded-md overflow-hidden border border-white">
                            <button
                                onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                                disabled={isAdding || isLoading}
                                className={`h-8 w-8 flex items-center justify-center transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isAdding || isLoading ? "opacity-70 cursor-wait" : ""
                                    }`}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="h-8 w-8 flex items-center justify-center bg-[#337a5b] text-white">
                                {quantity}
                            </span>
                            <button
                                onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                                disabled={isAdding || isLoading || product.inStock === false}
                                className={`h-8 w-8 flex items-center justify-center transition-colors bg-white text-[#337a5b] hover:bg-gray-200 ${isAdding || isLoading || product.inStock === false ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
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