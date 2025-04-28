'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '../../../../components/breadcrumb';
import { formatPrice } from '../../../../lib/utils';
import html2canvas from 'html2canvas';
import type { CartItem } from '../../../../lib/cart';

interface LastOrder {
    orderId: string;
    items: CartItem[];
    total: string;
    orderDate: string;
}

export default function SuccessPage() {
    const t = useTranslations('checkout');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [orderData, setOrderData] = useState<LastOrder | null>(null);

    // Load order data from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedOrder = localStorage.getItem('lastOrder');
            if (storedOrder) {
                try {
                    const parsedOrder: LastOrder = JSON.parse(storedOrder);
                    setOrderData(parsedOrder);
                    console.log('Loaded lastOrder:', parsedOrder);
                } catch (err) {
                    console.error('Error parsing lastOrder:', err);
                }
            }
        }
    }, []);

    // Function to format order date
    const currentDate = new Date().toLocaleDateString(currentLocale === 'ar' ? 'ar-JO' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Function to export order summary as image with extra margin
    const handleExportImage = async () => {
        const captureSection = document.getElementById('capture-section');
        if (captureSection) {
            try {
                // Store original styles
                const originalPadding = captureSection.style.padding;
                const originalBackgroundColor = captureSection.style.backgroundColor;

                // Apply temporary styles for capture
                captureSection.style.padding = '20px'; // Add margin effect
                captureSection.style.backgroundColor = '#e8f5e9'; // Match html2canvas background

                const canvas = await html2canvas(captureSection, {
                    scale: 2, // Increase resolution
                    useCORS: true, // Handle cross-origin images
                    backgroundColor: '#e8f5e9', // Match background
                    height: captureSection.scrollHeight + 40, // Account for added padding
                    width: captureSection.scrollWidth + 40, // Account for added padding
                });

                // Restore original styles
                captureSection.style.padding = originalPadding;
                captureSection.style.backgroundColor = originalBackgroundColor;

                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `order_${orderData?.orderId}.png`;
                link.click();
            } catch (err) {
                console.error('Error generating image:', err);
                alert(t('errors.checkoutFailed')); // Notify user of failure
            }
        }
    };

    // Function to clear localStorage on continue shopping
    const handleContinueShopping = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('lastOrder');
        }
    };

    // Fallback UI if no order data
    if (!orderData) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
                <main className="container mx-auto max-w-full sm:max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <Breadcrumb pageName="success" />
                        <h1 className="text-4xl font-bold text-center mt-4" style={{ color: 'var(--text-primary)', fontSize: '36px' }}>
                            {t('noOrderTitle')}
                        </h1>
                    </div>
                    <div className="text-center py-10" style={{ color: 'var(--text-primary)' }}>
                        <Link
                            href={`/${currentLocale}/products`}
                            onClick={handleContinueShopping}
                            className="mt-4 inline-block px-4 py-2 rounded-md"
                            style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-white)' }}
                        >
                            {t('continueShopping')}
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
            <main className="container mx-auto max-w-full sm:max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <Breadcrumb pageName="success" />
                    <h1 className="text-4xl font-bold text-center mt-4" style={{ color: 'var(--text-primary)', fontSize: '36px' }}>
                        {t('success')}
                    </h1>
                </div>

                <div
                    id="order-summary"
                    className="max-w-2xl mx-auto rounded-lg shadow-md p-8"
                    style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'var(--secondary-bg)' }}
                >
                    <div id="capture-section">
                        <div className="mb-6">
                            <h2 className="font-medium" style={{ color: 'var(--accent-color)' }}>
                                {t('orderId', { id: orderData.orderId })}
                            </h2>
                            <p className="text-sm" style={{ color: 'var(--text-gray)' }}>{currentDate}</p>
                        </div>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-medium mb-4" style={{ color: 'var(--accent-color)' }}>
                                {t('thankYou')}
                            </h3>
                            <div className="flex justify-center">
                                <Image src="/success.svg" alt={t('illustrationAlt')} width={180} height={180} className="mb-4" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium mb-4" style={{ color: 'var(--accent-color)' }}>
                                {t('orderSummary')}
                            </h3>
                            <div className="space-y-3">
                                {orderData.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between border-b border-dashed pb-2"
                                        style={{ borderColor: 'var(--secondary-bg)' }}
                                    >
                                        <span style={{ color: 'var(--text-primary)' }}>
                                            {currentLocale === 'ar' ? item.name.ar : item.name.en || item.name.ar}
                                        </span>
                                        <span style={{ color: 'var(--text-gray)' }}>{t('quantity', { qty: item.quantity })}</span>
                                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {formatPrice(Number.parseFloat(item.price.replace(/[^\d.]/g, '')).toFixed(2), currentLocale)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{t('total')}</span>
                                    <span></span>
                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {formatPrice(orderData.total, currentLocale)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-6 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href={`/${currentLocale}/products`}
                            onClick={handleContinueShopping}
                            className="inline-block font-medium py-3 px-6 rounded-md"
                            style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--text-white)' }}
                        >
                            {t('continueShopping')}
                        </Link>
                        <button
                            onClick={handleExportImage}
                            className="inline-block font-medium py-3 px-6 rounded-md hover:cursor-pointer"
                            style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-white)' }}
                        >
                            {t('exportPDF')}
                        </button>
                    </div>

                    <div className="text-center text-sm" style={{ color: 'var(--text-gray)' }}>
                        {t('support')}{' '}
                        <Link href={`/${currentLocale}/contact`} className="underline" style={{ color: 'var(--accent-color)' }}>
                            {t('contactSupport')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}