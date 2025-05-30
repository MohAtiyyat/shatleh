'use client';

import { useCallback, useState, memo, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCartStore } from '../../lib/store';
import { formatPrice } from './CartSummary';
import { usePathname } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';
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

function CartItemList() {
    const t = useTranslations('Cart');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const { items } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="text-center py-8 sm:py-10">
                <p className="text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>
                    {t('empty')}
                </p>
                <Link
                    href={`/${currentLocale}/products`}
                    className="mt-4 inline-block px-4 py-2 text-white text-sm sm:text-base rounded-md"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                >
                    {t('continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4 w-full">
            {items.map((item) => (
                <CartItemCard key={item.id} item={item} currentLocale={currentLocale} />
            ))}
        </div>
    );
}

interface CartItemCardProps {
    item: CartItem;
    currentLocale: 'en' | 'ar';
}

const CartItemCard = memo(function CartItemCard({ item, currentLocale }: CartItemCardProps) {
    const t = useTranslations('Cart');
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { updateQuantity, removeItem } = useCartStore();
    const { userId } = useAuth();
    const [currentQuantity, setCurrentQuantity] = useState(item.quantity);

    // Subscribe to the specific item's quantity
    useEffect(() => {
        const unsubscribe = useCartStore.subscribe(
            (state) => state.items.find((i) => i.product_id === item.product_id)?.quantity,
            (newQuantity) => {
                if (newQuantity !== undefined) {
                    setCurrentQuantity(newQuantity);
                }
            }
        );
        return () => unsubscribe();
    }, [item.product_id]);

    // Debounce helper to prevent rapid successive updates
    let debounceTimeout: NodeJS.Timeout | null = null;

    const handleDecrement = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentQuantity <= 1) return;
        const newQuantity = currentQuantity - 1;
        setIsUpdating(true);
        setError(null);

        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            try {
                await updateQuantity(item.product_id, newQuantity, userId, currentLocale);
            } catch (err) {
                setError(t('updateQuantityError'));
                console.error('Error updating quantity:', err);
            } finally {
                setIsUpdating(false);
            }
        }, 300);
    }, [currentQuantity, item.product_id, userId, currentLocale, updateQuantity, t]);

    const handleIncrement = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newQuantity = currentQuantity + 1;
        setIsUpdating(true);
        setError(null);

        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            try {
                await updateQuantity(item.product_id, newQuantity, userId, currentLocale);
            } catch (err) {
                setError(t('updateQuantityError'));
                console.error('Error updating quantity:', err);
            } finally {
                setIsUpdating(false);
            }
        }, 300);
    }, [currentQuantity, item.product_id, userId, currentLocale, updateQuantity, t]);

    const handleRemove = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsUpdating(true);
        setError(null);
        try {
            await removeItem(item.product_id, userId, currentLocale);
        } catch (err) {
            setError(t('removeItemError'));
            console.error('Error removing item:', err);
        } finally {
            setIsUpdating(false);
        }
    }, [item.product_id, userId, currentLocale, removeItem, t]);

    return (
        <div
            className="rounded-lg overflow-hidden border shadow-sm w-full my-2 sm:my-3"
            style={{ borderColor: 'var(--secondary-bg)', backgroundColor: 'var(--accent-color)' }}
        >
            {error && (
                <div className="text-red-500 text-xs sm:text-sm p-2 text-center" role="alert">
                    {error}
                </div>
            )}
            <div className="flex  sm:flex-row items-start sm:items-center p-3 sm:p-4">
                <div className="flex flex-col items-center sm:items-start mx-1 sm:mx-3 mb-3 sm:mb-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
                        <Link href={`/${currentLocale}/products/${item.product_id}`} passHref>
                            <Image
                                src={process.env.NEXT_PUBLIC_API_URL  +  item.image[0]}
                                alt={item.name_en || item.name_ar || ''}
                                fill
                                className="object-cover rounded"
                                loading="lazy"
                            />
                        </Link>
                    </div>
                    <p
                        className="font-semibold text-xs sm:hidden mt-2 text-center"
                        style={{ color: 'var(--text-white)' }}
                    >
                        {t('price')}: {formatPrice(item.price, currentLocale)}
                    </p>
                </div>
                <div className="flex-1 w-[40%]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-3 sm:mb-0 max-w-[40%] sm:max-w-[60%]">
                            <h3
                                className="font-medium text-sm sm:text-base"
                                style={{ color: 'var(--text-white)' }}
                            >
                                {currentLocale === 'en' ? item.name_en : item.name_ar}
                            </h3>
                            {(item.description_en || item.description_ar) && (
                                <p
                                    className="text-xs sm:text-sm text-[#dbdada] line-clamp-2 overflow-hidden"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflowWrap: 'break-word',
                                        direction: currentLocale === 'ar' ? 'rtl' : 'ltr',
                                    }}
                                >
                                    {currentLocale === 'en' ? item.description_en : item.description_ar}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center sm:items-start space-x-2 sm:space-x-4 w-full sm:w-auto">
                            <div className="flex flex-col items-center">
                                <div
                                    className="flex items-center border rounded"
                                    style={{ borderColor: 'var(--secondary-bg)' }}
                                >
                                    <button
                                        onClick={handleDecrement}
                                        className="w-7 h-7 flex items-center justify-center hover:cousor-pointer"
                                        style={{ color: 'var(--text-white)' }}
                                        disabled={isUpdating || currentQuantity <= 1}
                                        aria-label={t('decrement')}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span
                                        className="w-7 text-center text-sm"
                                        style={{ color: 'var(--text-white)' }}
                                        aria-live="polite"
                                    >
                                        {currentQuantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        className="w-7 h-7 flex items-center justify-center hover:cousor-pointer"
                                        style={{ color: 'var(--text-white)' }}
                                        disabled={isUpdating}
                                        aria-label={t('increment')}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p
                                    className="font-semibold    text-sm hidden sm:block"
                                    style={{ color: 'var(--text-white)' }}
                                >
                                    {t('price')}: {formatPrice(item.price, currentLocale)}
                                </p>
                                <button
                                    onClick={handleRemove}
                                    className="mt-2 hover:text-[var(--text-hover)] hover:cursor-pointer"
                                    style={{ color: '#ef4444' }}
                                    disabled={isUpdating}
                                    aria-label={t('remove')}
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default memo(CartItemList);