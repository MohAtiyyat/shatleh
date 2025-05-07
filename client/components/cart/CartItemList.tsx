'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCartStore } from '../../lib/store';
import type { CartItem } from '../../lib/cart';
import { usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CartItemListProps {
    items: CartItem[];
}

function CartItemList({ items }: CartItemListProps) {
    return (
        <div className="space-y-4 max-w-sm sm:max-w-2xl mx-auto">
            {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
            ))}
        </div>
    );
}

interface CartItemCardProps {
    item: CartItem;
}

function CartItemCard({ item }: CartItemCardProps) {
    const t = useTranslations('');
    const [quantity, setQuantity] = useState(item.quantity);
    const { updateQuantity, removeItem } = useCartStore();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';
    const currentLocale: 'en' | 'ar' = locale === 'en' || locale === 'ar' ? locale : 'ar';

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            updateQuantity(item.id, newQuantity, currentLocale);
        }
    };

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        updateQuantity(item.id, newQuantity, currentLocale);
    };

    const handleRemove = () => {
        removeItem(item.id, currentLocale);
    };

    const price = Number.parseFloat(item.price.replace(/[^\d.]/g, ''));

    return (
        <div className="rounded-lg overflow-hidden border shadow-full sm:max-w-lg md:max-w-2xl sm:mx-auto " style={{ borderColor: 'var(--secondary-bg)', backgroundColor: 'var(--accent-color)' }}>
            <div className="flex items-center  p-3">
                <Link href={`/${currentLocale}/products/${item.id}`} passHref>
                    <div className="w-20 h-20 relative mx-3">
                        <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.name[currentLocale] || item.name.en}
                            fill
                            className="object-cover rounded"
                            loading="lazy"
                        />
                    </div>
                </Link>
                <div className="flex-1 mt-4">
                    <div className="flex justify-between  items-start">
                        <div>
                            <h3
                                className="font-medium text-sm"
                                style={{ color: 'var(--text-white)' }}
                            >
                                {item.name[currentLocale] || item.name.en}
                            </h3>
                            {item.description && (
                                <p
                                    className="text-xs"
                                    style={{ color: 'var(--text-gray)' }}
                                >
                                    {item.description[currentLocale] || item.description.en}
                                </p>
                            )}
                        </div>
                        <div className="text-right flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className="flex items-center border rounded"
                                    style={{ borderColor: 'var(--secondary-bg)' }}
                                >
                                    <button
                                        onClick={handleDecrement}
                                        className="w-7 h-7 flex items-center justify-center"
                                        style={{ color: 'var(--text-white)' }}
                                        disabled={quantity <= 1}
                                        aria-label={t('cart.decrement')}
                                    >
                                        -
                                    </button>
                                    <span
                                        className="w-7 text-center text-sm"
                                        style={{ color: 'var(--text-white)' }}
                                    >
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        className="w-7 h-7 flex items-center justify-center"
                                        style={{ color: 'var(--text-white)' }}
                                        aria-label={t('cart.increment')}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p
                                    className="font-semibold text-sm"
                                    style={{ color: 'var(--text-white)' }}
                                >
                                    {t('cart.price')}: ${price.toFixed(2)}
                                </p>
                                <button
                                    onClick={handleRemove}
                                    className="mt-2 hover:text-[var(--text-hover)]"
                                    style={{ color: '#ef4444' }}
                                    aria-label={t('cart.remove')}
                                >
                                    <Trash2 className="w-6 h-6 " />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(CartItemList);