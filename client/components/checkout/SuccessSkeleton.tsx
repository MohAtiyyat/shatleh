'use client';

import { useTranslations } from 'next-intl';

interface SuccessSkeletonProps {
    currentLocale: 'en' | 'ar';
}

export default function SuccessSkeleton({ currentLocale }: SuccessSkeletonProps) {
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
            <main className="container mx-auto max-w-full sm:max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow">
                {/* Header Skeleton (Breadcrumb + Title) */}
                <div className="mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="mt-4 h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
                </div>

                {/* Order Summary Skeleton */}
                <div
                    className="max-w-2xl mx-auto rounded-lg shadow-md p-8"
                    style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'var(--secondary-bg)' }}
                >
                    {/* Order ID and Date */}
                    <div className="mb-6">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-2" />
                    </div>

                    {/* Thank You Section */}
                    <div className="text-center mb-6">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
                        <div className="flex justify-center">
                            <div className="h-32 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Order Summary Items */}
                    <div className="mb-6">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="space-y-3">
                            {[...Array(2)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b border-dashed pb-2"
                                    style={{ borderColor: 'var(--secondary-bg)' }}
                                >
                                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                            <div className="flex items-center justify-between pt-2">
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center mb-6 flex flex-col sm:flex-row justify-center gap-4">
                        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Support Link */}
                    <div className="text-center">
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
                    </div>
                </div>
            </main>
        </div>
    );
}