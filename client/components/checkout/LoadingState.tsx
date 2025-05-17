'use client';

import { useTranslations } from 'next-intl';

interface LoadingStateProps {
    currentLocale: 'en' | 'ar';
}

export default function LoadingState({ currentLocale }: LoadingStateProps) {
    const t = useTranslations('');

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--primary-bg)' }}
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
            role="status"
            aria-live="polite"
            aria-label={t('Cart.loading')}
        >
            <main className="container mx-auto max-w-full sm:max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                {/* Header Skeleton (Breadcrumb + Title) */}
                <div className="mb-8">
                    {/* Breadcrumb Skeleton */}
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    {/* Title Skeleton */}
                    <div className="mt-4 h-8 w-48 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Main Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                    {/* Order Summary Skeleton (Left on lg, Top on mobile) */}
                    <div className="lg:col-span-2 sm:py-6 lg:py-0 order-1 lg:order-2">
                        <div
                            className="p-6 sm:p-8 w-[95%] md:w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto min-h-[450px] flex flex-col rounded-lg shadow-md"
                            style={{ backgroundColor: 'var(--primary-bg)' }}
                        >
                            {/* Order Summary Title */}
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-10" />
                            {/* Item List */}
                            <div className="space-y-4 mb-10 flex-grow">
                                {[...Array(2)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 border-b pb-4"
                                        style={{ borderColor: 'var(--secondary-bg)' }}
                                    >
                                        <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                                            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                                            <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Totals */}
                            <div className="border-t pt-8 space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details Skeleton (Right on lg, Bottom on mobile) */}
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <div
                            className="p-6 sm:p-8 w-[95%] md:w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto min-h-[450px] flex flex-col rounded-lg shadow-md"
                            style={{ backgroundColor: 'var(--primary-bg)' }}
                        >
                            {/* Payment Details Title */}
                            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
                            {/* Billing Details */}
                            <div className="space-y-6">
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                            {/* Coupon Section */}
                            <div className="my-6">
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="flex gap-2">
                                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                            {/* Payment Method */}
                            <div className="flex gap-4 mb-6">
                                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                            </div>
                            {/* Card Details */}
                            <div className="space-y-4">
                                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                            {/* Confirm Button */}
                            <div className="h-12 w-full bg-gray-200 rounded animate-pulse mt-6" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}